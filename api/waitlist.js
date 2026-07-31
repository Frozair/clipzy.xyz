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
    version: "waitlist-v1",
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

  const welcomeEmail = await sendWelcomeEmail(email);

  return sendJson(res, 200, {
    ok: true,
    saved: true,
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
    subject: "You're on the Clipzy waitlist",
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
    "Hey,",
    "",
    "Thanks for joining the Clipzy waitlist. You're on the list.",
    "",
    "I'll send updates as beta invites roll out. In the meantime, you can reply to this email with how you manage stream clips today.",
    "",
    "- Frozair",
  ].join("\n");
}

function renderWelcomeEmailHtml() {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#050505;color:#ffffff;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Hey,</p>
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Thanks for joining the Clipzy waitlist. You're on the list.</p>
      <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">I'll send updates as beta invites roll out. In the meantime, you can reply to this email with how you manage stream clips today.</p>
      <p style="font-size:16px;line-height:1.6;margin:24px 0 0;">- Frozair</p>
    </div>
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
