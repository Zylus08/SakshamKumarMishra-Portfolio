import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Field } from "@/components/field";
import { Reveal } from "@/components/reveal";
import { Contact } from "@/components/contact";
import { ContactForm } from "@/components/contact-form";
import { Photograph } from "@/components/photograph";
import { photographs } from "@/lib/assets";
import { getEntries } from "@/lib/content";
import { homepageProjects, resolvedPathways } from "@/lib/career-content";
import { CareerPathways } from "@/components/career-pathways";
import { availableDocuments } from "@/lib/asset-files";
import { profile, origin } from "@/lib/profile";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  const research = getEntries("research")
      .filter((entry) => entry.featured)
      .slice(0, 3),
    projects = homepageProjects();
  const quantResume = availableDocuments().find(
    (doc) => doc.id === "quantitative",
  );
  return (
    <Reveal>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.name,
            url: origin,
            description:
              "Computer Engineering undergraduate interested in machine learning and systems engineering.",
          }),
        }}
      />
      <section className="hero section">
        <div className="hero-top micro">
          <span>
            <i className="dot" /> INDEPENDENT CURIOSITY. SHARED DISCOVERY.
          </span>
          <span>DELHI, INDIA / 28.61° N</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">SAKSHAM KUMAR MISHRA</p>
          <div className="hero-heading">
            <h1>
              The pursuit of
              <br />
              <em>understanding.</em>
            </h1>
            <Photograph photo={photographs.portrait} compact />
          </div>
          <div className="hero-intro">
            <span className="hero-asterisk" aria-hidden="true">
              ✳
            </span>
            <p>
              I’m Saksham. I build quantitative systems, machine-learning
              models, and research-driven software—where correctness,
              measurement, and performance matter.
            </p>
            <div className="hero-actions">
              <Link className="button" href="#selected-work">
                Explore selected work <ArrowUpRight size={17} />
              </Link>
              {quantResume && (
                <a
                  className="text-link"
                  href={quantResume.file!}
                  download={quantResume.downloadName}
                  aria-label="Download Quantitative Research Resume (PDF)"
                >
                  Quant résumé ↓
                </a>
              )}
            </div>
          </div>
        </div>
        <Field />
        <div className="hero-bottom micro">
          <span>RESEARCHER / ENGINEER / BUILDER</span>
          <a href="#selected-work">
            SCROLL TO EXPLORE <ArrowDown size={14} />
          </a>
        </div>
      </section>
      <section className="section research-section" id="selected-work">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">01 / THE RESEARCHER</p>
          <div>
            <h2>
              Better questions.
              <br />
              <em>Deeper understanding.</em>
            </h2>
            <p>
              Exploring how machines learn, what they represent, and how
              intelligence can work within real constraints.
            </p>
          </div>
          <Link className="text-link" href="/research">
            Research archive <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="research-list">
          {research.map((e, i) => (
            <Link
              data-reveal
              href={`/research/${e.slug}`}
              key={e.slug}
              className="research-row"
            >
              <span className="micro">0{i + 1}</span>
              <div>
                <p className="micro">{e.category}</p>
                <h3>{e.title}</h3>
                <p>{e.summary}</p>
                <span className="status">{e.status}</span>
              </div>
              <div className={`abstract abstract-${i}`} aria-hidden="true">
                {Array.from({ length: 9 }, (_, j) => (
                  <i key={j} />
                ))}
              </div>
              <ArrowUpRight className="row-arrow" size={24} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section engineering">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">02 / THE ENGINEER</p>
          <div>
            <h2>
              Ideas, made
              <br />
              <em>executable.</em>
            </h2>
            <p>
              A closer look at the systems behind the interface. Structure,
              trade-offs, and the details that matter.
            </p>
          </div>
          <Link className="text-link" href="/projects">
            All projects <ArrowUpRight size={17} />
          </Link>
        </div>
        <CareerPathways pathways={resolvedPathways()} />
        <div className="project-stack">
          {projects.map((e, i) => (
            <Link
              data-reveal
              key={e.slug}
              className="project-panel"
              href={`/projects/${e.slug}`}
            >
              <div className="project-art" aria-hidden="true">
                {e.slug === "project-janus" ? (
                  <div className="chess-grid">
                    {Array.from({ length: 64 }, (_, j) => (
                      <span key={j}>
                        {j === 27 ? "♞" : j === 36 ? "♔" : ""}
                      </span>
                    ))}
                  </div>
                ) : e.slug === "tradecore" ? (
                  <div className="order-bars">
                    {Array.from({ length: 12 }, (_, j) => (
                      <i
                        key={j}
                        style={{ width: `${25 + ((j * 17) % 70)}%` }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="broker-art">
                    <span>{e.tags[0]}</span>
                    <b>→</b>
                    <span>{e.tags[1]}</span>
                    <b>→</b>
                    <span>{e.tags[2]}</span>
                  </div>
                )}
              </div>
              <div className="project-copy">
                <p className="micro">
                  BUILD / 0{i + 1} · {e.category}
                </p>
                <h3>{e.title}</h3>
                <p>{e.preview}</p>
                <div className="tags">
                  {e.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <span className="text-link">
                  Explore case study <ArrowUpRight size={17} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="section journey">
        <div data-reveal>
          <p className="eyebrow">03 / THE JOURNEY</p>
          <h2>
            Always a<br />
            <em>student.</em>
          </h2>
          <p className="section-description">
            A direction shaped by learning, making, and asking the next
            question.
          </p>
        </div>
        <div>
          {profile.timeline.map((t, i) => (
            <div className="timeline-item" data-reveal key={t.title}>
              <span className="micro">
                0{i + 1} / {t.label}
              </span>
              <h3>{t.title}</h3>
              <p>{t.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section personal" data-reveal>
        <Photograph photo={photographs.lifestyle} variant="lifestyle" />
        <div>
          <p className="eyebrow">04 / BEYOND THE TERMINAL</p>
          <h2>
            Some things
            <br />
            can’t be <em>compiled.</em>
          </h2>
          <p>
            The rhythm of Delhi. A line of poetry that stays. A film that makes
            the familiar feel different. There is a life outside the editor, and
            it has a way of finding its way back into the work.
          </p>
          <div className="personal-redirects">
            <Link href="/writing" className="personal-redirect">
              <h3>Words beyond code.</h3>
              <p>Poetry, reflections, and unfinished thoughts.</p>
              <span className="text-link">
                Explore the writing{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
            <Link href="/about" className="personal-redirect">
              <h3>The person behind the projects.</h3>
              <p>A little about where I come from and what keeps me curious.</p>
              <span className="text-link">
                Get to know me <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </div>
          <details className="easter-egg">
            <summary>A small note from Delhi</summary>
            <p>
              Between the city’s noise and a quiet page, there is room for
              another question.
            </p>
          </details>
        </div>
      </section>
      <section className="section invitation" data-reveal>
        <p className="eyebrow">05 / THE INVITATION</p>
        <h2>
          The next good idea
          <br />
          starts with a <em>conversation.</em>
        </h2>
        <p>
          Research collaborations, thoughtful engineering, or an interesting
          question.
          <br />
          There’s always room to explore.
        </p>
        <Contact />
        <ContactForm />
        <span className="invitation-star" aria-hidden="true">
          ✳
        </span>
      </section>
    </Reveal>
  );
}
