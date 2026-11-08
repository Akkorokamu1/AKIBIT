import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  ArrowRight,
  X,
  Check,
  MoveUpRight,
  Sun,
} from "lucide-react";
import { projects, type Project, type ProjectCategory } from "@/lib/projects";
import { netlifyTarget } from "@/lib/deployment";

export function BrowserChrome({ name }: { name: string }) {
  return (
    <div className="browser-chrome" aria-hidden="true">
      <span className="browser-dots">
        <i />
        <i />
        <i />
      </span>
      <span>{name.toLowerCase().replaceAll(" ", "")}.concept</span>
      <span>↗</span>
    </div>
  );
}

export function ConceptArt({
  project,
  hero = false,
}: {
  project: Project;
  hero?: boolean;
}) {
  const textOnly = netlifyTarget ? " text-only-concept" : "";
  if (project.theme === "coffee")
    return (
      <div
        className={`concept-art coffee-art ${hero ? "is-hero" : ""}${textOnly}`}
      >
        <div className="mini-nav">
          <span className="mini-coffee-logo">
            sunday<span>®</span>
          </span>
          <span>COFFEE & GOOD COMPANY</span>
          <span>MENU ↗</span>
        </div>
        <div className="coffee-content">
          <div className="coffee-copy">
            <span className="mini-eyebrow">YOUR DAILY LITTLE RITUAL</span>
            <h3>
              Good coffee.
              <br />
              <em>Better mornings.</em>
            </h3>
            <p>
              Slow down. Sip something good.
              <br />
              Stay a little longer.
            </p>
            <span className="mini-cta">
              Find your Sunday <ArrowUpRight size={11} />
            </span>
          </div>
          {!netlifyTarget && (
            <img
              src={project.image}
              alt="Espresso and coffee packaging in warm café sunlight"
              width="1536"
              height="1024"
              fetchPriority={hero ? "high" : undefined}
              loading={hero ? "eager" : "lazy"}
            />
          )}
        </div>
        <div className="mini-bottom">
          <span>BREWED WITH CARE. ALWAYS.</span>
          <Sun size={16} />
          <span>INDEPENDENT & LOCAL</span>
        </div>
      </div>
    );
  if (project.theme === "interior")
    return (
      <div className={`concept-art interior-art${textOnly}`}>
        <div className="mini-nav">
          <span className="mini-forma-logo">forma.</span>
          <span>ARCHITECTURE · INTERIORS</span>
          <span>LET'S TALK ↗</span>
        </div>
        <div className="interior-content">
          <div>
            <span className="mini-eyebrow">CONSIDERED DESIGN. EVERY DAY.</span>
            <h3>
              Spaces to feel
              <br />
              <em>at home in.</em>
            </h3>
          </div>
          {!netlifyTarget && (
            <img
              src={project.image}
              alt="Sunlit living room with sculptural furniture and natural materials"
              width="1536"
              height="1024"
              loading="lazy"
            />
          )}
          <span className="interior-caption">
            Thoughtful spaces. A different way of living.{" "}
            <MoveUpRight size={15} />
          </span>
        </div>
      </div>
    );
  if (project.theme === "vms")
    return (
      <div className={`concept-art vms-art${textOnly}`}>
        <div className="mini-nav">
          <span className="mini-vms-logo">VMS</span>
          <span>WORK · APPROACH · CONTACT</span>
          <span>START A BRIEF ↗</span>
        </div>
        <div className="vms-content">
          <span className="mini-eyebrow">MARKETING STRATEGY STUDIO</span>
          <h3>
            Strategy that
            <br />
            <em>sees further.</em>
          </h3>
          <p>Clear briefs, measured bets, and reporting you can act on.</p>
          <span className="mini-cta">
            Start a brief <ArrowUpRight size={11} />
          </span>
        </div>
      </div>
    );
  return (
    <div className={`concept-art wellness-art${textOnly}`}>
      <div className="mini-nav">
        <span className="mini-bloom-logo">
          bloom
          <Sun size={15} />
        </span>
        <span>MOVE WITH INTENTION</span>
        <span>FIND YOUR FLOW ↗</span>
      </div>
      <div className="wellness-content">
        <div>
          <span className="mini-eyebrow">YOUR SPACE TO RESET</span>
          <h3>
            A little space
            <br />
            <em>for yourself.</em>
          </h3>
          <p>Movement that meets you where you are.</p>
          <span className="mini-cta">
            Explore movement <ArrowUpRight size={11} />
          </span>
        </div>
        {!netlifyTarget && (
          <img
            src={project.image}
            alt="Calm Pilates studio with oak equipment and sage accents"
            width="1536"
            height="1024"
            loading="lazy"
          />
        )}
      </div>
      <div className="mini-bottom">
        <span>PILATES</span>
        <span>MINDFUL MOVEMENT</span>
        <span>A FRESH START</span>
      </div>
    </div>
  );
}

