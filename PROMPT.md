# Prompt for Coding LLM

Copy and paste the following into your coding LLM:

---

```
You are migrating the Squarespace photoblog https://nycnerd.com into a Hugo static site. This repository is currently empty — you need to scaffold the entire Hugo project from scratch.

## Source Site

nycnerd.com is a Squarespace 7 photoblog with:
- A full-screen slideshow gallery homepage (27 photos, newest first)
- An About page (`/about`)
- A Contact page (`/contact`)
- Minimalist design: dark slate gray background (`#50535e`), centered layout, Raleway font

## Critical Requirements

1. **Download all images at largest resolution.** The Squarespace CDN URLs serve full-resolution originals. Download every image to `static/images/` with clean filenames (e.g., `jersey-city-2018.jpg`). The site must be fully self-contained — no external image dependencies after migration.

2. **The gallery must use local images** — every `<img>` tag must reference a file in `static/images/`, not a remote CDN URL.

3. **Images are NOT full-bleed.** Photos have visible space around them — use `max-width: 90%, max-height: 85vh` with `object-fit: contain`. Do NOT stretch to fill the viewport.

4. **The entire bottom bar (logo + nav + controls) is fixed at the bottom of the page.** Layout: logo on left, nav links left-aligned next to it, controls on the right. All in one horizontal row. Height: 44px. Background: `#6e717f`. Has `border-top: 1px solid #000`.

5. **Body background color is `#50535e`** (dark slate gray), NOT pure black. The bottom bar is `#6e717f` (lighter gray).

6. **Gallery controls are on the right side of the bottom bar.** The grid icon is **4 small squares** (2x2 grid pattern) with a **tall vertical black line (64px, 80% of navbar height)** to its left — use a `::before` pseudo-element for this, not `border-left` on the button itself. The close button (X icon) has the same separator.

7. **Grid open/close animation.** Clicking the 4-square grid button:
   - The entire bottom bar **animates from bottom to top** AND the grid **slides up from below the viewport** (`transform: translateY(100%) → translateY(0)`) **simultaneously** over 1s — grid appears attached to the bottom of the navbar
   - On close: grid slides down AND navbar drops **simultaneously** over 1s, then grid display is removed
   - The 4-square icon **hides**, and an **X icon appears** in its place
   - The thumbnail grid overlay fills the area below the now-top navbar
   - Clicking the X icon reverses: navbar animates back to bottom, 4-square reappears, X hides

9. **Navigation arrows AND photo title/date overlay share the same hover behavior.** Both visible on hover over gallery area, both **dim to opacity 0.5 when not hovered**, both get full opacity on direct hover. Both **completely hidden** (opacity 0) when mouse leaves gallery or viewport. Transition: 0.15s. Controlled by shared `showUI`/`hideUI` functions.

10. **Repeatedly compare against the source site.** After every major change, fetch `https://nycnerd.com` and compare the structure, layout, and content. If anything differs, fix it before moving on.

11. **No features the source doesn't have.** This is a 1:1 migration. No tags, no categories, no comments, no search, no analytics, no social media integration.
12. **Create Dockerfile and GitHub Action.** For containerized deployment: multi-stage `Dockerfile` (Hugo build → nginx serve) and `.github/workflows/docker-image.yml` (build & push to ghcr.io on push to main). See SPEC.md for exact file contents.

## Complete Photo Data

27 photos total. Here is the data — use this exact data:

