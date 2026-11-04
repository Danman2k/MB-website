---
name: "Mindfully Blind"
description: "Official site for Mindfully Blind — an alternative band (funk, punk, pop, rock) of three siblings, an in-law, and a childhood best friend, playing Chicago, Indianapolis and Bloomington. Listen, see shows, book us, join the family."
colors:
  stage: "#000000"        # true black — the hero photo's fisheye vignette sits on #000, so the page must match it exactly
  night: "#0B0A0C"        # raised dark surface for panels/rows (barely off-black, warm)
  bone: "#F4EFE8"         # primary text on dark — warm off-white, not pure #FFF
  haze: "#A49C94"         # secondary text, dates, captions, rules
  glow: "#E83CF0"         # PRIMARY ACCENT, the magenta light in the member photos — CTAs, active nav, links (black text on it)
  violet: "#8A1FD6"       # deeper violet from the same photos — hover/pressed fills (bone text on it), "tonight"/"sold out"/"new" tags
  dusk: "#B9C6D6"         # cool blue-grey from "The Wanderer" sky — quiet sections, music page, focus ring
typography:
  display:
    fontFamily: "Syne, 'Arial Black', sans-serif"
    fontWeight: 800
    fontSize: "clamp(2.75rem, 9vw, 7rem)"
    lineHeight: 0.92
    letterSpacing: "-0.01em"
    textTransform: "uppercase"
  heading:
    fontFamily: "Syne, sans-serif"
    fontWeight: 700
    fontSize: "clamp(1.75rem, 4vw, 3rem)"
    lineHeight: 1.0
    textTransform: "uppercase"
  body:
    fontFamily: "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"
    fontWeight: 400
    fontSize: "1.0625rem"
    lineHeight: 1.6
  label:
    fontFamily: "'Space Grotesk', sans-serif"
    fontWeight: 500
    fontSize: "0.8125rem"
    letterSpacing: "0.14em"
    textTransform: "uppercase"
rounded:
  none: "0"
  sm: "4px"              # inputs, small chips
  button: "0"            # buttons are square-cornered, never pills/ovals
  photo: "20px"          # member photos: 4:5 rounded rectangles
spacing:
  unit: "8px"
  scale: [4, 8, 16, 24, 40, 64, 104, 160]
  gutter: "16px"         # minimum side padding on phones
  sidePad: "clamp(16px, 12vw - 70px, 140px)"  # section side padding: 16px on phones, ~85px at 1280px, ~120px on wide screens
  maxWidth: "1320px"
  navHeight: "4.5rem"
components:
  button-primary:
    background: "{colors.glow}"
    color: "{colors.stage}"
    rounded: "{rounded.button}"
    typography: "{typography.label}"
  button-secondary:
    background: "transparent"
    border: "1px solid {colors.bone}"
    color: "{colors.bone}"
    rounded: "{rounded.button}"
  show-row:
    background: "{colors.night}"
    borderBottom: "1px solid rgba(244, 239, 232, 0.12)"
  focus-ring:
    outline: "2px solid {colors.dusk}"
    outlineOffset: "3px"
---

# Mindfully Blind — Design System

## Overview
The site should feel like **walking into a basement show with your friends — loud, warm, a little
chaotic, and everyone's family.** Two reference points come straight from the band's own art:

1. **The hero photo:** five faces in a fisheye circle on pitch black, with a rainbow light-leak
   on the edge. Intimate, playful, slightly psychedelic.
2. **The member photos:** each person lit in saturated pink-purple light against a concrete
   wall, with a rainbow halo. Moody, psychedelic, a little nightclub.
3. **"Waste Your Time, Beg For More":** sprinting down a street at golden hour. Energy and
   motion. Its orange is the album's color, not the site's.

Dark stage, warm skin tones, and one hot pink-purple accent. Big uppercase Syne headlines do the
shouting; Space Grotesk does the talking. The tagline is **"Welcome to the family"** and every
page should live up to it: personal, inviting, never corporate.

The site has three jobs, in this order:
1. **Get a fan to a show.** Next date, venue and ticket link, visible on a phone without scrolling.
2. **Get a new listener to press play** on Spotify/Bandcamp within one tap.
3. **Give a booker credibility fast.** Show history (40+ shows since 2021 across IN/IL) and a
   booking email.

