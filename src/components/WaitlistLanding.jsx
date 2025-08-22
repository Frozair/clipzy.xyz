import React, { useState, useEffect } from "react";
import { Check, Mail, User, ArrowRight, Apple, Play, MonitorSmartphone, Moon, Sun } from "lucide-react";

export default function WaitlistLanding() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (!validateEmail(email)) return setError("Please enter a valid email.");
    // TODO: Replace with your backend call (e.g., /api/waitlist)
    setTimeout(() => setSubmitted(true), 300);
  }

  function toggleDarkMode() {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  }

  return (
    <div className="relative h-screen overflow-hidden bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100 flex flex-col">
      {/* Ambient background accents */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(145,70,255,.35),rgba(236,72,153,.25),rgba(56,189,248,.2),transparent_70%)] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-48 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,.25),transparent_60%)] blur-2xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 flex-1 flex items-center" id="hero">
        <div className="w-full rounded-3xl border border-neutral-200/60 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-sm p-6 sm:p-10 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/40 px-3 py-1 text-xs text-neutral-600 dark:text-neutral-300">
                <span className="h-2 w-2 rounded-full bg-[#9146FF]" />
                Built for <span className="font-medium text-[#9146FF]">Twitch</span> creators — Kick support soon
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05]">
                Manage your <span className="bg-gradient-to-r from-fuchsia-500 to-sky-500 bg-clip-text text-transparent">stream clips</span>,
                on your phone.
              </h1>
              <p className="mt-4 text-neutral-700 dark:text-neutral-300 text-lg max-w-prose">
                Clipzy helps <span className="text-[#9146FF] font-medium">Twitch</span> creators collect, trim, and export clips fast—so you can post more and get back to streaming.
              </p>

              <div className="mt-6 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                <PlatformBadge icon={<Apple className="h-3.5 w-3.5" />} label="iOS" note="Early access" />
                <PlatformBadge icon={<Play className="h-3.5 w-3.5" />} label="Android" note="Early access" />
                <PlatformBadge icon={<MonitorSmartphone className="h-3.5 w-3.5" />} label="macOS" note="Coming soon" />
              </div>

              <div className="mt-8" id="join">
                <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70 shadow-sm p-3 sm:p-4">
                  {submitted ? (
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">You're on the list, {name.split(" ")[0]}!</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">We'll email you when invites roll out.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          className="w-full rounded-xl border border-neutral-300/70 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/70 pl-9 pr-3 py-3 outline-none focus:ring-2 ring-offset-0 focus:ring-neutral-900/10 dark:focus:ring-white/10"
                          aria-label="Name"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email address"
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
                      {error && (
                        <div className="sm:col-span-3 text-sm text-red-600 dark:text-red-400 mt-1">{error}</div>
                      )}
                    </form>
                  )}
                  <p className="mt-2 text-[11px] text-neutral-500 dark:text-neutral-400">No spam. Unsubscribe anytime.</p>
                </div>
              </div>
            </div>

            <div id="preview" className="relative">
              <PhonePreview />
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
      {/* Frame */}
      <div className="relative mx-auto h-[640px] w-[320px] rounded-[2.2rem] border border-neutral-300/60 dark:border-neutral-800 bg-neutral-900 ring-1 ring-[#9146FF]/20 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-black/70" />
        {/* Screen */}
        <div className="absolute inset-0 bg-neutral-950">
          {/* Mock app UI */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-fuchsia-500 to-sky-500" />
              <span className="text-[11px] text-neutral-400">CLIPS</span>
            </div>
            <h3 className="mt-3 text-white text-lg font-semibold">Today's Clips</h3>
            <p className="text-xs text-neutral-400">Quick select • Trim • Export</p>

            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group rounded-xl border border-neutral-800/80 bg-neutral-900/60 hover:bg-neutral-900 transition p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-24 rounded-md bg-neutral-800 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,0,255,.15),rgba(0,212,255,.08),transparent_70%)]" />
                      <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white truncate">Clip #{i + 1} • 00:{(i+1).toString().padStart(2,'0')}</p>
                        <span className="text-[10px] text-neutral-400">1080×1920</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-neutral-800">
                        <div className="h-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-500 w-1/2" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Trim", "Caption", "Export"].map((t) => (
                <button key={t} className="rounded-xl border border-neutral-800 bg-neutral-900/60 py-2 text-sm text-white hover:bg-neutral-900 active:scale-[.99]">
                  {t}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-neutral-800 p-3">
              <p className="text-xs text-neutral-300">Export presets</p>
              <div className="mt-2 flex gap-2">
                {["9:16", "1:1", "16:9"].map((r) => (
                  <span key={r} className="inline-flex items-center justify-center rounded-lg border border-neutral-800 px-2 py-1 text-[11px] text-neutral-300">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-neutral-500">Interactive mock preview</p>
    </div>
  );
}
