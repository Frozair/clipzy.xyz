import React, { useState, useEffect } from "react";
import {
  Check,
  Mail,
  ArrowRight,
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
    <div className="min-h-screen">
      <BackgroundAccents />
      
      <header className="shell">
        <div className="brand-row">
          <img src="/logo.png" alt="" className="logo" />
          <h1 className="wordmark">Clipzy</h1>
        </div>
        <div className="badges">
          <span className="pill">
            <span className="dot twitch"></span>
            Built for Twitch
          </span>
          <span className="pill">
            <span className="dot"></span>
            Kick support soon
          </span>
        </div>
      </header>

      <main className="shell hero">
        <section className="left">
          <h2 className="big">
            Manage your <span className="grad">stream clips</span> —<br />
            on your phone.
          </h2>
          <p className="sub">Collect, organize, and export clips fast so you can post more and get back to streaming.</p>

          <div className="chips">
            <span className="chip">iOS</span>
            <span className="chip">Android</span>
            <span className="chip">macOS</span>
          </div>

          <WaitlistForm 
            email={email}
            submitted={submitted}
            error={error}
            onEmailChange={handleEmailChange}
            onSubmit={handleSubmit}
          />

          <p className="follow">
            <a href="https://www.twitch.tv/fr0zair" target="_blank" rel="noopener">Follow @frozair for updates</a>
          </p>
        </section>

        <aside className="right">
          <PhonePreview />
        </aside>
      </main>

      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

// Background accent components
function BackgroundAccents() {
  return (
    <>
      <div className="bg fx1"></div>
      <div className="bg fx2"></div>
    </>
  );
}

// Waitlist form component
function WaitlistForm({ email, submitted, error, onEmailChange, onSubmit }) {
  if (submitted) {
    return (
      <div className="form">
        <div style={{ 
          background: 'rgba(255,255,255,.06)', 
          border: '1px solid rgba(255,255,255,.10)', 
          borderRadius: '16px', 
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'rgba(69,224,178,.15)', 
            color: 'var(--teal)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Check size={16} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--ink)' }}>You're on the list!</p>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>We'll email you when invites roll out.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="email">Email address</label>
      <input 
        id="email" 
        name="email" 
        type="email" 
        value={email}
        onChange={onEmailChange}
        placeholder="Email address" 
        required 
        inputMode="email" 
        autoComplete="email"
      />
      <button className="cta" type="submit">Join the waitlist</button>
      {error && <div style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '8px' }}>{error}</div>}
    </form>
  );
}

// Phone preview component
function PhonePreview() {
  return (
    <div className="device">
      <div className="bezel"></div>
      <div className="notch"></div>
      <img src="/feed-mock.png" alt="Clipzy app preview" loading="eager" />
      <div className="highlight"></div>
    </div>
  );
}

// Features section
function FeaturesSection() {
  return (
    <section className="shell features">
      <div className="grid3">
        <article className="card">
          <h3>Swipe, sort, save</h3>
          <p>Fly through clips. Keep the bangers, archive the rest. One‑handed review with familiar gestures.</p>
        </article>
        <article className="card">
          <h3>Auto‑import</h3>
          <p>Connect your account; new clips just appear. No more hunting through dashboards.</p>
        </article>
        <article className="card">
          <h3>Export fast</h3>
          <p>Grab the file, or send to your editor tool of choice. Get back to streaming.</p>
        </article>
      </div>

      <div className="faq">
        <details>
          <summary>When does the beta start?</summary>
          <p>We're letting people in gradually. Join the waitlist and you'll get updates as we roll invites.</p>
        </details>
        <details>
          <summary>Is this only for Twitch?</summary>
          <p>Twitch first. Kick support is planned. Tell us what you use when you sign up.</p>
        </details>
        <details>
          <summary>Will there be a desktop app?</summary>
          <p>Yes — a lightweight macOS companion for bulk actions is in the works.</p>
        </details>
      </div>
    </section>
  );
}

// FAQ section
function FAQSection() {
  return null; // Already included in FeaturesSection
}

// Footer component
function Footer() {
  return (
    <footer className="shell foot">
      <span>© {new Date().getFullYear()} Clipzy • Built for streamers who create.</span>
    </footer>
  );
}
