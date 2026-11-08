# Design system

The design pairs a charcoal technical canvas with warm editorial typography. Instrument Serif supplies the expressive italic voice; Space Grotesk carries interface and narrative; JetBrains Mono identifies annotations. Devanagari uses the platform serif fallback for the short Delhi signature.

Tokens live in `src/app/globals.css`: dark canvas #101114, surface #191B20, text #F1EEE8, secondary #A4A6AF, copper #CF9874, and a lighter technical ink for legibility. Light mode uses warm paper #F3F0E9 and darker copper #925936. Borders, rather than shadows, establish structure.

Fluid display sizes use clamp. Layout is centered at 1440px, with 7% desktop gutters and 6% mobile gutters. Mobile layouts become single-column below 700px; intermediate adaptations occur at 1000px. Primary targets are at least 40–44px, visible focus uses copper, and a skip link leads to main.

The six acts progress through introduction, researcher, engineer, journey, personal world, and invitation. The first act uses an interactive mathematical line field. Research uses journal rows; engineering uses larger alternating artwork/copy regions. Original CSS architectural arches evoke Delhi without licensed photography or film imagery. The hidden personal note is a keyboard-operable disclosure.

Motion: brief entry reveal, section translation, directional hover cues, and a small menu fade. GSAP is loaded only on the homepage when reduced motion is not requested. The reduced-motion media query disables CSS animation, transitions, and smooth scrolling. There is no pinned section or loading screen.

## Reference study

All three supplied sites were inspected in Chrome at 1440 by 1000 and 390 by 844. Initial web-reader limitations were resolved by browser inspection. Snapshots and measured typography/background values are in the ignored artifacts folder. No reference showed horizontal overflow at these widths.

- https://mankiratsingh.com/ uses an almost-black diagonal patterned canvas and a sparse, centrally positioned introduction. The captured entrance remained very dark, even with reduced motion requested; this limits conclusions about the settled design and motion. SKM keeps its text visible throughout reveals.
- https://abhinavkumarsingh.tech/ uses a cyan/blue terminal language, grid background, bold sans-serif hero, monospace annotations, dense technical sections, and command navigation. Desktop has a two-column hero with an editor panel; mobile collapses the copy and actions and introduces a bottom icon bar. SKM borrows the principle of discoverable technical depth, with quieter editorial hierarchy and five labeled tabs.
- https://portfolio-vennictus.vercel.app/projects uses Space Grotesk, a compact pill navigation, a serif supporting line, generous heading space, and a vertically organized project list with descriptions, language annotations, and expandable affordances. Mobile preserves the list with narrower gutters and wrapped copy. SKM adopts readable project summaries and strong type contrast; its original signal visual is bounded and purposeful rather than a full-page particle field.

The study covers rendered layouts and responsive structure, not a comprehensive audit of reference animations or all interactions. No source, branded visual identity, or licensed media was copied.
