import { configuredSocials, profile, type SocialPlatform } from "@/lib/profile";
export function SocialLinks({
  values = profile.socials,
}: {
  values?: Record<SocialPlatform, string>;
}) {
  const links = configuredSocials(values);
  if (!links.length) return null;
  return (
    <div className="social-links" aria-label="Professional profiles">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label} profile (opens in a new tab)`}
        >
          <span className="social-mark" aria-hidden="true">
            {link.mark}
          </span>
          {link.label}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
