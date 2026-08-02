import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  Lock,
  MonitorSmartphone,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
} from "lucide-react";

const WAITLIST_ENDPOINT = "/api/waitlist";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const tabs = [
  { id: "review", label: "Review" },
  { id: "library", label: "Library" },
  { id: "editor", label: "Editor" },
];

const faqItems = [
  {
    question: "Does Clipzy download anyone’s clips?",
    answer:
      "No. Clipzy is ownership-only by design. You sign in through Twitch and only see clips that belong to your own channel.",
  },
  {
    question: "Where are my clips and decisions stored?",
    answer:
      "Your review decisions, collections, and clip metadata stay on your device. Clipzy streams video from Twitch and does not host or proxy your clips.",
  },
  {
    question: "What devices will Clipzy support?",
    answer:
      "Clipzy is built for iPhone and Android. Desktop access is planned as part of Clipzy Pro.",
  },
  {
    question: "When will Clipzy Pro launch?",
    answer:
      "Pro is still being built. Planned launch pricing is $5.99 per month or $39.99 per year. Join the waitlist and we’ll let you know when it’s ready.",
  },
];

export default function WaitlistLanding() {
  const [activeTab, setActiveTab] = useState("review");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!EMAIL_REGEX.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim(), attribution: getAttribution() }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.saved) {
        throw new Error(result?.error || "Couldn’t join right now. Please try again.");
      }
      setSubmitted(true);
      setEmail("");
    } catch (submissionError) {
      setError(submissionError.message || "Couldn’t join right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="site">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Clipzy home">
          <img src="/logo.png" alt="" />
          <span>Clipzy</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#features">Features</a>
          <a href="#pro">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta" href="#waitlist">Get early access</a>
      </header>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Built by a streamer, for streamers</div>
            <h1>Your best clips shouldn’t get <em>lost in the backlog.</em></h1>
            <p className="hero-lede">
              Swipe through your Twitch clips, keep the moments that matter, then
              organize, edit, and share them—all from your phone.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#waitlist">
                Join the waitlist <ArrowRight size={17} />
              </a>
              <a className="button button-quiet" href="#features">
                See how it works <Play size={15} fill="currentColor" />
              </a>
            </div>
            <div className="trust-row">
              <span><Check size={15} /> Official Twitch sign-in</span>
              <span><Check size={15} /> Local-first</span>
              <span><Check size={15} /> iOS + Android</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <ProductPreview activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </section>

        <section className="proof-strip" aria-label="Clipzy workflow">
          <div className="shell proof-inner">
            <span>One thumb.</span><i />
            <span>One decision.</span><i />
            <span>One clean library.</span>
          </div>
        </section>

        <section className="section shell" id="features">
          <div className="section-heading">
            <div>
              <p className="kicker">The clip workflow Twitch never built</p>
              <h2>From clip chaos to content-ready.</h2>
            </div>
            <p>
              Clipzy turns reviewing clips into a fast, focused flow—so five spare
              minutes can actually make a dent.
            </p>
          </div>

          <div className="workflow">
            <article className="workflow-card workflow-featured">
              <div className="number">01</div>
              <h3>Review at thumb speed</h3>
              <p>Keep or hide each clip. Changed your mind? Undo the latest decision right away.</p>
              <ScreenshotFrame src="/app/review.webp" alt="Clipzy Feed showing a real Twitch clip with hide and keep actions" className="shot-review" />
            </article>

            <article className="workflow-card">
              <div className="number">02</div>
              <h3>Find the clip you need</h3>
              <p>Search your library, sort by newest, oldest, or popular, and filter by export status.</p>
              <ScreenshotFrame src="/app/library.webp" alt="Clipzy Library showing search, sorting, export filters, and real saved clips" className="shot-library" />
            </article>

            <article className="workflow-card">
              <div className="number">03</div>
              <h3>Make it post-ready</h3>
              <p>Trim, reframe for 9:16, 1:1, or 16:9, choose your portrait layout, then export and share.</p>
              <ScreenshotFrame src="/app/editor.webp" alt="Clipzy Ready to post editor showing real format, layout, export allowance, and sharing controls" className="shot-editor" />
            </article>
          </div>
        </section>

        <section className="feature-band">
          <div className="shell">
            <div className="mini-grid">
              <Feature icon={Play} title="Smooth playback" body="Preview clips in-app with the next moments ready to go." />
              <Feature icon={Download} title="Direct downloads" body="Save your own clips straight from Twitch to your device." />
              <Feature icon={Share2} title="Share anywhere" body="Send finished clips to your editor or social app of choice." />
              <Feature icon={RotateCcw} title="Quick corrections" body="Undo the latest review decision when your thumb moves faster than your brain." />
              <Feature icon={Lock} title="Your data stays yours" body="Decisions and collections live locally, partitioned by your account." />
              <Feature icon={MonitorSmartphone} title="Made for mobile" body="The same focused Clipzy experience on iPhone and Android." />
            </div>
          </div>
        </section>

        <section className="pricing-section shell" id="pro">
          <div className="pricing-heading">
            <div>
              <p className="kicker">Simple pricing</p>
              <h2>Start free. Go Pro when your backlog gets serious.</h2>
            </div>
            <p>
              The core review workflow stays free. Pro adds the power tools for
              creators moving more clips across more screens.
            </p>
          </div>

          <div className="pricing-grid">
            <PricingCard
              name="Free"
              price="$0"
              cadence="forever"
              description="A fast, focused way to review your own clips and keep the best moments organized."
              cta="Join the beta waitlist"
              features={[
                "Swipe to keep or hide clips",
                "Search and sort your library",
                "Up to 3 collections",
                "Download and share one clip at a time",
                "Occasional ads help keep Clipzy free",
              ]}
            />

            <PricingCard
              name="Pro"
              price="$5.99"
              cadence="per month"
              annual="$39.99 per year · $3.33/month"
              description="Remove the limits and turn a growing clip library into a repeatable content workflow."
              cta="Join the Pro waitlist"
              featured
              features={[
                "Everything in Free",
                "Unlimited and smart collections",
                "Batch actions for faster cleanup",
                "Reusable export presets",
                "Cross-device sync",
                "No ads",
              ]}
            />
          </div>

          <p className="pricing-note">
            Pro is coming soon. Annual billing saves 44% compared with paying monthly.
          </p>
        </section>

        <section className="privacy shell">
          <div className="privacy-icon"><Lock /></div>
          <div>
            <p className="kicker">Ownership-only by design</p>
            <h2>Your clips. Your library. No sketchy workarounds.</h2>
          </div>
          <p>
            Clipzy uses official Twitch access to show only clips from your own
            channel. We never host or proxy your video, and your local library
            remains on your device.
          </p>
        </section>

        <section className="faq-section shell" id="faq">
          <div className="faq-intro">
            <p className="kicker">Good questions</p>
            <h2>Before you swipe.</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<ChevronDown size={19} /></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="waitlist shell" id="waitlist">
          <div className="waitlist-inner">
            <div>
              <p className="kicker">Private beta</p>
              <h2>Ready to tame the backlog?</h2>
              <p>Join the waitlist for beta invites, product updates, and first access to Clipzy Pro.</p>
            </div>
            <WaitlistForm
              email={email}
              setEmail={setEmail}
              submitted={submitted}
              error={error}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        </section>
      </main>

      <footer className="footer shell">
        <a className="brand" href="#top"><img src="/logo.png" alt="" /><span>Clipzy</span></a>
        <p>Built for streamers who would rather stream.</p>
        <div>
          <a href="https://www.twitch.tv/fr0zair" target="_blank" rel="noreferrer">Follow the build</a>
          <a href="/privacy/">Privacy</a>
          <a href="/support/">Support</a>
          <span>© {new Date().getFullYear()} Clipzy</span>
        </div>
      </footer>
    </div>
  );
}

