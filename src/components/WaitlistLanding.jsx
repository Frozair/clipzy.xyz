import { useState } from "react";
import {
  Subtitles,
  Check,
  ChevronDown,
  Download,
  Layers,
  Lock,
  MonitorSmartphone,
  Play,
  RotateCcw,
  Scissors,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/us/app/clipzy-save-and-manage-clips/id6753856526";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=xyz.clipzy";

const previews = [
  { id: "review", label: "Review", src: "/app/release/02-keep.png" },
  { id: "library", label: "Library", src: "/app/release/03-library.png" },
  { id: "stack", label: "Stack", src: "/app/release/04-stack.png" },
  { id: "captions", label: "Captions", src: "/app/release/05-captions.png" },
];

const tour = [
  {
    number: "01",
    kicker: "Connect",
    title: "Sign in and your clips are there.",
    body: "Clipzy pulls the clips your own channel owns, newest first, so you start with last night and work backwards. Nothing to upload, no links to paste.",
    src: "/app/release/00-connect.png",
    alt: "Clipzy sign-in screen offering Sign in with Twitch",
  },
  {
    number: "02",
    kicker: "Review",
    title: "One clip. One decision.",
    body: "Flick or tap to keep or archive, then undo if your thumb gets ahead of you. The next clip is already loaded and playing.",
    src: "/app/release/02-keep.png",
    alt: "Clipzy review feed showing a Twitch clip with Keep and Archive actions",
  },
  {
    number: "03",
    kicker: "Organize",
    title: "Find any clip in seconds.",
    body: "Search your kept clips, sort by date or view count, and filter by what you have already exported.",
    src: "/app/release/03-library.png",
    alt: "Clipzy library with search, sorting, filters, and clip thumbnails",
  },
  {
    number: "04",
    kicker: "Download",
    title: "Save it once to unlock editing.",
    body: "Keepers start as cloud clips. One tap saves a clip to your device for offline playback and fast editing, and it stays there.",
    src: "/app/release/07-download.png",
    alt: "Clipzy clip details screen showing a cloud clip with a Download action",
  },
  {
    number: "05",
    kicker: "Create",
    title: "Make horizontal footage work vertically.",
    body: "Trim the moment, reframe it for 9:16, and stack face-cam over gameplay without losing either half of the story.",
    src: "/app/release/04-stack.png",
    alt: "Clipzy editor showing face-cam and gameplay in a stacked vertical layout",
  },
  {
    number: "06",
    kicker: "Finish",
    title: "Caption it, then export.",
    body: "Generate captions from the clip’s audio, fix the words and timing, restyle them, then burn them in and save the finished video to your camera roll.",
    src: "/app/release/05-captions.png",
    alt: "Clipzy editor with generated captions visible on the video and timeline",
  },
];

const faqItems = [
  {
    question: "When and where can I get Clipzy?",
    answer:
      "Clipzy is live now on the App Store and Google Play for iPhone and Android.",
  },
  {
    question: "Can Clipzy access anyone’s Twitch clips?",
    answer:
      "No. Clipzy is ownership-only by design. You sign in through Twitch and only see clips owned by your own channel.",
  },
  {
    question: "Where is my library stored?",
    answer:
      "Your reviews, collections, edits, and downloads stay on your device and are separated by Twitch account. Clipzy has no custom media backend and never hosts or proxies your clips.",
  },
  {
    question: "What can I do for free?",
    answer:
      "Browsing, reviewing, organizing, playback, and downloading stay free. The free plan is supported by ads and includes 20 finished exports in each rolling 30-day period.",
  },
  {
    question: "What does Clipzy Pro include?",
    answer:
      "Clipzy Pro unlocks unlimited finished exports and removes ads. Launch pricing is $5.99 per month or $49.99 per year; your app store shows the exact localized price before purchase.",
  },
];

export default function WaitlistLanding() {
  const [activePreview, setActivePreview] = useState("review");

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
          <a href="#workflow">How it works</a>
          <a href="#demo">Demo</a>
          <a href="#editor">Editor</a>
          <a href="#pro">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-cta" href="#download">Download now</a>
      </header>

      <main id="top">
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Your own clips only · iPhone and Android</div>
            <h1>Your Twitch backlog, <em>sorted in one sitting.</em></h1>
            <p className="hero-lede">
              Clipzy deals your own Twitch clips one at a time, newest first. Flick
              right to keep, left to archive, and undo when your thumb gets ahead of
              you. Turn the keepers into captioned vertical video when you’re ready.
            </p>
            <StoreBadges className="hero-store-badges" />
            <div className="hero-links">
              <a href="/support/">Support</a>
              <a href="/privacy/">Privacy policy</a>
              <a href="https://www.frozair.xyz/apps">View all apps</a>
            </div>
            <div className="trust-row">
              <span><Check size={15} /> Official Twitch sign-in</span>
              <span><Check size={15} /> Local-first library</span>
              <span><Check size={15} /> No Clipzy media server</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <HeroDemo activePreview={activePreview} setActivePreview={setActivePreview} />
          </div>
        </section>

        <section className="release-facts shell" aria-label="Clipzy release highlights">
          <div>
            <span>OWNERSHIP-ONLY</span>
            <strong>Your Twitch clips</strong>
          </div>
          <div>
            <span>20 FREE EXPORTS</span>
            <strong>Every 30 days</strong>
          </div>
          <div>
            <span>FULL + STACKED</span>
            <strong>Vertical layouts</strong>
          </div>
          <div>
            <span>LOCAL-FIRST</span>
            <strong>On-device library</strong>
          </div>
        </section>

        <section className="section shell" id="workflow">
          <div className="section-heading">
            <div>
              <p className="kicker">The whole creator loop</p>
              <h2>From buried moment to finished short.</h2>
            </div>
            <p>
              Six steps, and you are in charge of every one. Clipzy does not decide
              what is worth posting. It makes deciding fast, then hands you what you
              need to finish the clips you chose.
            </p>
          </div>

          <div className="tour-grid">
            {tour.map((item) => <TourCard key={item.number} {...item} />)}
          </div>
        </section>

        <section className="demo-section" id="demo">
          <div className="shell demo-grid">
            <div className="demo-copy">
              <p className="kicker">See it work</p>
              <h2>Watch the whole loop, start to finish.</h2>
              <p className="demo-lede">
                Clipzy does not hand you a finished video on its own, and it is not
                trying to. You decide what is worth keeping. The app makes that fast,
                then gives you the tools to finish the ones you chose.
              </p>
              <ul className="demo-beats">
                <li><span>00:00</span> Sign in with Twitch and the clips load, newest first</li>
                <li><span>00:06</span> Keep or archive, one clip at a time</li>
                <li><span>00:17</span> Search, sort, and filter what you kept</li>
                <li><span>00:38</span> Download a clip to unlock editing</li>
                <li><span>00:55</span> Stack face-cam over gameplay</li>
                <li><span>01:05</span> Generate captions and restyle them</li>
              </ul>
              <p className="demo-note">
                Recorded on a phone, in the shipping build. No sped-up footage.
              </p>
            </div>
            <div className="demo-player">
              <DemoPlayer />
            </div>
          </div>
        </section>

        <section className="editor-section" id="editor">
          <div className="shell editor-grid">
            <div className="editor-copy">
              <p className="kicker">A real vertical editor</p>
              <h2>Keep the face-cam. Keep the gameplay. Keep the punchline.</h2>
              <p className="editor-lede">
                Turn a horizontal stream into a vertical clip without sending it to
                another app. What you frame and caption in Clipzy is what gets exported.
              </p>
              <div className="editor-features">
                <Feature icon={Scissors} title="Trim the moment" body="Tighten the clip or create a longer source from the Twitch VOD when one is available." />
                <Feature icon={Layers} title="Full or stacked" body="Fit the full frame over a background or crop face-cam and gameplay independently." />
                <Feature icon={Subtitles} title="On-device captions" body="Generate, edit, split, size, position, and burn captions into the final video." />
                <Feature icon={MonitorSmartphone} title="Preview the safe zone" body="Check TikTok, Shorts, and Reels overlays before you export." />
              </div>
            </div>
            <div className="editor-gallery" aria-label="Clipzy vertical editing screenshots">
              <img className="editor-shot editor-shot-back" src="/app/release/04-stack.png" alt="Clipzy stacked portrait editor" loading="lazy" />
              <img className="editor-shot editor-shot-front" src="/app/release/05-captions.png" alt="Clipzy caption editor" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="feature-band">
          <div className="shell mini-grid">
            <Feature icon={Play} title="Fast review" body="Play one clip at a time with the next moments prepared as you move." />
            <Feature icon={Search} title="A useful library" body="Search, sort, filter, collect, and revisit the moments you kept." />
            <Feature icon={Download} title="Direct downloads" body="Save your own clips from Twitch for offline editing and playback." />
            <Feature icon={RotateCcw} title="Undo without drama" body="Reverse the latest review decision and keep moving through the deck." />
            <Feature icon={Share2} title="Gallery first" body="Finished edits save to your device, then share anywhere you want." />
            <Feature icon={Lock} title="Local by default" body="Your working library stays on your device, separated by Twitch account." />
          </div>
        </section>

        <section className="pricing-section shell" id="pro">
          <div className="pricing-heading">
            <div>
              <p className="kicker">Simple pricing</p>
              <h2>Start free. Go Pro when you’re on a roll.</h2>
            </div>
            <p>
              Clip access never sits behind the paywall. Pro is for creators who need
              more finished exports and want an ad-free workflow.
            </p>
          </div>

          <div className="pricing-grid">
            <PricingCard
              name="Free"
              price="$0"
              cadence="forever"
              description="Everything you need to clear the backlog and start turning moments into vertical video."
              features={[
                "Unlimited browsing, review, and playback",
                "Search, filters, and collections",
                "Clip downloads and local editing",
                "20 finished exports every 30 days",
                "Supported by occasional ads",
              ]}
            />

            <PricingCard
              name="Pro"
              price="$5.99"
              cadence="per month"
              annual="$49.99 per year · about $4.17/month"
              description="For a steady posting rhythm, a publishing sprint, or the backlog that got wildly out of hand."
              featured
              features={[
                "Everything in Free",
                "Unlimited finished exports",
                "No ads anywhere in Clipzy",
                "Restore and manage through your app store",
              ]}
            />
          </div>

          <p className="pricing-note">
            Prices may vary by country. Apple or Google confirms the exact localized price before purchase.
          </p>
        </section>

        <section className="privacy shell">
          <div className="privacy-icon"><Lock /></div>
          <div>
            <p className="kicker">Local-first by design</p>
            <h2>Your clips aren’t raw material for our cloud.</h2>
          </div>
          <p>
            Clipzy talks directly to Twitch and stores your reviews, collections, edits,
            and downloads on your device. There is no Clipzy account or custom media backend.
          </p>
        </section>

        <section className="faq-section shell" id="faq">
          <div className="faq-intro">
            <p className="kicker">The useful details</p>
            <h2>Before your first flick.</h2>
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

        <section className="download-section shell" id="download">
          <div className="download-inner">
            <div>
              <p className="kicker">Live on both stores</p>
              <h2>Your best clips are already waiting.</h2>
              <p>Download Clipzy, sign in with Twitch, and turn the backlog into a library worth keeping.</p>
            </div>
            <div className="download-actions">
              <StoreBadges />
              <div className="download-links">
                <a href="/support/">Support</a>
                <a href="/privacy/">Privacy policy</a>
                <a href="/terms/">Terms</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer shell">
        <a className="brand" href="#top"><img src="/logo.png" alt="" /><span>Clipzy</span></a>
        <p>Built by a streamer who got tired of the backlog.</p>
        <div>
          <a href="https://www.twitch.tv/fr0zair" target="_blank" rel="noreferrer">Follow the build</a>
          <a href="/privacy/">Privacy</a>
          <a href="/support/">Support</a>
          <a href="/terms/">Terms</a>
          <span>© {new Date().getFullYear()} Clipzy</span>
        </div>
      </footer>
    </div>
  );
}

