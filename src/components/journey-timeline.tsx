import Link from "next/link";
import { journeyMonth, journeyYears } from "@/lib/journey";
import { profile } from "@/lib/profile";

export function JourneyTimeline() {
  return (
    <section
      className="section journey"
      id="journey"
      aria-labelledby="journey-title"
    >
      <div className="journey-intro" data-reveal>
        <p className="eyebrow">03 / THE JOURNEY</p>
        <h2 id="journey-title">
          The <em>Journey.</em>
        </h2>
        <p className="section-description">
          Learning by entering the work. Research questions, shared systems, and
          the people who shaped what came next.
        </p>
        <p className="journey-caption">
          August 2024 — present
          <br />
          Ordered by start date. Several strands overlap.
        </p>
      </div>
      <div className="journey-years">
        {journeyYears(profile.timeline).map(({ year, milestones }) => (
          <div className="journey-year" key={year}>
            <h3 id={`journey-year-${year}`} className="journey-year-label">
              {year}
            </h3>
            <ol
              aria-labelledby={`journey-year-${year}`}
              className="journey-events"
            >
              {milestones.map((item) => (
                <li
                  className="journey-event"
                  data-reveal
                  data-milestone={item.id}
                  key={item.id}
                >
                  <div className="journey-date micro">
                    <time dateTime={item.start}>
                      {journeyMonth(item.start)}
                    </time>
                    {item.end && (
                      <>
                        <span aria-hidden="true"> — </span>
                        <span className="sr-only"> to </span>
                        {item.end === "present" ? (
                          <span>present</span>
                        ) : (
                          <time dateTime={item.end}>
                            {journeyMonth(item.end)}
                          </time>
                        )}
                      </>
                    )}
                  </div>
                  <p
                    className={`journey-category micro journey-category-${item.category.toLowerCase()}`}
                  >
                    {item.category}
                  </p>
                  <h4>{item.title}</h4>
                  <p className="journey-description">{item.description}</p>
                  {item.link && (
                    <Link
                      className="text-link journey-link"
                      href={item.link.href}
                    >
                      {item.link.label} <span aria-hidden="true">↗</span>
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
