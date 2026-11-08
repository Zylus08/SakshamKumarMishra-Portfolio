import { profile } from "@/lib/profile";
import Link from "next/link";
import { SocialLinks } from "./social-links";
export function Contact() {
  return (
    <div className="contact-links">
      <Link className="text-link" href="/contact">
        Start a conversation ↗
      </Link>
      {profile.email ? (
        <a className="text-link" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      ) : null}
      <SocialLinks />
    </div>
  );
}
