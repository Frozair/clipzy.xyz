import React, { useState, useEffect } from "react";
import {
  Check,
  Mail,
  ArrowRight,
  Apple,
  Play,
  MonitorSmartphone,
  ChevronLeft,
  MoreVertical,
  Download,
  PlayCircle,
  Moon,
  Sun,
} from "lucide-react";

export default function WaitlistLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      return setError("Please enter a valid email.");
    }

    try {
      // Use the fetch API approach from Formspark's AJAX documentation
      const response = await fetch("https://submit-form.com/ilyzrKoDA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      if (response.ok) {
        // Success - show confirmation
        setSubmitted(true);
        setEmail("");
        console.log("Form submitted successfully to Formspark");
      } else {
        // Handle HTTP error responses
        const errorText = await response.text();
        console.error("Formspark HTTP error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

    } catch (err) {
      console.error("Form submission error:", err);
      
      // Provide specific error messages based on error type
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else if (err.message.includes('CORS')) {
        setError("CORS error. Please contact support.");
      } else {
        setError(`Submission failed: ${err.message}`);
      }
    }
  }

  function toggleDarkMode() {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  }

  return (
    <div className="relative h-screen overflow-hidden bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100 flex flex-col">
      {/* Ambient background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(145,70,255,.35),rgba(236,72,153,.25),rgba(56,189,248,.2),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-48 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,.25),transparent_60%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 flex-1 flex items-center" id="hero">
        <div className="w-full rounded-3xl border border-neutral-200/60 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-6 sm:p-10 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center w-full">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/40 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-[#9146FF]" />
                Built for <span className="font-medium text-[#9146FF]">Twitch</span> creators — Kick support soon
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
                Manage your <span className="bg-gradient-to-r from-fuchsia-500 to-sky-500 bg-clip-text text-transparent">stream clips</span>, on your phone.
              </h1>
              <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-lg max-w-prose">
                Clipzy helps <span className="text-[#9146FF] font-medium">Twitch</span> creators collect, trim, and export clips fast—so you can post more and get back to streaming.
              </p>

              {/* Platform badges */}
              <div className="mt-6 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                <PlatformBadge icon={<Apple className="h-3.5 w-3.5" />} label="iOS" note="Early access" />
                <PlatformBadge icon={<Play className="h-3.5 w-3.5" />} label="Android" note="Early access" />
                <PlatformBadge icon={<MonitorSmartphone className="h-3.5 w-3.5" />} label="macOS" note="Coming soon" />
              </div>

              {/* Waitlist form (Formspark, stays on page) */}
              <div className="mt-8" id="join">
                <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 shadow-sm p-3 sm:p-4">
                  {submitted ? (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">You're on the list!</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">We'll email you when invites roll out.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="grid sm:grid-cols-[1fr_auto] gap-2" noValidate>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                          type="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
                          required
                          className="w-full rounded-xl border border-neutral-300/70 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/70 pl-9 pr-3 py-3 outline-none focus:ring-2 ring-offset-0 focus:ring-neutral-900/10 dark:focus:ring-white/10"
                          aria-label="Email"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[.99] transition shadow-sm"
                      >
                        Join waitlist <ArrowRight className="h-4 w-4" />
                      </button>
                      {error && <div className="sm:col-span-2 text-sm text-red-600 dark:text-red-400 mt-1">{error}</div>}
                    </form>
                  )}
                  <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">No spam. Unsubscribe anytime.</p>
                </div>
              </div>
            </div>

            {/* App Preview: Clips feed mock (no external assets) */}
            <div
              id="preview"
              className="relative flex justify-center origin-top-right"
              style={{ transform: "scale(clamp(0.72, 100svh / 900, 1))" }}
            >
              <PhonePreview />
              <p className="absolute -bottom-6 text-center text-xs text-neutral-500 w-full">Mock preview</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 pb-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 text-sm text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Clipzy. All rights reserved.</p>
        <p className="opacity-80">Built for streamers who create.</p>
      </footer>
    </div>
  );
}

function PlatformBadge({ icon, label, note }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/70 dark:border-neutral-800 px-2.5 py-1 bg-white/70 dark:bg-neutral-950/60">
      <span className="opacity-70">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[10px] text-neutral-500">{note}</span>
    </span>
  );
}

function PhonePreview() {
  return (
    <div className="mx-auto w-full max-w-md">
      {/* Phone frame */}
      <div className="relative mx-auto h-[640px] w-[320px] rounded-[2.2rem] border border-neutral-300/60 dark:border-neutral-800 bg-neutral-900 ring-1 ring-[#9146FF]/20 shadow-2xl overflow-hidden">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-10 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-black/70" />
        {/* screen */}
        <div className="absolute inset-0 bg-neutral-950 flex flex-col">
          {/* Top bar */}
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <button className="text-neutral-400 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-white">Clips Feed</span>
            <button className="text-neutral-400 hover:text-white">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* Feed list */}
          <div className="px-3 pb-3 space-y-3 overflow-auto">
            {[
              { title: "Epic Snipe", author: "extravee", time: "Sep 02 • 5:18", dur: "0:11" },
              { title: "Funny Moment", author: "App at 5:43", time: "Sep 02 • 3:18", dur: "0:09" },
              { title: "Intense Battle", author: "extravee", time: "Aug 28 • 6:42", dur: "0:31" },
            ].map((clip, i) => (
              <div key={i} className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden">
                <div className="flex gap-3 p-3">
                  {/* Thumb */}
                  <div className="relative h-20 w-28 shrink-0 rounded-lg bg-neutral-800 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(145,70,255,.25),rgba(56,189,248,.18),transparent_70%)]" />
                    <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/60">
                      <PlayCircle className="h-5 w-5" />
                    </button>
                    <span className="absolute right-2 bottom-2 text-[11px] px-1.5 py-0.5 rounded bg-black/60 text-white/90">{clip.dur}</span>
                  </div>
                  {/* Meta */}
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{clip.title}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{clip.author} • {clip.time}</p>
                    {/* progress bar */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-800">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-[#9146FF] to-sky-500 w-[60%]" />
                    </div>
                  </div>
                  {/* Action */}
                  <button className="self-start rounded-lg border border-neutral-800 bg-neutral-900/60 px-2.5 py-2 text-[11px] text-white hover:bg-neutral-900 flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
              </div>
            ))}

            {/* Load more */}
            <button className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 py-2 text-sm text-white/80 hover:bg-neutral-900">
              Load more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
