const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "referrer",
  "landingPath",
];
const MAX_ATTRIBUTION_LENGTH = 500;
const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const RESEND_CONTACTS_ENDPOINT = "https://api.resend.com/contacts";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Allow", "POST, OPTIONS");
    return res.end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, {
      ok: false,
      saved: false,
      error: "Method not allowed.",
    });
  }

  let body;

  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, {
      ok: false,
      saved: false,
      error: "Invalid JSON body.",
    });
  }

  const email = normalizeEmail(body.email);

  if (!EMAIL_REGEX.test(email)) {
    return sendJson(res, 400, {
      ok: false,
      saved: false,
      error: "Please enter a valid email.",
    });
  }

  const submittedAt = new Date().toISOString();
  const attribution = normalizeAttribution(body.attribution);
  const submission = {
    email,
    submittedAt,
    source: "clipzy-landing",
    version: "launch-list-v2",
    ...attribution,
  };

  const formsparkResult = await saveToFormspark(submission);

  if (!formsparkResult.ok) {
    return sendJson(res, 502, {
      ok: false,
      saved: false,
      error: "Unable to save your waitlist signup right now. Please try again.",
    });
  }

  const resendContact = await createResendContact(email);
  const welcomeEmail = await sendWelcomeEmail(email);

  return sendJson(res, 200, {
    ok: true,
    saved: true,
    contactSynced: resendContact.synced,
    contactId: resendContact.id,
    welcomeEmailSent: welcomeEmail.sent,
    welcomeEmailId: welcomeEmail.id,
    submission: {
      email,
      submittedAt,
      attribution,
    },
  });
}

async function readJsonBody(req) {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeAttribution(attribution = {}) {
  const normalized = {};

  for (const field of ATTRIBUTION_FIELDS) {
    normalized[field] = normalizeAttributionValue(attribution[field]);
  }

  normalized.landingPath = normalized.landingPath || "/";

  return normalized;
}

function normalizeAttributionValue(value) {
  return String(value || "").trim().slice(0, MAX_ATTRIBUTION_LENGTH);
}

async function saveToFormspark(submission) {
  const endpoint = getFormsparkEndpoint();

  if (!endpoint) {
    console.error("Formspark waitlist save skipped: missing FORMSPARK_FORM_ID.");
    return { ok: false };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      const responseText = await safeReadText(response);
      console.error("Formspark waitlist save failed.", response.status, responseText);
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error("Formspark waitlist save failed.", error);
    return { ok: false };
  }
}

function getFormsparkEndpoint() {
  const override = process.env.FORMSPARK_ACTION_URL?.trim();

  if (override) {
    return override;
  }

  const formId = process.env.FORMSPARK_FORM_ID?.trim();

  if (!formId) {
    return "";
  }

  return `https://submit-form.com/${encodeURIComponent(formId)}`;
}

async function createResendContact(email) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.warn("Resend contact sync skipped: missing RESEND_API_KEY.");
    return { synced: false, id: "" };
  }

  const segmentId = process.env.RESEND_WAITLIST_SEGMENT_ID?.trim();
  const body = {
    email,
    unsubscribed: false,
  };

  if (segmentId) {
    body.segments = [{ id: segmentId }];
  }

  try {
    const response = await fetch(RESEND_CONTACTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const responseText = await safeReadText(response);
      console.error("Resend contact sync failed.", response.status, responseText);
      return { synced: false, id: "" };
    }

    const responseBody = await safeReadJson(response);

    return {
      synced: true,
      id: responseBody?.id || "",
    };
  } catch (error) {
    console.error("Resend contact sync failed.", error);
    return { synced: false, id: "" };
  }
}

async function sendWelcomeEmail(email) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.WAITLIST_WELCOME_FROM_EMAIL?.trim();

  if (!apiKey || !fromEmail) {
    console.warn("Waitlist welcome email skipped: missing Resend env vars.");
    return { sent: false, id: "" };
  }

  const fromName = process.env.WAITLIST_WELCOME_FROM_NAME?.trim() || "Clipzy";
  const replyTo = process.env.WAITLIST_WELCOME_REPLY_TO_EMAIL?.trim();
  const body = {
    from: formatSender(fromName, fromEmail),
    to: [email],
    subject: "You’re on the Clipzy launch list",
    text: renderWelcomeEmailText(),
    html: renderWelcomeEmailHtml(),
  };

  if (replyTo) {
    body.reply_to = replyTo;
  }

  try {
    const response = await fetch(RESEND_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const responseText = await safeReadText(response);
      console.error("Waitlist welcome email failed.", response.status, responseText);
      return { sent: false, id: "" };
    }

    const responseBody = await safeReadJson(response);

    return {
      sent: true,
      id: responseBody?.id || "",
    };
  } catch (error) {
    console.error("Waitlist welcome email failed.", error);
    return { sent: false, id: "" };
  }
}