export function HeroShowcase() {
  return (
    <div
      className={`hero-showcase${netlifyTarget ? " text-only-showcase" : ""}`}
      aria-label="A selection of fictional website and app design concepts"
    >
      <div className="showcase-note">
        <span className="note-line" />
        Good businesses.
        <br />
        <em>Great possibilities.</em>
      </div>
      <div className="hero-browser">
        <BrowserChrome name="Sunday Coffee" />
        <ConceptArt project={projects[0]} hero />
      </div>
      <div className="hero-secondary">
        {!netlifyTarget && (
          <div className="secondary-photo">
            <img
              src={projects[1].image}
              alt="Interior photography for the Forma Studio design concept"
              width="1536"
              height="1024"
              loading="lazy"
            />
          </div>
        )}
        <span>
          forma.<small>SPACES THAT FEEL LIKE YOU.</small>
        </span>
        {netlifyTarget && (
          <p className="secondary-editorial">
            Spaces to feel
            <br />
            <em>at home in.</em>
          </p>
        )}
      </div>
      <div className="hero-phone" aria-hidden="true">
        <div className="phone-island" />
        <div className="phone-top">
          <span>9:41</span>
          <span>•••</span>
        </div>
        <div className="phone-brand">
          bloom <Sun size={17} />
        </div>
        <span className="phone-kicker">A LITTLE TIME FOR YOU</span>
        <h3>
          Find your
          <br />
          <em>flow.</em>
        </h3>
        {!netlifyTarget && (
          <img
            src={projects[2].image}
            alt=""
            width="1536"
            height="1024"
            loading="lazy"
          />
        )}
        <div className="phone-class">
          <span>
            Morning reset<small>Gentle Pilates · 45 min</small>
          </span>
          <span className="class-arrow">↗</span>
        </div>
        <div className="phone-day">
          <span>M</span>
          <span>T</span>
          <b>W</b>
          <span>T</span>
          <span>F</span>
        </div>
        <div className="phone-button">Make space for yourself</div>
      </div>
      <span className="concept-stamp">EXPLORATION, NOT CLIENT WORK</span>
    </div>
  );
}

export default function Concepts({
  onEnquire,
}: {
  onEnquire: (type: string) => void;
}) {
  const [filter, setFilter] = useState<"All work" | ProjectCategory>(
    "All work"
  );
  const [selected, setSelected] = useState<Project | null>(null);
  const [view, setView] = useState<"design" | "thinking">("design");
  const filtered = projects.filter(
    p => filter === "All work" || p.category === filter
  );
  return (
    <section
      className="work-section page-width section-space"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <span className="tiny-square" /> THE POSSIBILITIES
          </span>
          <h2 id="work-title">
            Different businesses.
            <br />
            <em>Distinctive digital experiences.</em>
          </h2>
        </div>
        <p>
          A few ideas of what your next chapter could look like. Designed around
          the business, not a template.
        </p>
      </div>
      <div className="work-toolbar">
        <div className="filters" aria-label="Filter concept projects">
          {(
            ["All work", "Websites", "Landing pages", "App design"] as const
          ).map(f => (
            <button
              key={f}
              aria-pressed={filter === f}
              className={filter === f ? "filter active" : "filter"}
              onClick={() => setFilter(f)}
            >
              {f}
              {f === "All work" && <span>03</span>}
            </button>
          ))}
        </div>
        <span className="concept-label">
          Independent concepts · Not client commissions
        </span>
      </div>
      <div className="work-grid" aria-live="polite">
        {filtered.map((p, i) => (
          <article className={`work-card ${p.theme}`} key={p.id}>
            <button
              className="work-art-button"
              onClick={() => {
                setSelected(p);
                setView("design");
              }}
              aria-label={`Explore ${p.name}, a fictional ${p.category.toLowerCase()} concept`}
            >
              <ConceptArt project={p} />
              <span className="work-open">
                <ArrowUpRight size={21} />
              </span>
            </button>
            <div className="work-card-info">
              <div>
                <span className="project-index">
                  0{projects.indexOf(p) + 1} / {p.business}
                </span>
                <h3>
                  <button
                    onClick={() => {
                      setSelected(p);
                      setView("design");
                    }}
                  >
                    {p.name}
                    <ArrowUpRight size={19} />
                  </button>
                </h3>
              </div>
              <span className="project-type">{p.category}</span>
            </div>
          </article>
        ))}
      </div>
      <p className="work-disclaimer">
        Fictional brands, original design explorations. Presented to show
        possibilities—not past client results.
      </p>
      <Dialog.Root
        open={!!selected}
        onOpenChange={open => {
          if (!open) setSelected(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="project-dialog">
            {selected && (
              <>
                <div className="dialog-header">
                  <div>
                    <span className="eyebrow">
                      FICTIONAL CONCEPT / {selected.category.toUpperCase()}
                    </span>
                    <Dialog.Title>{selected.name}</Dialog.Title>
                  </div>
                  <Dialog.Close
                    className="icon-button"
                    aria-label="Close concept"
                  >
                    <X size={22} />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="dialog-description">
                  {selected.description}
                </Dialog.Description>
                <div
                  className="dialog-tabs"
                  role="group"
                  aria-label="Concept detail view"
                >
                  <button
                    aria-pressed={view === "design"}
                    onClick={() => setView("design")}
                    className={view === "design" ? "active" : ""}
                  >
                    The design
                  </button>
                  <button
                    aria-pressed={view === "thinking"}
                    onClick={() => setView("thinking")}
                    className={view === "thinking" ? "active" : ""}
                  >
                    The thinking
                  </button>
                </div>
                {view === "design" ? (
                  <div className="dialog-preview">
                    <BrowserChrome name={selected.name} />
                    <ConceptArt project={selected} />
                  </div>
                ) : (
                  <div className="project-thinking">
                    <span className="eyebrow">THE BUSINESS GOAL</span>
                    <h3>{selected.goal}</h3>
                    <ul>
                      {selected.decisions.map(d => (
                        <li key={d}>
                          <Check size={18} />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <p>
                      This is a visual direction, not a deployed client website
                      or a working booking app. Features and performance would
                      be scoped and verified for a real project.
                    </p>
                  </div>
                )}
                <div className="dialog-footer">
                  <span>Have a business like this?</span>
                  <button
                    className="button button-dark"
                    onClick={() => {
                      onEnquire(
                        selected.category === "Websites"
                          ? "Business website"
                          : selected.category === "Landing pages"
                            ? "Landing page"
                            : "App design"
                      );
                      setSelected(null);
                    }}
                  >
                    Let's explore your idea <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
