import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Monitor,
  Layers3,
  Smartphone,
  Code2,
  Check,
  MapPin,
  Plus,
  Minus,
  Menu,
  X,
  Globe2,
} from "lucide-react";
import Concepts from "@/components/Concepts";
import Contact from "@/components/Contact";
import AkibitHero from "@/components/AkibitHero";
import ThemeToggle from "@/components/ThemeToggle";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Akibit, home"
    >
      <svg
        className="akibit-mark"
        viewBox="0 0 40 44"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M17 2h7l16 40H28l-3-9H14l-3 9H0L17 2Zm3 12-4 12h8l-4-12Z"
        />
        <path
          fill="none"
          stroke="#c7a45c"
          strokeWidth="1.8"
          d="m22 1-4 10 5 8-5 7 6 7-2 12"
        />
      </svg>
      <span className="brand-name">
        akibit
        <span className="brand-dot">.</span>
        <small lang="ja">アキビット</small>
      </span>
    </a>
  );
}
export function Header({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const prefix = home ? "" : "/";
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="page-width header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href={`${prefix}#work`}>The work</a>
            <a href={`${prefix}#services`}>What I do</a>
            <a href={`${prefix}#process`}>The process</a>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <a className="header-cta" href={`${prefix}#contact`}>
              Let's talk <ArrowUpRight size={17} />
            </a>
            <button
              className="menu-toggle icon-button"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
            onKeyDown={e => {
              if (e.key === "Escape") {
                setOpen(false);
                document
                  .querySelector<HTMLButtonElement>(".menu-toggle")
                  ?.focus();
              }
            }}
          >
            {[
              ["The work", "work"],
              ["What I do", "services"],
              ["The process", "process"],
              ["Let's talk", "contact"],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`${prefix}#${id}`}
                onClick={() => setOpen(false)}
              >
                {label}
                <ArrowUpRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-top">
        <div>
          <Brand />
          <p>
            Good design. Clear purpose.
            <br />
            Made around your business.
          </p>
        </div>
        <div className="footer-message">
          Independent thinking.
          <br />
          <em>Thoughtful digital design.</em>
        </div>
        <a href="/#contact" className="footer-top-link">
          Start a conversation <ArrowUpRight size={19} />
        </a>
      </div>
      <div className="page-width footer-bottom">
        <span>
          © {new Date().getFullYear()} Akibit. Freelance web & app design.
        </span>
        <div>
          <a href="/privacy">Privacy</a>
          <a href="/accessibility">Accessibility</a>
          <a href="#main">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
const services = [
  {
    icon: Monitor,
    index: "01",
    name: "Business websites",
    copy: "Your business deserves more than a pin on a map. A clear, credible online home that gives people a reason to choose you.",
    tags: "Strategy · Design · Development",
  },
  {
    icon: Layers3,
    index: "02",
    name: "Landing pages",
    copy: "One offer. One clear action. Focused pages that help turn interest into enquiries, bookings or your next sale.",
    tags: "Campaigns · Launches · Lead generation",
  },
  {
    icon: Smartphone,
    index: "03",
    name: "App & product design",
    copy: "Make a useful idea feel effortless. Thoughtful interfaces and user journeys for mobile apps and web-based products.",
    tags: "UX research · UI design · Prototyping",
  },
  {
    icon: Code2,
    index: "04",
    name: "Web app development",
    copy: "When your idea needs more than a page. Purpose-built web experiences, with the right features and a reliable foundation.",
    tags: "Scoping · Development · Integration",
  },
];
const phases = [
  {
    title: "Discover & define",
    text: "Understand your customers, choose one goal and agree on what must launch. Clear scope before a single screen.",
  },
  {
    title: "Design & align",
    text: "Get the message right. Shape the mobile journey, then approve one visual direction and a reusable design system.",
  },
  {
    title: "Build & verify",
    text: "Connect the real customer journey first. Check forms, responsiveness, accessibility foundations and failure states.",
  },
  {
    title: "Launch & hand over",
    text: "Review together, agree the go-live, keep a fallback and verify the live journey. You leave with access and a practical handover.",
  },
];
const faqs = [
  {
    q: "My business has no website. Where do we start?",
    a: "With your customers and one useful goal. Share your business name, what you offer and a Google Maps link if you have one. We'll define the smallest complete site that helps people understand your business and take the next step.",
  },
  {
    q: "Are the projects above real client work?",
    a: "They're original explorations for fictional brands, clearly labeled as concepts. They show how a café, design practice or wellness studio could communicate its value online. They don't represent previous commissions or proven client results.",
  },
  {
    q: "Can you build it, or just design it?",
    a: "Both are available: landing pages, business websites and web apps can include implementation. Native mobile app development, complex integrations and ongoing maintenance need a separately agreed scope. A visual app prototype is not the same as a production app.",
  },
  {
    q: "What will it cost, and how long will it take?",
    a: "That depends on the scope, content and integrations. After discovery, you'll get a clear proposal covering deliverables, cost, dependencies and a review window. Timelines are agreed around the actual work—not a one-size-fits-all promise.",
  },
  {
    q: "How do accessibility and privacy fit in?",
    a: "They're part of the foundation: semantic structure, keyboard access, visible focus, readable contrast, responsive layouts and clear form feedback. The privacy approach reflects the data you actually collect. Formal accessibility auditing and jurisdiction-specific legal review are separate requirements, not automatic guarantees.",
  },
  {
    q: "What happens after launch?",
    a: "The handover covers your project files, business-controlled access and how to maintain the site. We agree who owns updates, backups, enquiry responses and monitoring. Support or ongoing improvements can be scoped separately, so nothing important is left assumed.",
  },
];
export default function Home() {
  const [projectType, setProjectType] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  function enquire(type: string) {
    setProjectType(type);
    window.setTimeout(
      () =>
        document.getElementById("contact")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        }),
      80
    );
  }
  return (
    <>
      <Header />
      <main id="main">
        <AkibitHero />
        <div className="capability-strip">
          <div className="page-width">
            <span>SMALL BUSINESSES. BIG POSSIBILITIES.</span>
            <div>
              <span>Web design</span>
              <span className="strip-dot" />
              <span>App experiences</span>
              <span className="strip-dot" />
              <span>Clear strategy</span>
              <span className="strip-dot" />
              <span>Thoughtful development</span>
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
        <Concepts onEnquire={enquire} />
        <section
          className="services-section section-space"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="tiny-square" /> WHAT I CAN HELP WITH
                </span>
                <h2 id="services-title">
                  The right experience.
                  <br />
                  <em>For your next move.</em>
                </h2>
              </div>
              <p>
                From your first online presence to a more ambitious product.
                Start with what your business actually needs.
              </p>
            </div>
            <div className="services-list">
              {services.map(s => (
                <article key={s.index} className="service-row">
                  <span className="service-number">{s.index}</span>
                  <div className="service-name">
                    <s.icon size={27} strokeWidth={1.4} />
                    <h3>{s.name}</h3>
                  </div>
                  <div className="service-copy">
                    <p>{s.copy}</p>
                    <span>{s.tags}</span>
                  </div>
                  <a
                    href="#contact"
                    className="service-arrow"
                    aria-label={`Enquire about ${s.name}`}
                    onClick={() =>
                      setProjectType(
                        s.index === "01"
                          ? "Business website"
                          : s.index === "02"
                            ? "Landing page"
                            : s.index === "03"
                              ? "App design"
                              : "Web app"
                      )
                    }
                  >
                    <ArrowUpRight size={23} />
                  </a>
                </article>
              ))}
            </div>
            <div className="services-foot">
              <Check size={16} />
              <span>
                Responsive by design. Accessible foundations. Clear next steps.
              </span>
            </div>
          </div>
        </section>
        <section
          className="local-section page-width section-space"
          aria-labelledby="local-title"
        >
          <div className="local-visual" aria-hidden="true">
            <div className="map-grid">
              <span className="map-road road-one" />
              <span className="map-road road-two" />
              <span className="map-road road-three" />
              <div className="map-block block-one" />
              <div className="map-block block-two" />
              <div className="map-block block-three" />
              <div className="map-pin pin-one">
                <MapPin size={19} />
              </div>
              <div className="map-pin pin-two">
                <MapPin size={19} />
              </div>
              <div className="map-pin pin-three">
                <MapPin size={19} />
              </div>
              <div className="local-business-card">
                <div className="local-card-icon">
                  <Monitor size={24} />
                </div>
                <div>
                  <strong>A great local business</strong>
                  <span>Known in the neighborhood.</span>
                  <span className="local-card-status">
                    Ready for an online home <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
              <span className="map-tag">
                LOCAL DISCOVERY → DIGITAL POSSIBILITY
              </span>
            </div>
          </div>
          <div className="local-copy">
            <span className="eyebrow">
              <span className="tiny-square" /> FROM FOUND TO CHOSEN
            </span>
            <h2 id="local-title">
              More than a<br />
              <em>pin on the map.</em>
            </h2>
            <p>
              Some of the best businesses are easy to find on Google Maps—and
              harder to get to know online. I see that gap as an opportunity to
              tell a better story.
            </p>
            <p>
              My approach starts with human research, a relevant idea and a
              conversation. Not another generic website. A considered concept
              shaped around what your business offers.
            </p>
            <a href="#contact" className="text-link">
              Show me your business <ArrowUpRight size={18} />
            </a>
            <small>
              Independent work. No Google affiliation, automated scraping or
              bulk outreach. Concepts are shared with permission.
            </small>
          </div>
        </section>
        <section
          className="process-section section-space"
          id="process"
          aria-labelledby="process-title"
        >
          <div className="page-width">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  <span className="tiny-square" /> FROM ZERO TO LAUNCH
                </span>
                <h2 id="process-title">
                  A clear process.
                  <br />
                  <em>Nothing left to guess.</em>
                </h2>
              </div>
              <p>
                Fewer moving parts. One shared direction. The smallest complete
                experience that does the job well.
              </p>
            </div>
            <div className="process-steps">
              {phases.map((p, i) => (
                <article key={p.title}>
                  <div className="step-number">
                    <span>0{i + 1}</span>
                    {i !== 3 && <ArrowRight size={19} />}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
            <div className="process-principle">
              <span>THE WORKING RULE</span>
              <p>Reduce scope before reducing reliability.</p>
              <Check size={21} />
            </div>
          </div>
        </section>
        <section
          className="faq-section page-width section-space"
          aria-labelledby="faq-title"
        >
          <div>
            <span className="eyebrow">
              <span className="tiny-square" /> A FEW GOOD QUESTIONS
            </span>
            <h2 id="faq-title">
              Before we
              <br />
              <em>get into it.</em>
            </h2>
            <p>
              Have something else on your mind?
              <br />
              <a href="#contact" className="text-link">
                Let's talk it through <ArrowUpRight size={16} />
              </a>
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <article
                key={f.q}
                className={`faq-item ${openFaq === i ? "is-open" : ""}`}
              >
                <h3>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                  >
                    {f.q}
                    {openFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  hidden={openFaq !== i}
                >
                  <p>{f.a}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <Contact projectType={projectType} />
      </main>
      <Footer />
    </>
  );
}
