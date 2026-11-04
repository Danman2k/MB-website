# Mindfully Blind — www.mindfullyblind.com

The official website for Mindfully Blind: an alternative band (funk, punk, pop, rock) of three
siblings, an in-law, and a childhood best friend.

It's a plain static site — HTML, CSS and a little JavaScript, no build step.

## Deploying

Every push to `main` publishes the site to **www.mindfullyblind.com** through GitHub Pages
(`.github/workflows/static.yml`). The `CNAME` file holds the custom domain — don't delete it.
Preview locally before pushing.

## Preview locally

```bash
npm run preview
```

Then open http://localhost:4173. (This just runs `python3 -m http.server 4173`.)

## Updating content

Most day-to-day changes happen in **`site-data.js`**, not the HTML:

| What | Where in `site-data.js` |
| --- | --- |
| Upcoming shows (with ticket links) | `upcomingShows` — there's an example line above it |
| Past shows | `pastShowsByYear` |
| Albums / releases | `music` — the first one is featured; add `isNew: true` for a "New" tag |
| Social links | `links` |
| Featured YouTube video | `featuredVideo` |

Band bios and the About text live in `index.html`.

## Design

**`DESIGN.md`** is the design system: colors, fonts, spacing, components, and do's and don'ts.
Read it before changing how anything looks, and update it when you add a new pattern. AI coding
agents (Claude Code etc.) are told to follow it.

## Files

```
index.html            The whole site (one page with sections)
videos.html           Standalone page for the "Distraction" video
about.html, contact.html, join.html, music.html, shows.html
                      Old page URLs — they redirect to sections of index.html
styles.css            All styles (tokens at the top mirror DESIGN.md)
script.js             Renders shows, music, links and video from site-data.js
site-data.js          Content: shows, music, links, video
DESIGN.md             Design system
*.webp                Photos and album art
og-image.jpg          1200×630 image used when the site is shared on social media
background.png        Band photo used in search-engine structured data
sitemap.xml, robots.txt
```