function ProductPreview({ activeTab, setActiveTab }) {
  const active = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className="product-preview">
      <div className="preview-tabs" role="tablist" aria-label="Real Clipzy app screenshots">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="phone real-phone">
        <img
          className="real-app-screen"
          src={`/app/${active.id === "review" ? "review" : active.id}.webp`}
          alt={`Current Clipzy ${active.label} screen running on Android`}
        />
      </div>
      <p className="authentic-label"><Check size={13} /> Captured from the current Android app</p>
    </div>
  );
}

function ScreenshotFrame({ src, alt, className }) {
  return (
    <div className={`screenshot-frame ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function Feature({ icon: Icon, title, body }) {
  return <article className="mini-feature"><span><Icon /></span><h3>{title}</h3><p>{body}</p></article>;
}

function PricingCard({ name, price, cadence, annual, description, cta, features, featured = false }) {
  return (
    <article className={`pricing-card${featured ? " pricing-card-featured" : ""}`}>
      <div className="pricing-card-topline">
        <p className="pricing-tier">
          {featured && <Sparkles size={16} aria-hidden="true" />}
          Clipzy {name}
        </p>
        {featured && <span className="coming-soon">Coming soon</span>}
      </div>
      <div className="price">
        <strong>{price}</strong>
        <span>{cadence}</span>
      </div>
      {annual ? (
        <p className="annual-price">
          <strong>{annual}</strong>
          <span>Best value</span>
        </p>
      ) : (
        <p className="annual-price annual-price-placeholder">No card required during beta</p>
      )}
      <p className="pricing-description">{description}</p>
      <a className={`button ${featured ? "button-primary" : "button-quiet"}`} href="#waitlist">
        {cta} <ArrowRight size={17} />
      </a>
      <ul>
        {features.map((feature) => (
          <li key={feature}><Check size={16} aria-hidden="true" /> {feature}</li>
        ))}
      </ul>
    </article>
  );
}

function WaitlistForm({ email, setEmail, submitted, error, isSubmitting, onSubmit }) {
  if (submitted) {
    return (
      <div className="success-message">
        <span><Check /></span>
        <div><strong>You’re on the list.</strong><p>We’ll be in touch when invites roll out.</p></div>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="email">Email address</label>
      <div>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@channel.com"
          autoComplete="email"
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Joining…" : "Join the waitlist"} <ArrowRight size={16} />
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <small>No spam. Just launch news and invites.</small>
    </form>
  );
}

function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    referrer: document.referrer || "",
    landingPath: `${window.location.pathname}${window.location.search}` || "/",
  };
}