function formatSender(name, email) {
  const cleanName = name.replaceAll('"', "'");

  return cleanName ? `${cleanName} <${email}>` : email;
}

function renderWelcomeEmailText() {
  return [
    "Hey streamer,",
    "",
    "You’re on the Clipzy launch list. We’ll email you as soon as Clipzy lands on the App Store and Google Play.",
    "",
    "Clipzy turns your Twitch backlog into a simple mobile workflow: review one clip at a time, keep what matters, find it later, then trim, reframe, caption, export, and share.",
    "",
    "Your reviews, collections, edits, and downloads stay on your device. The free plan includes 20 finished exports every 30 days; Clipzy Pro adds unlimited exports and removes ads.",
    "",
    "See what’s coming: https://clipzy.xyz",
    "",
    "You joined the Clipzy launch list at clipzy.xyz. Future product updates will include an unsubscribe link.",
  ].join("\n");
}

function renderWelcomeEmailHtml() {
  return `<!doctype html>
<html lang="en" style="background:#0E0F12;">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Clipzy – Launch List</title>
</head>
<body style="margin:0;padding:0;background:#0E0F12;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0E0F12;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;border-collapse:collapse;background:#1B1E24;">
          <tr>
            <td style="padding:28px 28px 8px;">
              <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#2A2F36;color:#B4BAC2;font:12px Inter,Segoe UI,Helvetica,Arial,sans-serif;">You’re on the launch list</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
              <h1 style="margin:0;color:#F3F5F7;font-size:26px;line-height:1.3;font-weight:800;">Turn Twitch clips into shorts worth posting.</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
              <p style="margin:0 0 12px;color:#F3F5F7;font-size:16px;line-height:1.6;">Hey streamer,</p>
              <p style="margin:0 0 12px;color:#B4BAC2;font-size:16px;line-height:1.65;">You’re on the <strong style="color:#A875FF;">Clipzy</strong> launch list. We’ll email you as soon as the App Store and Google Play pages are live.</p>
              <p style="margin:0 0 12px;color:#B4BAC2;font-size:16px;line-height:1.65;">Clipzy turns your Twitch backlog into one mobile workflow: <strong style="color:#F3F5F7;">review, organize, reframe, caption, export.</strong></p>
              <p style="margin:0 0 6px;color:#B4BAC2;font-size:16px;line-height:1.65;">At launch you’ll be able to:</p>
              <ul style="margin:0 0 16px 22px;padding:0;color:#B4BAC2;font-size:16px;line-height:1.6;">
                <li>Flick through your own clips and keep what matters</li>
                <li>Turn horizontal footage into stacked vertical video</li>
                <li>Generate and edit captions, then export to your gallery</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 6px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
              <a href="https://clipzy.xyz" style="display:inline-block;padding:14px 22px;border-radius:10px;background:#A875FF;color:#0E0F12;font-weight:700;text-decoration:none;">See the new Clipzy</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 8px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
              <p style="margin:10px 0 0;color:#B4BAC2;font-size:14px;line-height:1.6;">The free plan includes 20 finished exports every 30 days. Clipzy Pro adds unlimited exports and removes ads.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 0;"><hr style="border:0;height:1px;background:#2A2F36;"></td>
          </tr>
          <tr>
            <td style="padding:14px 28px 24px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
              <p style="margin:0 0 6px;color:#B4BAC2;font-size:12px;line-height:1.6;">You joined the Clipzy launch list at clipzy.xyz. Future product updates will include an unsubscribe link.</p>
              <p style="margin:0;color:#B4BAC2;font-size:12px;line-height:1.6;"><a href="https://clipzy.xyz" style="color:#B4BAC2;text-decoration:underline;">clipzy.xyz</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  </body>
</html>`;
}

async function safeReadText(response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

async function safeReadJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}
