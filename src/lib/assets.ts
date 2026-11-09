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
    file: "/documents/Saksham_Mishra_SWE_Resume.pdf",
    downloadName: "Saksham-Kumar-Mishra-Software-Engineering-Resume.pdf",
  },
  {
    id: "machine-learning",
    title: "Machine Learning / AI Resume",
    description: "Machine intelligence and applied research.",
    type: "Resume",
    file: "/documents/Saksham_Mishra_ML_Resume.pdf",
    downloadName: "Saksham-Kumar-Mishra-Machine-Learning-Resume.pdf",
  },
  {
    id: "quantitative",
    title: "Quantitative Research Resume",
    description: "Quantitative research and performance-oriented computing.",
    type: "Resume",
    file: "/documents/Saksham_Mishra_Quant_Resume.pdf",
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
  about: Photograph | null;
  poetry: Photograph | null;
  reflections: Photograph | null;
  engineering: Photograph | null;
  lifestyle: Photograph | null;
} = {
  portrait: {
    src: "/images/formal-headshot.webp",
    alt: "Saksham Mishra in a grey suit and tie",
    width: 978,
    height: 1280,
    objectPosition: "50% 35%",
  },
  about: {
    src: "/images/outdoor-black-sweater.webp",
    alt: "Saksham Mishra smiling outdoors in a black sweater in warm sunlight",
    width: 832,
    height: 1280,
    objectPosition: "50% 45%",
  },
  poetry: {
    src: "/images/poetry-portrait.webp",
    alt: "Saksham Mishra in an orange and navy jacket, resting his chin on his hand",
    width: 798,
    height: 1280,
    objectPosition: "50% 45%",
  },
  reflections: {
    src: "/images/reflections-portrait.webp",
    alt: "Saksham Mishra resting on crossed arms against a dark background",
    width: 1280,
    height: 1125,
    objectPosition: "60% 50%",
  },
  engineering: {
    src: "/images/engineering-portrait.webp",
    alt: "Saksham Mishra taking a mirror photograph in a green T-shirt",
    width: 1080,
    height: 1151,
    objectPosition: "50% 40%",
  },
  lifestyle: null,
};
export const writingCovers = [
  { category: "Poetry", photo: photographs.poetry },
  { category: "Personal Reflections", photo: photographs.reflections },
  { category: "Research Notes", photo: photographs.about },
  { category: "Engineering", photo: photographs.engineering },
];
