# Design covers

Drop cover images for each entry in `apps/web/data/designs.ts` into this folder.

- Recommended aspect: **16:10** or **4:3**
- Formats: `png`, `jpg`, `webp`, `svg`
- Suggested width: 1600px (keeps things crisp on retina displays)
- Name the file after the entry's `slug`, e.g.:
  - `terminal-portfolio.png`
  - `jamstack-blog-cover.jpg`

Entries without a matching file fall back to a CSS gradient placeholder so
the grid never looks broken.