## Colors
- The base is `{colors.stage}`. Pure black is intentional here (it's the one exception to the
  "no pure black" rule) because the hero image's vignette is #000 and any other value shows a seam.
- Text is `{colors.bone}`, not pure white. Secondary text is `{colors.haze}`. Stop stacking a
  dozen different `rgba(255,255,255,.7x)` values; use those two tokens.
- `{colors.glow}` is the only color that means "tap this." Use it for primary CTAs, the active
  nav item, and inline links. Keep it under ~10% of any screen.
- `{colors.violet}` handles hover/pressed fills and urgent tags ("TONIGHT", "SOLD OUT", "NEW").
  Never use violet for text on black; it fails contrast. Link hover goes to `{colors.bone}`.
- `{colors.dusk}` sets a quieter mood (music section backgrounds, the focus ring). It nods to
  *The Wanderer*.
- The brand flourish is a **purple-to-pink light-leak**: a thin line fading from deep purple
  (#4A0F8F) through `{colors.violet}` to `{colors.glow}`, the colors of the light in the member
  photos, with a soft pink glow beneath it. Use it at most once per page (currently the top edge
  of the newsletter block). It is never a button or text fill. No rainbow.
- Define everything as CSS custom properties on `:root`. Never hardcode a hex in a component rule.

## Typography
- `{typography.display}` is for the band name and the hero line only. It should feel as heavy
  and loud as the album logotype.
- Section titles ("SHOWS", "MUSIC", "THE FAMILY") use `{typography.heading}`, always uppercase.
- `{typography.label}` is for dates, cities, nav and button text, like a ticket stub.
- Body copy is sentence case, ≤ 68 characters per line, and written in the band's voice (see Voice).
- Fonts load from Google Fonts with `display=swap`. Only Syne 700/800 and Space Grotesk 400/500
  are needed; drop unused weights.

## Layout
- **Mobile first.** Most traffic comes from Instagram/TikTok bios. Design at 375px, then 768px,
  then 1280px.
- Single-page scroll with anchored sections is the right call. Keep it.
- **Home section order:**
  1. **Hero:** fisheye photo, "Welcome to the family", and two CTAs: *Listen* (primary) and
     *Next show* (secondary). If there's an upcoming show, the date and venue go under the CTAs.
  2. **Shows:** upcoming first, then a collapsed "Where we've played" archive.
  3. **Music:** latest release large, older releases smaller, plus the "song for every mood" copy.
  4. **Watch:** the featured video (*Distraction*). This is currently commented out; bring it back.
  5. **The Family (About):** band blurb, then members.
  6. **Booking / Contact.**
  7. **Join the family (Newsletter).**
- Break the grid once per section with an oversized headline, a rotated sticker-style tag,
  or a photo bleeding off the edge. That's the punk side; don't make everything centered and tidy.
- Vertical rhythm comes from the spacing scale: 64–104px between sections on mobile,
  104–160px on desktop.

## Components
- **Nav:** a fixed bar that hides on scroll-down and returns on scroll-up (current behavior, keep
  it). Band name in Syne on the left. On mobile, a hamburger opens a full-screen overlay with big
  Syne links. The active section gets a `{colors.glow}` underline, not just an opacity change.
- **Hero Listen button:** opens *Waste Your Time, Beg For More* on Spotify in a new tab.
- **Hero CTA buttons:** square-cornered. The primary is filled glow with black text, the secondary is
  outlined in bone. Social icons sit in a quieter row below the CTAs, so they don't compete with them.
- **Show rows:** rows, not cards. Columns: `DATE` (label style) | venue + city | ticket button
  (or "Free / 21+" text). On mobile the row stacks to date, then venue, then a full-width button.
  - The past-shows archive is grouped by year in `<details>` accordions, with the newest year open.
  - No show-count headline ("42 shows since 2021"). The band decided against it; the list speaks for itself.
  - **Empty state:** never just "No upcoming shows." Say *"No dates on the calendar yet. Join the
    family to hear first →"* and link it to the newsletter.
- **Music cards:** square album art, title in Syne, then platform buttons for Spotify, Bandcamp,
  Apple Music and YouTube. Use real links, and only show platforms that exist. The latest release
  gets a "NEW" tag in `{colors.violet}`. Hover: the art lifts slightly (scale 1.02) and the shadow
  warms toward glow.
- **Member rows:** 4:5 rounded-rectangle photos (`{rounded.photo}`) that show each person and
  their instrument. Name in Syne, role
  as a label ("LEAD GUITAR · AUDIO ENGINEER"), then the bio. Rows alternate sides on desktop and
  stack on mobile with the photo first.
- **Video:** use a lite YouTube embed (thumbnail + play button, loading the iframe on click) to
  keep the page fast. Keep the 16:9 ratio and no autoplay.
- **Booking:**
  - `booking@mindfullyblind.com` as a big tappable link.
  - Below it, a "Follow along" list of social links.
  - No press assets section (no photo downloads, EPK or tech rider buttons). The band removed it.
- **Newsletter:** headline "Join the family." One email field and a glow button. Keep the
  current email-provider embed, but restyle it to these tokens. No popups and no second signup form.
- **Footer:** social icons, Bandcamp (currently missing from `site-data.js` links even though it's
  in the schema), © year, and a "Back to top" link.

## Motion
- Energetic but short: sections fade and slide up 16px on enter (250–300ms, ease-out, staggered
  40ms for list items).
- Optional: a slow rotation (≈60s per turn) or a slight fisheye "breathing" scale on the hero
  photo. Subtle. Turn it off for reduced motion.
- Respect `prefers-reduced-motion: reduce`: disable all non-essential motion and scroll-snap.
- Nothing plays audio or video on its own. Ever.

## Voice
Warm, funny, a little self-aware, family-first. The current About and Music copy nails it
("collective little brother," "those luscious locks," "a song for every mood"); match that tone
in any new copy. Use real names, real venues and real songs (*Wreck*, *Distraction*,
*Dotted Line*). Never write marketing filler like "Elevate your experience" or "Unleash the sound."

## Do's
- Use the band's real photography and album art. No stock, and no AI-generated people.
- Put the next show and a play button above the fold on mobile.
- Keep `site-data.js` as the single source of truth for shows, music, links and video. Edit data
  there, not in HTML.
- Keep and extend the schema.org JSON-LD: add a `MusicEvent` for each upcoming show so dates show
  up in Google.
- Make a dedicated 1200×630 Open Graph image (band name and photo). The current portrait
  `background.png` crops badly in link previews.
- Serve images as WebP/AVIF with explicit width/height. Lazy-load everything below the hero.
- Tap targets ≥ 44px, text contrast ≥ WCAG AA, visible `{components.focus-ring}` on everything.

## Don'ts
- **No generic AI-site defaults:** no Inter/Roboto, no purple-blue gradients, no glassmorphism
  cards, no three-card "features" grid, no emoji as icons, no lorem ipsum.
- Don't overuse `backdrop-filter` blur. It's used on the nav only. Never put text in a boxed or
  frosted panel over a photo. For text over The Family photo, use a soft dark glow behind the
  letters (text-shadow) and a faint shadow pooled under the text. Keep photos bright: no heavy
  dark overlays.
- Don't use more than one accent per element. Glow and violet never sit side by side as fills.
- No carousels for shows or music, no splash page, no autoplaying media, no popups.
- Don't round everything. Corners are square, buttons included. The only exceptions are rounded rectangles (member photos)
  and small chips.
- Don't hide the booking email behind a form. It should always be one tap away.

## Agent workflow (Claude Code or any coding agent)
1. Read this whole file before any UI change. The YAML tokens are the source of truth. If
   `styles.css` disagrees, migrate the CSS toward the tokens; don't change the tokens to match the CSS.
2. Before building, state in one sentence which reference point (fisheye hero / pink-purple member photos / sunset album) the
   change leans on.
3. Preview locally with `npm run preview` → http://localhost:4173.
4. **Verify visually:** screenshot at 375px, 768px and 1280px, check against the Do's and Don'ts,
   fix anything off, and repeat. UI work isn't done until it's been seen at all three widths.
5. Run Lighthouse and aim for 90+ on Performance, Accessibility, Best Practices and SEO.
6. If you add a new pattern, document it in this file in the same change.
