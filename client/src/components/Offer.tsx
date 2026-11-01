import {
  ArrowUpRight,
  Bean,
  Clapperboard,
  Flower2,
  Gamepad2,
  Languages,
  Leaf,
  LifeBuoy,
  MapPinned,
  MessageCircle,
  Palette,
  CreditCard,
  Shrub,
  Sprout,
  TreeDeciduous,
  Trees,
  type LucideIcon,
} from "lucide-react";

/* ── 72 seasons ─────────────────────────────────────────────────────── */

const SEGMENTS = 72;

/** The ring: 72 microseasons, one highlighted, with brackets for a solar term (3) and a season (18). */
function SeasonRing() {
  const cx = 160;
  const cy = 160;
  const rOuter = 132;
  const rInner = 104;
  const point = (angle: number, r: number) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const arc = (from: number, to: number, r: number) => {
    const [x1, y1] = point(from, r);
    const [x2, y2] = point(to, r);
    const large = to - from > 180 ? 1 : 0;
    return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };
  const step = 360 / SEGMENTS;
  return (
    <svg
      className="season-ring"
      viewBox="0 0 320 320"
      role="img"
      aria-label="A ring of 72 microseasons. Three make a solar term, eighteen make a season."
    >
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const [x1, y1] = point(i * step, rInner);
        const [x2, y2] = point(i * step, rOuter);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className="season-tick"
          />
        );
      })}
      {/* One microseason, highlighted */}
      <path
        d={`${arc(0, step, (rOuter + rInner) / 2)}`}
        className="season-highlight"
      />
      {/* A solar term: 3 segments */}
      <path d={arc(step * 6, step * 9, rOuter + 12)} className="season-bracket term" />
      {/* A season: 18 segments */}
      <path d={arc(step * 18, step * 36, rOuter + 12)} className="season-bracket season" />
      <circle cx={cx} cy={cy} r={rInner - 10} className="season-core" />
      <text x={cx} y={cy + 6} textAnchor="middle" className="season-number">
        72
      </text>
      <text x={cx} y={cy + 32} textAnchor="middle" className="season-caption">
        MICROSEASONS
      </text>
    </svg>
  );
}

export function Seasons() {
  return (
    <section
      className="seasons-section section-space"
      aria-labelledby="seasons-title"
    >
      <div className="page-width seasons-inner">
        <div className="seasons-copy">
          <span className="eyebrow">
            <span className="tiny-square" /> HOW WE MEASURE TIME
          </span>
          <h2 id="seasons-title">
            Your year has
            <br />
            <em>72 seasons.</em>
          </h2>
          <p>
            Japan's old calendar has 72 microseasons, each about five days
            long. Every one is a new beginning. Your landing page launches in
            one.
          </p>
          <p className="seasons-aside">No need to wait for January.</p>
          <dl className="season-units">
            <div>
              <dt>
                <span className="unit-swatch micro" /> Microseason
              </dt>
              <dd>5 days</dd>
            </div>
            <div>
              <dt>
                <span className="unit-swatch term" /> Solar term
              </dt>
              <dd>15 days · 3 microseasons</dd>
            </div>
            <div>
              <dt>
                <span className="unit-swatch season" /> Season
              </dt>
              <dd>90 days · 6 solar terms</dd>
            </div>
          </dl>
        </div>
        <SeasonRing />
      </div>
    </section>
  );
}

/* ── Tiers ──────────────────────────────────────────────────────────── */

export type Tier = {
  n: number;
  growth: string;
  icon: LucideIcon;
  name: string;
  line: string;
  time: string;
  price: string;
  enquiry: string;
};

export const tiers: Tier[] = [
  { n: 0, growth: "Seed", icon: Bean, name: "Landing page", line: "One page, one action.", time: "1 microseason · 5 days", price: "from $50", enquiry: "Landing page" },
  { n: 1, growth: "Sprout", icon: Sprout, name: "Business site", line: "Your credible online home: 3–5 pages, contact and map.", time: "2 microseasons · 10 days", price: "$500–1,000", enquiry: "Business website" },
  { n: 2, growth: "Bud", icon: Leaf, name: "Managed site", line: "Bookings, menus you edit yourself, two languages.", time: "1 solar term · 15 days", price: "$1,500–2,500", enquiry: "Managed site" },
  { n: 3, growth: "Bloom", icon: Flower2, name: "Online store", line: "Payments, inventory and invoices.", time: "2 solar terms · 30 days", price: "$3,000–6,000", enquiry: "Online store" },
  { n: 4, growth: "Branch", icon: Shrub, name: "Platform", line: "Accounts, dashboards and roles.", time: "1 season · 90 days", price: "$8,000–15,000", enquiry: "Platform" },
  { n: 5, growth: "Tree", icon: TreeDeciduous, name: "Web app & SaaS", line: "Subscriptions, custom logic and integrations.", time: "1–2 seasons", price: "from $15,000", enquiry: "Web app" },
  { n: 6, growth: "Forest", icon: Trees, name: "Ecosystem", line: "Web, mobile app, ERP and CRM working as one.", time: "By proposal", price: "from $30,000", enquiry: "Ecosystem" },
];

