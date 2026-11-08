import { profile } from "@/lib/profile";
import { Contact } from "@/components/contact";
export const metadata = { title: "About", alternates: { canonical: "/about" } };
export default function About() {
  return (
    <div className="section about">
      <header className="page-heading">
        <p className="eyebrow">SKM / THE PERSON BEHIND THE WORK</p>
        <h1>
          A curious mind.
          <br />
          <em>A builder’s instinct.</em>
        </h1>
        <p>
          I’m Saksham Kumar Mishra, a Computer Engineering undergraduate at
          Thapar Institute of Engineering & Technology, Patiala. My interests
          sit between machine learning research and the systems that bring ideas
          into the world.
        </p>
      </header>
      <div className="about-grid">
        <div className="about-monogram" aria-label="SKM monogram">
          skm<span>.</span>
          <small>DELHI → PATIALA → WHAT’S NEXT</small>
        </div>
        <div className="prose">
          <h2>Understanding before abstraction.</h2>
          <p>
            I’m interested in how representations emerge from data, and how
            useful models can run under practical constraints. Computer vision,
            time-series modeling, and efficient on-device learning are questions
            I keep returning to.
          </p>
          <h2>Build it. Measure it. Question it.</h2>
          <p>
            Systems programming and quantitative research appeal to the same
            instinct: understand the mechanism, examine the trade-offs, and let
            evidence guide the next decision. Reliability and clarity matter as
            much as an elegant idea.
          </p>
          <h2>Beyond the work.</h2>
          <p>
            Delhi is home. Poetry, literature, public speaking, music, and
            cinema offer different ways to pay attention. I like that
            engineering can be precise without making life less curious.
          </p>
        </div>
      </div>
      <section className="interest-section">
        <p className="eyebrow">AREAS OF INTEREST</p>
        <div className="interest-list">
          {profile.interests.map((interest, i) => (
            <span key={interest}>
              <small>0{i + 1}</small>
              {interest}
            </span>
          ))}
        </div>
      </section>
      <section className="about-contact">
        <h2>Something worth exploring?</h2>
        <p>
          Open to conversations about research, engineering, and the space
          between them.
        </p>
        <Contact />
      </section>
    </div>
  );
}
