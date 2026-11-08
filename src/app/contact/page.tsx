import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";
export const metadata = {
  title: "Contact",
  description:
    "Start a conversation about research, engineering, or an interesting question.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return (
    <div className="section contact-page">
      <header className="page-heading">
        <p className="eyebrow">SKM / THE NEXT CONVERSATION</p>
        <h1>
          Something worth
          <br />
          <em>exploring?</em>
        </h1>
        <p>
          Research collaborations, thoughtful engineering, or a question that
          deserves more than a quick answer.
        </p>
      </header>
      <div className="contact-layout">
        <aside>
          <p className="eyebrow">LET’S COMPARE NOTES</p>
          <p>A few words about what you have in mind are enough to begin.</p>
          <SocialLinks />
          <p className="micro contact-location">DELHI, INDIA / UTC +05:30</p>
        </aside>
        <ContactForm />
      </div>
    </div>
  );
}