function HeroDemo({ activePreview, setActivePreview }) {
  const [videoFailed, setVideoFailed] = useState(false);

  if (videoFailed) {
    return <ProductPreview activePreview={activePreview} setActivePreview={setActivePreview} />;
  }

  return (
    <div className="product-preview">
      <div className="hero-video-frame">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/demo/swipe-loop-poster.jpg"
          aria-label="Swiping through Twitch clips in Clipzy, keeping one and archiving another"
          onError={() => setVideoFailed(true)}
        >
          <source src="/demo/swipe-loop.webm" type="video/webm" />
          <source src="/demo/swipe-loop.mp4" type="video/mp4" />
        </video>
      </div>
      <p className="authentic-label"><Check size={13} /> Recorded in the live app</p>
    </div>
  );
}

function DemoPlayer() {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <button className="demo-poster" onClick={() => setPlaying(true)} aria-label="Play the Clipzy walkthrough">
        <img src="/demo/walkthrough-poster.jpg" alt="" />
        <span className="demo-play"><Play size={26} aria-hidden="true" /></span>
        <span className="demo-duration">1:23</span>
      </button>
    );
  }

  return (
    <div className="demo-video-frame">
      <video
        controls
        autoPlay
        playsInline
        preload="metadata"
        poster="/demo/walkthrough-poster.jpg"
        aria-label="Clipzy walkthrough: library, download, editor, and captions"
      >
        <source src="/demo/walkthrough.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function ProductPreview({ activePreview, setActivePreview }) {
  const active = previews.find((preview) => preview.id === activePreview) || previews[0];

  return (
    <div className="product-preview">
      <div className="preview-tabs" role="tablist" aria-label="Clipzy release screenshots">
        {previews.map((preview) => (
          <button
            key={preview.id}
            role="tab"
            aria-selected={activePreview === preview.id}
            onClick={() => setActivePreview(preview.id)}
          >
            {preview.label}
          </button>
        ))}
      </div>
      <div className="release-preview">
        <img src={active.src} alt={`Clipzy ${active.label} screen`} />
      </div>
      <p className="authentic-label"><Check size={13} /> Captured from the live app</p>
    </div>
  );
}

