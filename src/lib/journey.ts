export type JourneyMilestone = {
  id: string;
  start: string;
  end?: string | "present";
  category: "Education" | "Research" | "Industry" | "Leadership";
  title: string;
  description: string;
  link?: { href: string; label: string };
};

// Month precision is intentional. Dates follow the latest user-supplied chronology;
// conflicts with older documents are recorded in docs/M4.1-JOURNEY-TIMELINE.md.
export const journeyMilestones: JourneyMilestone[] = [
  {
    id: "tiet-degree",
    start: "2024-08",
    category: "Education",
    title: "B.E. in Computer Engineering",
    description:
      "Began undergraduate study at Thapar Institute of Engineering & Technology (TIET), Patiala.",
  },
  {
    id: "h-star",
    start: "2025-01",
    category: "Research",
    title: "H-STAR · sign-language recognition",
    description:
      "Began exploring how visual and temporal representations can capture signed communication. Public methods and results remain under verification.",
    link: {
      href: "/research/h-star",
      label: "H-STAR outline · verification pending",
    },
  },
  {
    id: "iit-jodhpur",
    start: "2025-05",
    category: "Research",
    title: "Research internship · IIT Jodhpur",
    description:
      "Research internship at UbiSys Lab, Indian Institute of Technology Jodhpur, working on smartphone telemetry and self-supervised sensor representations.",
  },
  {
    id: "iit-ropar",
    start: "2025-08",
    category: "Research",
    title: "ISRO-backed project · IIT Ropar collaboration",
    description:
      "Contributed to a research project involving IIT Ropar, exploring drone autonomy and signal processing in GPS-denied environments. A project collaboration, not direct employment with ISRO.",
  },
  {
    id: "food-digital-twin",
    start: "2025-09",
    category: "Research",
    title: "UK Food Digital Twin",
    description:
      "Began supply-chain simulation research under Dr. Devnaad Singh, School of Business, UPES, combining digital twins with multi-agent learning.",
  },
  {
    id: "technical-coordinator",
    start: "2025-11",
    end: "2026-02",
    category: "Leadership",
    title: "Technical Coordinator · TVC & MLSC",
    description:
      "Coordinated technical work and student workshops across Thapar Venture Club and Microsoft Student Learn Chapter.",
  },
  {
    id: "fold",
    start: "2026-01",
    end: "2026-06",
    category: "Industry",
    title: "Internship · Fold Inc.",
    description:
      "Internship focused on autonomous software-maintenance systems. Related public work documents scoped contributions to Sama’s issue indexing and retrieval integration.",
    link: {
      href: "/projects/sama-contribution",
      label: "Read the Sama contribution record",
    },
  },
  {
    id: "urja",
    start: "2026-02",
    category: "Leadership",
    title: "Technical Executive · URJA Sports Fest",
    description:
      "Served as Technical Executive for URJA Sports Fest at Thapar Institute of Engineering & Technology.",
  },
  {
    id: "mobile-ml",
    start: "2026-03",
    end: "present",
    category: "Research",
    title: "Mobile ML research · Prof. Xingbin Wang",
    description:
      "Research associated with Prof. Xingbin Wang through MobileLoRA, exploring on-device adapter management under mobile memory and compute constraints.",
    link: {
      href: "/research/mobilelora",
      label: "MobileLoRA outline · verification pending",
    },
  },
  {
    id: "eeg",
    start: "2026-08",
    end: "2026-10",
    category: "Research",
    title: "EEG self-supervised representation learning",
    description:
      "Studied self-supervised EEG representations and subject-level evaluation, with reproducibility and uncertainty central to the research note.",
    link: {
      href: "/research/eeg-representation",
      label: "Read the EEG research note",
    },
  },
  {
    id: "tiet-coe",
    start: "2026-08",
    end: "present",
    category: "Industry",
    title: "Research & engineering internship · TIET",
    description:
      "Internship at the Center of Excellence in Data Science & Artificial Intelligence, TIET, with work on conversational AI systems.",
  },
];

export function journeyYears(items: JourneyMilestone[] = journeyMilestones) {
  const month = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new Error("Duplicate journey milestone");
  for (const item of items) {
    if (
      !month.test(item.start) ||
      (item.end &&
        item.end !== "present" &&
        (!month.test(item.end) || item.end < item.start))
    )
      throw new Error(`Invalid journey interval: ${item.id}`);
  }
  // Explicit original-index tie break preserves the supplied August 2026 order.
  const ordered = items
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) => a.item.start.localeCompare(b.item.start) || a.index - b.index,
    )
    .map(({ item }) => item);
  return [...new Set(ordered.map((item) => item.start.slice(0, 4)))].map(
    (year) => ({
      year,
      milestones: ordered.filter((item) => item.start.startsWith(year)),
    }),
  );
}

export function journeyMonth(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}-01T00:00:00Z`));
}