| # | Title | Date | Image URL | Dimensions |
|---|-------|------|-----------|-----------|
| 1 | Jersey City | January 3, 2018 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1515305265722-HXOUR17TNIW9KKDCSIRS/20180103-20180103-DSC_4974.jpg | 2500x1669 |
| 2 | Jersey City | August 12, 2015 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1439425459975-9R83PYBWBACH1TIZ4NHH/image-asset.jpeg | 2500x1777 |
| 3 | Jersey City | June 15, 2015 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1434434226406-KUQUL3I6STU7DBN6X98O/image-asset.jpeg | 2500x1668 |
| 4 | Jersey City | Sept 16, 2014 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1411082502816-YLG15C4FUZX704RX0Y6V/image-asset.jpeg | 2500x1875 |
| 5 | Black Cat | Jan 9, 2014 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396167981934-U07PJJ6JY517VG7JZ33E/DSC_0997.jpg | 1500x1001 |
| 6 | Midtown | May 24, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396168385693-QSM6XENCF9PKFJ10KEF3/DSC_0477.jpg | 1500x1464 |
| 7 | Eve of Sandy | Oct 29, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396498112880-30T0LXLCRLQ3NDEUW2JW/20121029-IMG_0262.jpg | 1498x1500 |
| 8 | Midtown | June 15, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497952670-KKLY392S6LFLRNP79M6A/20120615-IMG_0200.jpg | 1500x1125 |
| 9 | Jersey City | May 25, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497867202-GCGYE49KIKLQ4NRZK4GA/IMG_0191.jpg | 1500x1125 |
| 10 | Midtown | May 14, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497807399-F88D0TCH6CEGK8GTN7H0/IMG_0185.jpg | 1500x1070 |
| 11 | Midtown | May 6, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497707017-JZIKX7EQ0OUOSS2WK6IZ/_DSC4617.jpg | 1500x996 |
| 12 | Midtown | April 27, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497632401-ZZ9VDLBVJJSW717H053B/IMG_0179.jpg | 1500x1125 |
| 13 | BBQ | April 25, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497535059-840MHCOY3LYD3TDGUGH6/_DSC4560.jpg | 1500x996 |
| 14 | Midtown | March 23, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497407890-RM99B0ESHOJDU84EORLA/IMG_0174.jpg | 1500x1500 |
| 15 | Midtown | March 18, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396495761850-OS56W4ENM7R3Y72PAH45/_DSC4444.jpg | 1500x996 |
| 16 | Lincoln Center | March 11, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396483017790-P450ODEQ3SH8LZH1OFQO/IMG_0168.jpg | 1500x1125 |
| 17 | West Village | March 6, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396482952844-6UW1C9IYJRT78PMJ3HFJ/IMG_0166.jpg | 1500x1035 |
| 18 | West Village | March 6, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396482816798-1J7H7116XFB7X7VFTUWI/IMG_0160.jpg | 1125x1500 |
| 19 | Hells Kitchen | March 5, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396482590609-XDTJ12OP9OOA9WSKOD5Y/_DSC4406.jpg | 1500x887 |
| 20 | Eataly | March 3, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396482501294-PTC9ESF7UXJLUIX65CMD/IMG_0148.jpg | 1500x1125 |
| 21 | Sapporo | Feb 29, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396417086890-74M5FN0641270O1HIG40/IMG_0139.jpg | 1500x1125 |
| 22 | Hells Kitchen | Feb 28, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396416677784-277J3U1MZ3T22MIBRYP1/IMG_0137.jpg | 1500x1143 |
| 23 | ACE Hotel | Feb 26, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396416544714-LX8UAITF5GCJ9VSVXRDA/IMG_0126.jpg | 1500x1125 |
| 24 | Despaña | Jan 2, 2012 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396417287814-A43W06OTOKW0EVCI0XUY/_DSC4255.jpg | 1500x996 |
| 25 | Midtown | Dec 27, 2009 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1440884108265-MLYEPS64A4HBD0SKCIB8/image-asset.jpeg | 2500x1800 |
| 26 | Moma | Jul 5, 2009 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1440884169044-9FT1Q7DYQEHRRWQMMZN3/image-asset.jpeg | 2500x1661 |
| 27 | West Village | June 13, 2009 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1440884201001-1FXREP5L82LW5U72K87B/image-asset.jpeg | 2500x1762 |

## Page Content

### About page (`/about/`)
- Heading: `A SCRAPBOOK OF A CITY ENTHUSIAST`
- Body paragraph: `This is an effort to collect the things in NYC that make me happy or at least point out to visitors when I'm acting as tour guide. Sprinkle in some eclectic taste from an aspiring amateur photographer`
- Image: `https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396170337110-AENORAHNT4OS9AKB9FCG/toesocks.jpg`

### Contact page (`/contact/`)
- Minimal — just page title "Contact". No form needed.

## Design Spec

- **Font**: Raleway from Google Fonts (weights 100, 200, 300, 700)
- **Background**: Body `#50535e` (dark slate gray), bottom bar `#6e717f` (lighter gray), white/light text
- **Bottom bar**: Entire header bar (logo + nav + controls) **fixed at bottom of page**, one horizontal row, height 80px. Has `border-top: 1px solid #000`.
- **Logo font**: "NYCNERD" in `font-size: 22px`, weight 200, letter-spacing 4px, uppercase
- **Logo**: "NYCNERD" text logo on the **left** of the bottom bar
- **Navigation**: **Left-aligned** next to the logo, NOT centered. Links: Photoblog, About, Contact. Active link white, inactive gray.
- **Gallery controls (grid icon)**: On the **right** side of the bottom bar. Icon is **4 small squares** (2x2 grid pattern). Has a **tall vertical black line (64px / 80% of navbar height)** to its left, implemented via `::before` pseudo-element. Close button (X) shares the same separator style.
- **Grid open animation**: Navbar moves bottom→top AND grid slides up from below viewport (`transform: translateY(100%) → translateY(0)`) **simultaneously** over 1s — grid appears attached to bottom of navbar. 4-square icon disappears, X icon appears.
- **Grid close animation**: Grid slides down AND navbar drops **simultaneously** over 1s, then grid display removed.
- **Arrow & title overlay behavior**: Navigation arrows AND photo title/date overlay appear on hover over gallery area. Both **dim to opacity 0.5 when not hovered**, full opacity on direct hover. Both **hidden** (opacity 0) on gallery `mouseleave` and `document mouseleave`. No timed fadeout. Transition: 0.15s. Controlled by shared `showUI`/`hideUI` functions.
- **Homepage gallery**: Full-viewport-height slideshow. Each slide:
  - Image centered between viewport top and navbar top. `.slide` has `padding-bottom: 80px` so flex centering (100vh - 80px) works within the visible area above the navbar.
  - Image constrained with `max-width: 90%, max-height: 85vh`, `object-fit: contain`
  - Title overlaid at bottom with semi-transparent `rgba(0,0,0,0.5)` background
  - Date below title
  - **Navigation arrows only visible on hover** over gallery area, fade out after 2s
  - Squarespace "Center" gallery style — not full-bleed