function StoreBadges({ className = "" }) {
  return (
    <div className={`store-badges ${className}`.trim()} aria-label="Download Clipzy">
      <a href={APP_STORE_URL} target="_blank" rel="noreferrer" aria-label="Download Clipzy on the App Store">
        <img src="/email/apple-app-store-badge.png" alt="Download on the App Store" />
      </a>
      <a href={GOOGLE_PLAY_URL} target="_blank" rel="noreferrer" aria-label="Get Clipzy on Google Play">
        <img src="/email/google-play-badge.png" alt="Get it on Google Play" />
      </a>
    </div>
  );
}

function TourCard({ number, kicker, title, body, src, alt }) {
  return (
    <article className="tour-card">
      <div className="tour-copy">
        <span className="tour-number">{number}</span>
        <p className="kicker">{kicker}</p>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
      <img src={src} alt={alt} loading="lazy" />
    </article>
  );
}

function Feature({ icon: Icon, title, body }) {
  return <article className="mini-feature"><span><Icon /></span><h3>{title}</h3><p>{body}</p></article>;
}

function PricingCard({ name, price, cadence, annual, description, features, featured = false }) {
  return (
    <article className={`pricing-card${featured ? " pricing-card-featured" : ""}`}>
      <div className="pricing-card-topline">
        <p className="pricing-tier">
          {featured && <Sparkles size={16} aria-hidden="true" />}
          Clipzy {name}
        </p>
        {featured && <span className="coming-soon">Available now</span>}
      </div>
      <div className="price">
        <strong>{price}</strong>
        <span>{cadence}</span>
      </div>
      {annual ? (
        <p className="annual-price"><strong>{annual}</strong><span>Best value</span></p>
      ) : (
        <p className="annual-price annual-price-placeholder">No card required</p>
      )}
      <p className="pricing-description">{description}</p>
      <a className={`button ${featured ? "button-primary" : "button-quiet"}`} href="#download">
        Download Clipzy <Download size={17} />
      </a>
      <ul>
        {features.map((feature) => (
          <li key={feature}><Check size={16} aria-hidden="true" /> {feature}</li>
        ))}
      </ul>
    </article>
  );
}
