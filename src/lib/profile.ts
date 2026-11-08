export const profile = {
  name: "Saksham Kumar Mishra",
  city: "Delhi, India",
  institution: "Thapar Institute of Engineering & Technology",
  email: "mishrasaksham080705@gmail.com",
  socials: {
    github: "https://github.com/Zylus08",
    linkedin: "https://www.linkedin.com/in/saksham-mishra-ml/",
    codeforces: "",
    leetcode: "https://leetcode.com/u/zylus08/",
    cses: "https://cses.fi/user/515838",
  } satisfies Record<SocialPlatform, string>,
  interests: [
    "Representation learning",
    "Computer vision",
    "Time-series modeling",
    "Efficient on-device ML",
    "Systems programming",
    "Low-latency engineering",
    "Quantitative research",
    "Autonomous agents",
  ],
  timeline: [
    {
      label: "Education",
      title: "Computer Engineering",
      description:
        "Undergraduate at Thapar Institute of Engineering & Technology, Patiala.",
    },
    {
      label: "Research interests",
      title: "Learning useful representations",
      description:
        "Exploring the intersection of machine intelligence, signals, and efficient computation.",
    },
    {
      label: "Engineering interests",
      title: "From ideas to systems",
      description:
        "Interested in the decisions that make software reliable, measurable, and efficient.",
    },
  ],
};
export type SocialPlatform =
  "github" | "linkedin" | "codeforces" | "leetcode" | "cses";
export const socialPlatforms: Record<
  SocialPlatform,
  { label: string; mark: string; hosts: string[] }
> = {
  github: { label: "GitHub", mark: "GH", hosts: ["github.com"] },
  linkedin: {
    label: "LinkedIn",
    mark: "in",
    hosts: ["linkedin.com", "www.linkedin.com"],
  },
  codeforces: { label: "Codeforces", mark: "CF", hosts: ["codeforces.com"] },
  leetcode: { label: "LeetCode", mark: "LC", hosts: ["leetcode.com"] },
  cses: { label: "CSES", mark: "CS", hosts: ["cses.fi"] },
};
export function configuredSocials(
  values: Record<SocialPlatform, string> = profile.socials,
) {
  return (Object.keys(socialPlatforms) as SocialPlatform[]).flatMap(
    (platform) => {
      const value = values[platform];
      if (!value) return [];
      const url = new URL(value);
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.port ||
        !socialPlatforms[platform].hosts.includes(url.hostname) ||
        url.pathname === "/"
      )
        throw new Error(`Invalid ${platform} profile URL`);
      return [{ platform, url: url.href, ...socialPlatforms[platform] }];
    },
  );
}
export const navigation = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
];
export const origin = "https://sakshamkumarmishra.cv";
