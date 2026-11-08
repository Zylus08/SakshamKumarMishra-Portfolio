export type ProfessionalDocument = {
  id: string;
  title: string;
  description: string;
  type: "Resume" | "Academic CV";
  file: string | null;
  downloadName: string;
};
export const documents: ProfessionalDocument[] = [
  {
    id: "software",
    title: "Software Engineering Resume",
    description: "Systems, software, and engineering work.",
    type: "Resume",
    file: null,
    downloadName: "Saksham-Kumar-Mishra-Software-Engineering-Resume.pdf",
  },
  {
    id: "machine-learning",
    title: "Machine Learning / AI Resume",
    description: "Machine intelligence and applied research.",
    type: "Resume",
    file: null,
    downloadName: "Saksham-Kumar-Mishra-Machine-Learning-Resume.pdf",
  },
  {
    id: "quantitative",
    title: "Quantitative Research Resume",
    description: "Quantitative research and performance-oriented computing.",
    type: "Resume",
    file: null,
    downloadName: "Saksham-Kumar-Mishra-Quantitative-Research-Resume.pdf",
  },
  {
    id: "academic",
    title: "Academic / Research CV",
    description: "An extended academic and research record.",
    type: "Academic CV",
    file: null,
    downloadName: "Saksham-Kumar-Mishra-Academic-CV.pdf",
  },
];
export type Photograph = {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectPosition: string;
};
export const photographs: {
  portrait: Photograph | null;
  lifestyle: Photograph | null;
} = { portrait: null, lifestyle: null };
