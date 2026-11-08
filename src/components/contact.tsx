import { profile } from "@/lib/profile";
export function Contact() {
  return (
    <div className="contact-links">
      {profile.email ? (
        <a className="text-link" href={`mailto:${profile.email}`}>
          Start a conversation ↗
        </a>
      ) : (
        <p className="muted">Contact details will be added soon.</p>
      )}
      {profile.github && <a href={profile.github}>GitHub ↗</a>}
      {profile.linkedin && <a href={profile.linkedin}>LinkedIn ↗</a>}
    </div>
  );
}