- **Grid index view**: Full-screen overlay with thumbnail grid of all photos. Click a thumbnail to go to that photo.
- **Mobile** (`≤768px`): Bottom nav links (Photoblog, About, Contact) are hidden. Hamburger icon appears. Tapping hamburger opens a full-screen nav overlay; the icon **transforms to an X** — tapping it closes the menu. Implement via a `.is-close` class on `.ctrl-button.menu` that swaps the `::before` content from hamburger to X character (`\2715`).
- **Mobile nav overlay must not cover the navbar.** The `#mobile-navigation` should cover from `top: 0` to `bottom: 80px` (not `bottom: 0`) so the bottom navbar with "NYCNERD" and the hamburger/X stays visible.
- **Mobile menu must work on ALL pages.** The menu toggle code must be registered **before** the `if (totalSlides === 0) return;` guard in the gallery JS, otherwise about/contact pages will silently exit.
- **Hamburger to X toggle**: Use a separate `.icon-close-btn` element inside `<span class="ctrl-button menu">`. Toggle via `display: none`/`display: flex` using `is-close` class on the **parent span**. The click handler must be on the parent span (`.ctrl-button.menu`), not the hamburger `<a>`, so both hamburger and X are clickable. Give `.icon-close-btn::before` explicit `width: 20px; height: 20px; display: block; line-height: 20px` so the X character renders reliably.
- **Grid toggle on about/contact**: Keep `.ctrl-button.all` visible but link it (`href="/"`). The JS uses `e.preventDefault()` only when `totalSlides > 0`, so on about/contact it navigates to the photoblog instead of trying to open the grid.
- **No footer** — match the source (which has none).

## Execution Steps

1. Scaffold Hugo site (`hugo new site . --force`)
2. Create `static/images/` directory
3. Download all 27 images from Squarespace CDN to `static/images/` using `wget` or `curl`, renaming to clean local filenames
4. Each photo is a Hugo content page in `content/posts/` with frontmatter (title, date, image, width, height, slug, display_date). Create `archetypes/posts.md` so `hugo new content/posts/xxx.md` creates new photo posts.
5. The homepage URL stays at `/` — no `history.replaceState` or URL manipulation. Each photo is wrapped in `<a href="/posts/:slug/">` so clicking the photo navigates to its permalink.
6. Single post pages (`/posts/:slug/`) render the **full gallery slideshow** identical to the homepage — same constrained image sizing, navigation arrows, grid index, title overlays, bottom navbar. The gallery JS reads `window.location.pathname` and starts at the matching photo. No "Back to Gallery" link — the bottom navbar provides navigation. Gallery CSS loads on post pages via `{{ if or .IsHome (eq .Section "posts") }}`.
7. The homepage iterates `where .Site.RegularPages "Section" "posts"` using `$posts.ByDate.Reverse` — adding new posts automatically updates the gallery.
7. Choose or create a minimal theme (custom, no external theme dependencies)
8. Create layout files (baseof, homepage, single pages, partials)
9. Create content files (about as `content/about.md`, contact as `content/contact.md`, each photo as a Hugo page in `content/posts/`) — reference images by local path `/images/<filename>`. About/contact are single pages, not sections with subfolders.
10. Configure `hugo.toml` — disable unnecessary features
11. Create `Dockerfile` for multi-stage Hugo→nginx build
12. Create `.github/workflows/docker-image.yml` for CI/CD (builds on push to `main`, pushes to `ghcr.io`)
13. Run `hugo server` and verify:
   - Fetch https://nycnerd.com and compare visually — pixel match everything
   - Check all 27 photos render from local files
   - Check images are NOT full-bleed (visible space around them)
   - Check navigation bar is at the bottom of the page
   - Check grid icon button is in bottom-right corner
   - Check grid index view opens/closes correctly
   - Check navigation arrows only appear on hover and fade out
   - Check titles and dates match the source exactly
   - Check about and contact pages
   - Check mobile layout (hamburger menu, image sizing)
   - Disconnect internet and verify everything still loads
   - Check there are no build errors
   - Check individual photo URLs work: visit `/posts/black-cat/` and confirm the gallery opens to that photo
   - Check URL updates when navigating: click next/prev and watch the browser URL change

## Verification Loop

After each major implementation step:
1. Run `hugo server`
2. Fetch the source site again to compare
3. If anything differs from the source, fix it before proceeding
4. Do NOT declare completion until you've verified every checklist item

The key goal is: **when served locally, the site should look and function identically to the live Squarespace site.** Make multiple passes if needed.
```

---

## How to use

1. Read `SPEC.md` for full detailed specification
2. Paste the PROMPT above into your coding LLM
3. The LLM will scaffold the Hugo site in the current directory
4. After it finishes, run `hugo server` and compare against https://nycnerd.com
5. If anything is off, describe the issue and ask the LLM to fix it
6. Repeat until the site matches completely
