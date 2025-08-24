import React, { useState, useEffect } from "react";
import {
  Check,
  Mail,
  ArrowRight,
  Apple,
  Play,
  MonitorSmartphone,
} from "lucide-react";

// Constants
const FORMSPARK_ENDPOINT = "https://api.formspark.io/QP5hsSTy1";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



export default function WaitlistLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Apply consistent dark theme
    document.documentElement.classList.add('dark');
  }, []);

  const validateEmail = (email) => {
    return EMAIL_REGEX.test((email || "").trim());
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      return setError("Please enter a valid email.");
    }

    try {
      const response = await fetch(FORMSPARK_ENDPOINT, {
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
        setSubmitted(true);
        setEmail("");
        console.log("Form submitted successfully to Formspark");
      } else {
        const errorText = await response.text();
        console.error("Formspark HTTP error:", response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else if (err.message.includes('CORS')) {
        setError("CORS error. Please contact support.");
      } else {
        setError(`Submission failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-clipzy-dark to-clipzy-darker text-clipzy-white antialiased flex flex-col">
      <BackgroundAccents />
      
      <section className="relative w-full px-0 flex-1 flex items-center pb-8" id="hero">
        <div className="w-full rounded-none sm:rounded-3xl border-0 sm:border border-clipzy-gray-800 bg-clipzy-black/80 backdrop-blur-sm px-0 py-4 sm:p-10 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center w-full">
            <HeroContent 
              email={email}
              submitted={submitted}
              error={error}
              onEmailChange={handleEmailChange}
              onSubmit={handleSubmit}
            />
            <PhonePreview />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Background accent components
function BackgroundAccents() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(145,70,255,.35),rgba(0,212,255,.25),rgba(145,70,255,.2),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-48 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,212,255,.25),transparent_60%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(145,70,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(145,70,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />
    </>
  );
}

// Hero content component
function HeroContent({ email, submitted, error, onEmailChange, onSubmit }) {
  return (
    <div>
      {/* Clipzy Logo */}
      <div className="flex justify-center lg:justify-start mb-6">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assets/clipzy_icon_dark.svg" 
            alt="Clipzy Logo" 
            className="h-16 w-16 lg:h-20 lg:w-20"
          />
          <span className="text-4xl lg:text-5xl font-bold text-clipzy-white">Clipzy</span>
        </div>
      </div>
      
      <div className="flow lg:inline-flex items-center gap-2 rounded-full border border-clipzy-gray-800 bg-clipzy-black/40 px-3 py-1 text-xs text-clipzy-gray-300 mx-auto lg:mx-0 w-fit">
        <span className="h-2 w-2 rounded-full bg-clipzy-purple" />
        Built for <span className="font-medium text-clipzy-purple">Twitch</span> creators — <span className="font-medium text-[#52FC18]">Kick</span> support soon
      </div>
      
      <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] text-center lg:text-left">
        Manage your <span className="bg-gradient-to-r from-clipzy-purple to-clipzy-cyan bg-clip-text text-transparent">stream clips</span>, on your phone.
      </h1>
      
      <p className="mt-4 text-clipzy-gray-300 text-lg max-w-prose mx-4 lg:mx-0 text-center lg:text-left">
        Clipzy helps <span className="text-clipzy-purple font-medium">Twitch</span> creators collect, manage, and export clips fast—so you can post more and get back to streaming.
      </p>

      <PlatformBadges />
      <WaitlistForm 
        email={email}
        submitted={submitted}
        error={error}
        onEmailChange={onEmailChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

// Platform badges component
function PlatformBadges() {
  return (
    <div className="mt-6 flex items-center gap-3 text-xs text-clipzy-gray-400 justify-center lg:justify-start">
      <PlatformBadge icon={<Apple className="h-3.5 w-3.5" />} label="iOS" />
      <PlatformBadge icon={<Play className="h-3.5 w-3.5" />} label="Android" />
      <PlatformBadge icon={<MonitorSmartphone className="h-3.5 w-3.5" />} label="macOS" />
    </div>
  );
}

// Individual platform badge component
function PlatformBadge({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-clipzy-gray-800 bg-clipzy-black/60 px-2.5 py-1">
      <span className="opacity-70">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </span>
  );
}

// Waitlist form component
function WaitlistForm({ email, submitted, error, onEmailChange, onSubmit }) {
  if (submitted) {
    return (
      <div className="mt-8" id="join">
        <div className="rounded-2xl border border-clipzy-gray-800 bg-clipzy-black/70 shadow-sm p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-clipzy-cyan/15 text-clipzy-cyan flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">You're on the list!</p>
              <p className="text-sm text-clipzy-gray-400">We'll email you when invites roll out.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
          <div className="mt-8" id="join">
        <div className="rounded-2xl border border-clipzy-gray-800 bg-clipzy-black shadow-sm p-3 sm:p-4 mx-auto lg:mx-0 ring-1 ring-clipzy-cyan/30 shadow-clipzy-cyan/20">
          <form onSubmit={onSubmit} className="flex flex-col sm:grid sm:grid-cols-[1fr_auto] gap-2" noValidate>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-clipzy-gray-400" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onEmailChange}
              placeholder="Email address"
              required
              className="w-full rounded-xl border border-clipzy-gray-800 bg-clipzy-black/70 pl-9 pr-3 py-3 outline-none focus:ring-2 ring-offset-0 focus:ring-clipzy-cyan/20 text-clipzy-white placeholder-clipzy-gray-400"
              aria-label="Email"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 bg-clipzy-purple hover:bg-clipzy-purpleLight active:scale-[.99] transition shadow-sm text-clipzy-white"
          >
            Save my spot <ArrowRight className="h-4 w-4" />
          </button>
          {error && <div className="sm:col-span-2 text-sm text-red-400 mt-1">{error}</div>}
        </form>
        <p className="mt-2 text-[11px] text-clipzy-gray-500 text-center lg:text-left">1 free month of Premium if you sign up now</p>
        <div className="mt-3 text-center lg:text-left">
          <a 
            href="https://twitch.tv/fr0zair" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-clipzy-gray-400 hover:text-clipzy-gray-200 transition-colors"
          >
            Follow @frozair for updates
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Phone preview component
function PhonePreview() {
  return (
    <div
      id="preview"
      className="relative flex justify-center lg:justify-end"
    >
      <div className="w-full flex justify-center lg:justify-end">
        <div className="relative h-[400px] w-[200px] sm:h-[500px] sm:w-[250px] lg:h-[640px] lg:w-[320px] rounded-[2.2rem] shadow-2xl overflow-hidden bg-clipzy-black">
          <div className="absolute left-1/2 top-0 z-10 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-clipzy-black/70" />
          <div className="absolute inset-0 flex flex-col">
            <img 
              src="/preview.png" 
              alt="Clipzy app preview showing clips feed" 
              className="w-full h-full object-cover rounded-[2.2rem] scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}













// Footer component
function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-6 pt-4 border-t border-clipzy-gray-800 text-sm text-clipzy-gray-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <p>© {new Date().getFullYear()} Clipzy. All rights reserved.</p>
      <p className="opacity-80">Built for streamers who create.</p>
    </footer>
  );
}
