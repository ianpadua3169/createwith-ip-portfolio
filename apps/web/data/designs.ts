/**
 * Web graphic designs shown on `/designs` and teased on the home page.
 *
 * To add a new design:
 *   1. Drop the cover image into `apps/web/public/designs/<slug>.png`
 *      (PNG, JPG, SVG, or WebP are all fine; 16:10 or 4:3 covers look best).
 *   2. Add a new entry below with `image: "/designs/<slug>.png"`.
 *   3. Optional: add more detail images to `gallery`.
 *
 * Entries without an `image` file render a CSS gradient placeholder so the
 * layout stays intact while you collect assets.
 */

export type Design = {
  slug: string
  title: string
  summary: string
  image?: string
  /** Tailwind classes for the placeholder gradient shown when `image` is missing. */
  placeholder?: string
  gallery?: string[]
  tools?: string[]
  tags?: string[]
  url?: string
  completedAt?: string
}

export const designs: Design[] = [
  {
    slug: 'terminal-portfolio',
    title: 'Terminal Portfolio System',
    summary:
      'Neon-green terminal aesthetic with animated marquee logo, command palette, hybrid hero, and retro game easter eggs — the site you are on.',
    placeholder: 'bg-[linear-gradient(135deg,#00FF41_0%,#00D9FF_55%,#9D4EDD_100%)]',
    tools: ['Figma', 'Nuxt 3', 'Tailwind CSS', 'Lucide Icons'],
    tags: ['UI Design', 'Design System', 'Developer Branding'],
    url: 'https://createwith-ip.com',
    completedAt: '2026-02-01'
  },
  {
    slug: 'jamstack-blog-cover',
    title: 'Sanity JAMstack Blog — Cover System',
    summary:
      'Composable cover artwork and typography treatment for the Nuxt + Sanity headless blog. Gradient-on-dark with mono-font accents to match the editorial feel.',
    placeholder: 'bg-[linear-gradient(135deg,#0A0E27_0%,#1a1340_40%,#9D4EDD_100%)]',
    tools: ['Figma', 'Illustrator', 'Sanity Studio'],
    tags: ['Editorial', 'Cover Art', 'Web'],
    url: 'https://nuxtsanityfrontend.vercel.app/',
    completedAt: '2025-11-12'
  },
  {
    slug: 'bir-zonal-dashboard',
    title: 'BIR Zonal Value Dashboard — UI Concept',
    summary:
      'Enterprise-grade dashboard concept for Philippine BIR zonal value lookup: dense data tables, filter chips, breadcrumbs, and an admin-friendly dark mode.',
    placeholder: 'bg-[linear-gradient(135deg,#0A0E27_0%,#0f2233_50%,#00D9FF_100%)]',
    tools: ['Figma', 'Auto Layout', 'WordPress (Gutenberg)'],
    tags: ['Dashboard', 'Enterprise', 'Data UI'],
    completedAt: '2025-08-04'
  }
]
