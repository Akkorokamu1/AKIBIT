# Akibit — kintsugi × gaming redesign

This updates the existing freelance web/app design portfolio and the published akibit.netlify.app site; it does not create a game or change its business purpose. The user has explicitly chosen the new brand and visual direction. Preserve the concept filters/dialogs, services, local-business positioning, zero-to-launch process, Netlify Forms transport and separate Manus Preview database transport. Retain the review-version privacy warning and noindex safeguards.

## Design

**Movement:** contemporary Japanese editorial minimalism in light mode; a Japanese-inspired arcade/cyber interface in optional dark mode. This is an aesthetic influence, not a claim of Japanese business origin or authenticity.

**Principles:** purposeful negative space; restrained but visible gold repair seams; strong accessible typography; one consistent conversion journey beneath two genuinely different visual identities.

**Color philosophy:** light mode combines warm washi-like ivory, near-black ink, muted stone and metallic gold, with restrained vermilion. Dark mode becomes deep obsidian with brighter gold, electric cyan and violet accents. Gold connects both identities; readable dark/light text remains independent from decorative metallic effects.

**Layout:** a spacious asymmetric editorial hero and calm numbered sections in light mode. Dark mode shifts the hero to an angular mission-screen composition, technical display typography, luminous borders, panel surfaces, scanline/grid accents and stronger project-card framing—not only inverted colors. Keep mobile layouts in normal flow and all decorative layers noninteractive.

**Signature elements:** a fractured-A Akibit mark; organic gold seam decoration; bilingual accents such as アキビット (Akibit) and 金継ぎ (kintsugi), marked with lang=ja and paired with clear English context.

**Interaction:** a clearly labeled keyboard-operable header switch between “Studio” and “Arcade” modes. Light is the initial default; the visitor’s explicit choice persists when browser storage is available. Apply the stored theme before first paint while rendering identical React hydration markup. Avoid accounts, tracking or consent popups for the local UI preference.

**Motion:** subtle hover lifts in studio mode; restrained border glow and focus emphasis in arcade mode. No flashing, rapid glitch effects, audio, cursor hijacking or required animation. Honor reduced-motion preferences and keep all content usable without motion.

**Typography:** reuse self-hosted DM Sans and Instrument Serif for the studio edition; pair self-hosted Space Grotesk display and a monospace technical treatment for arcade mode. Body text stays comfortably readable; English remains the primary language. Japanese accents use appropriate system CJK fallbacks.

**Brand essence:** Akibit designs and builds thoughtful digital experiences for businesses ready for their next chapter. Refined, inventive, precise.

**Voice:** direct, craft-conscious and commercial without invented performance claims. Example lines: “Your next chapter. Crafted with intent.” and “A better digital experience. Built for your next level.”

**Wordmark:** lowercase akibit with custom tracking, a small gold point and an angular fractured-A mark. The dark edition changes the mark’s framing and display lettering, not the brand name.

**Signature color:** kintsugi gold, used decoratively and for strong-on-dark highlights; use darker gold/ink where text contrast requires it.

## Implementation and structure

`client/src/contexts/ThemeContext.tsx` owns SSR-safe theme state, DOM updates and guarded preference persistence. `client/src/components/ThemeToggle.tsx` provides the accessible switch. `client/src/components/AkibitHero.tsx` owns the new art-directed hero and decorative seam component. `client/src/pages/Home.tsx` keeps the portfolio sections, navigation and contact integration. `client/src/index.css` retains existing base/component layouts; a dedicated `client/src/styles/akibit.css` defines the brand and both complete themes. `client/public/` holds the favicon, self-hosted fonts and only finished portable assets. `client/index.html` owns the small first-paint theme script and brand metadata. `server/page.ts`, route titles and policy/404 text are rebranded. `scripts/build-netlify.mjs` continues pre-rendering meaningful public pages and generating the matching Netlify Forms skeleton; no protected credentials are migrated.

Original hero visuals are requested as a paired light/dark batch and are used only if final delivery is available. Pending generator placeholders are not a dependency for finishing the interface and will not be deployed. When available, completed image files are copied into the project for the external Netlify host; existing unfinished concept photography remains excluded.
