import { experienceHighlights } from "@/lib/experience";

export function ExperienceStrip() {
  return (
    <ul
      className="experience-strip"
      aria-label="Education and experience"
      role="list"
    >
      {experienceHighlights.map((item) => (
        <li key={item.institution}>
          <a
            href={item.href}
            aria-label={`${item.institution}, ${item.role}, ${item.dates}. Explore the Journey.`}
          >
            <strong>{item.institution}</strong>
            <span>{item.role}</span>
            <span className="micro">{item.dates}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
