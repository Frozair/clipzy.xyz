import assert from "node:assert/strict";
import test from "node:test";
import handler from "./waitlist.js";

test("saves to Formspark before sending the welcome email", async (t) => {
  withEnv(t, {
    FORMSPARK_FORM_ID: "clipzyForm",
    FORMSPARK_ACTION_URL: "",
    RESEND_API_KEY: "resend_test_key",
    WAITLIST_WELCOME_FROM_EMAIL: "hello@clipzy.xyz",
    WAITLIST_WELCOME_FROM_NAME: "Clipzy",
    WAITLIST_WELCOME_REPLY_TO_EMAIL: "hello@clipzy.xyz",
  });

  const calls = mockFetch(t, [
    new Response("{}", { status: 200 }),
    new Response(JSON.stringify({ id: "email_123" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  ]);

  const response = await callHandler({
    email: "Creator@Example.com ",
    attribution: {
      utm_source: "x",
      utm_medium: "social",
      utm_campaign: "launch",
      utm_content: "bio",
      utm_term: "clips",
      referrer: "https://www.twitch.tv/fr0zair",
      landingPath: "/?utm_source=x",
    },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.json.saved, true);
  assert.equal(response.json.welcomeEmailSent, true);
  assert.equal(response.json.welcomeEmailId, "email_123");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://submit-form.com/clipzyForm");
  assert.equal(calls[1].url, "https://api.resend.com/emails");

  const formsparkBody = JSON.parse(calls[0].options.body);

  assert.equal(formsparkBody.email, "creator@example.com");
  assert.equal(formsparkBody.source, "clipzy-landing");
  assert.equal(formsparkBody.utm_campaign, "launch");
  assert.equal(formsparkBody.referrer, "https://www.twitch.tv/fr0zair");
  assert.equal(formsparkBody.landingPath, "/?utm_source=x");
});

test("keeps signup successful when Resend fails after Formspark succeeds", async (t) => {
  withEnv(t, {
    FORMSPARK_FORM_ID: "clipzyForm",
    FORMSPARK_ACTION_URL: "",
    RESEND_API_KEY: "resend_test_key",
    WAITLIST_WELCOME_FROM_EMAIL: "hello@clipzy.xyz",
    WAITLIST_WELCOME_FROM_NAME: "Clipzy",
    WAITLIST_WELCOME_REPLY_TO_EMAIL: "hello@clipzy.xyz",
  });

  mockConsole(t);
  const calls = mockFetch(t, [
    new Response("{}", { status: 200 }),
    new Response("sender rejected", { status: 400 }),
  ]);

  const response = await callHandler({
    email: "creator@example.com",
    attribution: { landingPath: "/" },
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.json.saved, true);
  assert.equal(response.json.welcomeEmailSent, false);
  assert.equal(calls.length, 2);
});

test("fails signup when Formspark does not save it", async (t) => {
  withEnv(t, {
    FORMSPARK_FORM_ID: "clipzyForm",
    FORMSPARK_ACTION_URL: "",
    RESEND_API_KEY: "resend_test_key",
    WAITLIST_WELCOME_FROM_EMAIL: "hello@clipzy.xyz",
  });

  mockConsole(t);
  const calls = mockFetch(t, [
    new Response("formspark outage", { status: 503 }),
  ]);

  const response = await callHandler({
    email: "creator@example.com",
    attribution: { landingPath: "/" },
  });

  assert.equal(response.statusCode, 502);
  assert.equal(response.json.saved, false);
  assert.equal(calls.length, 1);
});

test("rejects invalid email before provider calls", async (t) => {
  const calls = mockFetch(t, []);
  const response = await callHandler({ email: "not an email" });

  assert.equal(response.statusCode, 400);
  assert.equal(response.json.saved, false);
  assert.equal(calls.length, 0);
});

async function callHandler(body) {
  const req = {
    method: "POST",
    body,
  };
  const res = createResponse();

  await handler(req, res);

  return {
    statusCode: res.statusCode,
    json: JSON.parse(res.body),
  };
}

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    setHeader(name, value) {
      this.headers[name] = value;
    },
    end(body = "") {
      this.body = body;
    },
  };
}

function mockFetch(t, responses) {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });
    const response = responses.shift();

    if (!response) {
      throw new Error(`Unexpected fetch call to ${url}`);
    }

    return response;
  };

  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  return calls;
}

function withEnv(t, values) {
  const previous = {};

  for (const key of Object.keys(values)) {
    previous[key] = process.env[key];
    process.env[key] = values[key];
  }

  t.after(() => {
    for (const key of Object.keys(values)) {
      if (previous[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = previous[key];
      }
    }
  });
}

function mockConsole(t) {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = () => {};
  console.warn = () => {};

  t.after(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
}