const bands: { title: string; em: string; aside: string; tiers: number[] }[] = [
  { title: "Start", em: "here.", aside: "No jargon. No surprises.", tiers: [0, 1, 2] },
  { title: "Sell and", em: "scale.", aside: "Your shop never closes. You still can.", tiers: [3, 4] },
  { title: "Build the", em: "system.", aside: "Big systems. Small egos.", tiers: [5, 6] },
];

export function Tiers({ onEnquire }: { onEnquire: (type: string) => void }) {
  return (
    <section
      className="tiers-section section-space"
      id="services"
      aria-labelledby="tiers-title"
    >
      <div className="page-width">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="tiny-square" /> WHAT I DO
            </span>
            <h2 id="tiers-title">
              Seven tiers.
              <br />
              <em>One season at a time.</em>
            </h2>
          </div>
          <p>
            From one page to a full ecosystem. Pick the tier your business
            needs today; grow into the next when you're ready.
          </p>
        </div>
        {bands.map(band => (
          <div className="tier-band" key={band.title}>
            <div className="tier-band-head">
              <h3>
                {band.title} <em>{band.em}</em>
              </h3>
              <span>{band.aside}</span>
            </div>
            <div className={`tier-grid cols-${band.tiers.length}`}>
              {band.tiers.map(i => {
                const t = tiers[i];
                return (
                  <article className="tier-card" key={t.n}>
                    <div className="tier-badge">
                      <t.icon size={22} strokeWidth={1.5} aria-hidden="true" />
                      <span>
                        Tier {t.n} · {t.growth}
                      </span>
                    </div>
                    <h4>{t.name}</h4>
                    <p>{t.line}</p>
                    <dl>
                      <div>
                        <dt>Timeline</dt>
                        <dd>{t.time}</dd>
                      </div>
                      <div>
                        <dt>Price</dt>
                        <dd className="tier-price">{t.price}</dd>
                      </div>
                    </dl>
                    <a
                      href="#contact"
                      className="tier-link"
                      onClick={e => {
                        e.preventDefault();
                        onEnquire(t.enquiry);
                      }}
                    >
                      Start a {t.growth.toLowerCase()} project{" "}
                      <ArrowUpRight size={16} />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
        <p className="tiers-note">
          Prices in USD. Starting prices shown; final scope is agreed in a
          written proposal. Timelines start from approved content.
        </p>
      </div>
    </section>
  );
}

/* ── Power-ups ──────────────────────────────────────────────────────── */

const powerUps: { icon: LucideIcon; name: string; price: string }[] = [
  { icon: Languages, name: "Arabic edition", price: "+50% of build" },
  { icon: CreditCard, name: "Local payments", price: "$400 each" },
  { icon: MessageCircle, name: "WhatsApp ordering", price: "$300" },
  { icon: Clapperboard, name: "Cinematic hero video", price: "$250" },
  { icon: Palette, name: "Brand starter kit", price: "$600" },
  { icon: MapPinned, name: "Local search setup", price: "$250" },
  { icon: Gamepad2, name: "Studio + Arcade", price: "+30%" },
  { icon: LifeBuoy, name: "Care plans", price: "$50–300 / mo" },
];

export function PowerUps() {
  return (
    <section
      className="powerups-section section-space"
      aria-labelledby="powerups-title"
    >
      <div className="page-width">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="tiny-square" /> ADD TO ANY TIER
            </span>
            <h2 id="powerups-title">
              Power-ups.
              <br />
              <em>Optional. Like extra lives.</em>
            </h2>
          </div>
          <p>
            The things that are hard to do on your own: payments, language,
            video, local search and keeping it all running.
          </p>
        </div>
        <ul className="powerup-grid">
          {powerUps.map(p => (
            <li className="powerup-tile" key={p.name}>
              <p.icon size={26} strokeWidth={1.4} aria-hidden="true" />
              <span className="powerup-name">{p.name}</span>
              <span className="powerup-price">{p.price}</span>
            </li>
          ))}
        </ul>
        <p className="tiers-note">
          Local payments: KNET, Mada, Benefit or Tap. Care plans cover hosting,
          updates, backups and monthly fixes.
        </p>
      </div>
    </section>
  );
}
