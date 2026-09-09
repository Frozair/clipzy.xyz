#!/usr/bin/env node
/**
 * Send the Clipzy launch email through Resend.
 *
 *   node scripts/send-launch-email.mjs test you@example.com   # one real email to you
 *   node scripts/send-launch-email.mjs draft                   # create the broadcast, do not send
 *   node scripts/send-launch-email.mjs send <broadcast_id>     # send a drafted broadcast
 *
 * Reads the same production env the waitlist API uses. Pull it first:
 *   vercel env pull .env.production.local --environment=production
 * then run with:
 *   node --env-file=.env.production.local scripts/send-launch-email.mjs ...
 *
 * Required: RESEND_API_KEY, RESEND_WAITLIST_SEGMENT_ID, WAITLIST_WELCOME_FROM_EMAIL
 * Optional: WAITLIST_WELCOME_FROM_NAME (default Clipzy), WAITLIST_WELCOME_REPLY_TO_EMAIL,
 *           LAUNCH_EMAIL_DIR (default ../clipzy/docs/email relative to this repo's parent apps dir)
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const emailDir =
  process.env.LAUNCH_EMAIL_DIR ??
  path.resolve(here, "../../../apps/clipzy/docs/email");

const html = readFileSync(path.join(emailDir, "launch-live.html"), "utf8");
const txt = readFileSync(path.join(emailDir, "launch-live.txt"), "utf8");

// Subject and preview live on the first two lines of the .txt; the body follows.
const lines = txt.split("\n");
const subject = lines[0].replace(/^Subject:\s*/, "").trim();
const text = lines.slice(2).join("\n").replace(/^\n+/, "");

const apiKey = required("RESEND_API_KEY");
const fromEmail = required("WAITLIST_WELCOME_FROM_EMAIL");
const fromName = process.env.WAITLIST_WELCOME_FROM_NAME || "Clipzy";
const from = `${fromName} <${fromEmail}>`;
const replyTo = process.env.WAITLIST_WELCOME_REPLY_TO_EMAIL || fromEmail;

const [mode, arg] = process.argv.slice(2);

if (mode === "test") {
  if (!arg) fail("test needs a recipient address");
  const res = await resend("/emails", {
    from,
    to: [arg],
    reply_to: replyTo,
    subject: `[TEST] ${subject}`,
    // /emails does not substitute the broadcast unsubscribe token; point it home so the link works.
    html: html.replaceAll("{{{RESEND_UNSUBSCRIBE_URL}}}", "https://clipzy.xyz"),
    text: text.replaceAll("{{{RESEND_UNSUBSCRIBE_URL}}}", "https://clipzy.xyz"),
  });
  console.log(`test email queued to ${arg}: ${res.id}`);
} else if (mode === "draft") {
  const segmentId = required("RESEND_WAITLIST_SEGMENT_ID");
  const res = await resend("/broadcasts", {
    name: "Launch: Clipzy is live on iPhone and Android",
    segment_id: segmentId,
    from,
    reply_to: replyTo,
    subject,
    html,
    text,
    send: false,
  });
  console.log(`broadcast drafted (not sent): ${res.id}`);
  console.log(`review it in the Resend dashboard, then: node scripts/send-launch-email.mjs send ${res.id}`);
} else if (mode === "send") {
  if (!arg) fail("send needs a broadcast id");
  const res = await resend(`/broadcasts/${arg}/send`, {});
  console.log(`broadcast sending: ${res.id ?? arg}`);
} else {
  fail("usage: test <email> | draft | send <broadcast_id>");
}

async function resend(pathname, body) {
  const response = await fetch(`https://api.resend.com${pathname}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) fail(`Resend ${response.status} on ${pathname}: ${JSON.stringify(json)}`);
  return json;
}

function required(name) {
  const value = process.env[name];
  if (!value) fail(`missing env ${name}`);
  return value;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
