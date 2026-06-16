# SPEC: Migrate nycnerd.com from Squarespace to Hugo

## Overview

Migrate the existing Squarespace photoblog at https://nycnerd.com to a self-hosted Hugo static site in this repository. The site is a minimalist full-screen photo gallery with ~27 photos, an About page, and a Contact page.

---

## Source Site Analysis

### Platform
- Squarespace 7 (template ID: `50130f5be4b00a22f5c5a82a`, template "Aria")
- Single-page application-style gallery (collection type: `gallery`)
- All photos on one page; individual slides are SPA views, not separate pages

### Pages

#### 1. Homepage (Photoblog) — collection type `gallery`
Full-screen slideshow gallery. Each slide has:
- **Title**: Location name (e.g., "Jersey City", "Midtown", "Black Cat")
- **Date**: Displayed below the title (e.g., "January 3, 2018")
- **Image**: Full-resolution image hosted on Squarespace CDN
- **URL slug**: Some are date-based (e.g., `2018/1/7/jersey-city`), some are Squarespace random IDs
- 27 photos total, oldest to newest: June 13, 2009 → January 3, 2018

#### 2. About — `/about`
- Heading: "A SCRAPBOOK OF A CITY ENTHUSIAST"
- Body: "This is an effort to collect the things in NYC that make me happy or at least point out to visitors when I'm acting as tour guide. Sprinkle in some eclectic taste from an aspiring amateur photographer"
- Image: `toesocks.jpg` (from Squarespace CDN)

#### 3. Contact — `/contact`
- Empty page with contact form (no actual form fields shown; just page title "Contact")

### Design / Styling
| Property | Value |
|---|---|---|
| Font | Raleway (Google Fonts), weights 100, 200, 300, 700 |
| Site title | "NYCNERD" — text logo, not image |
| Tagline | "A Scrapbook of a City Enthusiast" |
| Navigation | **Entire bottom bar (logo + nav + controls) fixed at bottom of page** |
| Bottom bar layout | Logo **left**, nav links **left-aligned** next to logo, controls **right** — all in one horizontal row |
| Bottom bar background | `#6e717f` (medium gray, lighter than page background) |
| Bottom bar border | `border-top: 1px solid #000` (thin black line separating from content) |
| Bottom bar height | 80px (source uses 44px on `#header` but rendered taller) |
| Gallery style | Squarespace "Center" style — centered, contained, not full-bleed |
| Gallery transition | Fade, no auto-play |
| Gallery layout | Full-viewport slideshow with title+date overlay at bottom |
| Image display | **NOT full-bleed.** Centered vertically between viewport top and navbar top. `.slide` uses `padding-bottom: 80px` (navbar height) so flex centering works within the visible area. Image constrained with `max-width: 90%, max-height: 85vh`, `object-fit: contain`. |
| Navigation arrows & title overlay | Prev/next arrows AND photo title/date overlay share the same hover behavior: visible on hover over gallery area, **dim to opacity 0.5 when not hovered**, full opacity on direct hover. **Completely hidden** (opacity 0) when mouse leaves gallery or viewport. Transition: 0.15s. All toggled together via shared `showUI`/`hideUI` functions. |
| Gallery controls | Controls area is an **80px × 80px square** at the right end of the bottom bar (width equals navbar height). A **64px tall vertical black line** at the left edge of this square creates the separator. The grid icon (4 small squares) is **centered within this square** — equidistant from the vertical line and the right edge. On close/open, the X icon replaces the grid icon in the same centered position. |
| Grid open/close animation | **Simultaneous 1s animation.** Grid appears **attached to bottom of navbar** — both move in sync. Opening: navbar moves bottom→top AND grid slides up from below viewport (`transform: translateY(100%) → translateY(0)`) **at the same time** over 1s. Closing: grid slides down AND navbar drops **simultaneously** over 1s, then display removed. |
| Grid button toggle | When grid is open: 4-square icon hides, **X icon shows** in its place (still with vertical border). When grid closes: X hides, 4-square returns |
| Page alignment | Center |
| Color scheme | Body background `#50535e` (dark slate gray), bottom bar `#6e717f` (medium gray), light text |
| Social buttons | Enabled but no accounts configured |
| Mobile | Hamburger menu works on ALL pages (including about/contact). On mobile (`≤768px`): bottom nav links (Photoblog, About, Contact) are hidden; hamburger icon appears. Tapping hamburger opens a full-screen nav overlay (`#mobile-navigation`) that covers from `top: 0` to `bottom: 80px` (stops above the fixed navbar). The icon **transforms to an X** — uses a separate `.icon-close-btn` element toggled via `display: none`/`display: flex` with the `is-close` class on `.ctrl-button.menu`. The click handler is on the **parent span** (`.ctrl-button.menu`), not the hamburger `<a>`, so both hamburger and X work. The menu toggle logic runs **before** the gallery's `totalSlides === 0` guard. Grid toggle on about/contact pages links to `/` (navigates to photoblog). |

### Technical Details
- Font loading: Typekit + Google Fonts (Raleway)
- Image CDN: `images.squarespace-cdn.com`
- Only 27 photos → images can be served remotely from Squarespace CDN (no need to rehost)

### Build & Deploy
- **Dockerfile**: Multi-stage build using `alpine:latest`, installs Hugo, runs `hugo`, serves with `nginx:latest`
- **GitHub Action** (`.github/workflows/docker-image.yml`): Triggers on push to `main`, builds Docker image, pushes to `ghcr.io` with date-based tags and `latest` tag. Requires `GHCR_TOKEN` secret.

---

## Hugo Implementation Requirements

### Configuration
- `baseURL`: (to be set at deploy time)
- `title`: NYCNERD
- `theme`: needs to be custom or heavily customized
- `pagination`: not needed (single gallery page)
- `disableKinds`: disable RSS, taxonomy, sections (minimal site)
- `canonifyURLs`: true
- `preserveTaxonomyNames`: false

### Content Structure

```
content/
  _index.md              # Photoblog homepage — gallery layout
  about.md               # About page (single page, not a section)
  contact.md             # Contact page (single page, not a section)
  posts/
    _index.md            # Posts section index
    jersey-city-2018.md  # Individual photo posts (27 total)
    jersey-city-2015.md
    ...
```

Each post in `content/posts/` is a Hugo content page with frontmatter:
```yaml
---
title: "Jersey City"
date: 2018-01-03
image: "jersey-city-2018.jpg"   # filename in static/images/
width: 2500
height: 1669
slug: "jersey-city-2018"
display_date: "January 3, 2018"  # exact display string
---
```

To add a new photo: `hugo new content/posts/my-photo.md` (uses `archetypes/posts.md`).
The homepage gallery iterates over `where .Site.RegularPages "Section" "posts"` ordered by date descending.

### Build & Deploy Setup

Create two files for containerized deployment:

**`Dockerfile`** — multi-stage build:
```dockerfile
FROM alpine:latest AS builder
WORKDIR /hugo
RUN apk add --no-cache --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community git hugo && \
  git clone <REPO_URL> /hugo && \
  hugo
FROM nginx:latest AS runner
COPY --from=builder /hugo/public /usr/share/nginx/html
```

**`.github/workflows/docker-image.yml`** — CI/CD:
```yaml
name: build and push docker image
on:
  push:
    branches: ['main']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: login
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GHCR_TOKEN }}
    - name: build and push
      run: |
        GHREPO=ghcr.io/${{ github.repository }}
        TAG=$(date +%Y%m%d_%H%M)
        docker build . --no-cache --file Dockerfile --tag $GHREPO:$TAG
        docker tag $GHREPO:$TAG $GHREPO:latest
        docker push $GHREPO:$TAG
        docker push $GHREPO:latest
```

> **Note:** The `Dockerfile` clones the repo via `git clone` during build. Update the repo URL to match the actual repository. The GitHub Action requires a `GHCR_TOKEN` secret set in the repository settings.

### Image Handling
- **Download all images** at their largest available resolution from the Squarespace CDN
- Store images in `static/images/` with filenames matching the photo slugs (e.g., `jersey-city-2018.jpg`, `black-cat.jpg`)
- The Squarespace CDN serves full-resolution originals — use the URLs in the table below as download sources
- The site must be fully self-contained with no external image dependencies after migration
- Recommended download tool: `wget` or `curl` with the original CDN URL; rename to a clean local filename

### URL Structure
- Homepage `/` — full-screen gallery slideshow. URL stays at `/`. Shows newest photo first.
- `/about/` — about page  
- `/contact/` — contact page
- `/posts/:slug/` — individual photo permalinks (e.g., `/posts/jersey-city-2018/`, `/posts/black-cat/`)

### Single Post Pages
- Single post pages (`/posts/:slug/`) render the **full gallery slideshow** identical to the homepage — all 27 slides, navigation arrows, grid index, title overlays, bottom navbar
- The gallery JS reads `window.location.pathname` on load and starts at the matching photo
- Same constrained image sizing as the homepage (not full-size)
- No "Back to Gallery" link — the bottom navbar provides navigation back to `/`
- Gallery CSS is loaded on post pages via `{{ if or .IsHome (eq .Section "posts") }}`

### Photo Links
- On all gallery pages (homepage and single post), each photo is wrapped in `<a href="/posts/:slug/" class="slide-link">` — clicking the photo navigates to its individual permalink page
- No `history.replaceState` or URL manipulation — URL changes only via native link navigation
- Adding new posts to `content/posts/` automatically updates the gallery (it iterates `where .Site.RegularPages "Section" "posts"` by date descending)

### Required Pages/Sections

#### Homepage (`/`)
- Full-viewport centered slideshow gallery
- Photos ordered newest-first
- Each slide shows: image centered with space around it (max 90% width, 85vh height), location title overlaid at bottom with semi-transparent background, date below title
- **Navigation arrows only visible on hover** over gallery area; fade out after 2s of no mouse movement
- **Grid index icon button in bottom-right corner** opens a full-screen thumbnail grid overlay of all photos; close button (X) appears when grid is open
- **Navigation bar fixed at bottom** of page: Photoblog | About | Contact
- Keyboard shortcuts: left/right arrow keys for prev/next, Escape to close grid
- No auto-play (matches source)

#### About (`/about/`)
- Title: "About"
- Heading: "A SCRAPBOOK OF A CITY ENTHUSIAST"
- Body text (exact content)
- Image: toesocks.jpg

#### Contact (`/contact/`)
- Title: "Contact"
- Empty/minimal (just the page)

### Shared Layout
- Header: site title "NYCNERD" (text, links to `/`)
- **Navigation: fixed at bottom of ALL pages** (homepage, about, contact), links: Photoblog | About | Contact
- Active link: highlighted (white vs gray)
- Mobile: hamburger menu (top-left on mobile), nav hidden on mobile, slide-down menu
- Font: Raleway
- Dark background (`#000`), centered layout
- Footer: none (original has none)
- Gallery controls (grid icon, close icon): fixed bottom-right corner

### Photo Data (Complete List — 27 Photos)

| # | Title | Date | Slug | Dimensions | Image URL |
|---|-------|------|------|-----------|-----------|
| 1 | Jersey City | January 3, 2018 | jersey-city-2018 | 2500x1669 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1515305265722-HXOUR17TNIW9KKDCSIRS/20180103-20180103-DSC_4974.jpg |
| 2 | Jersey City | August 12, 2015 | jersey-city-2015-08 | 2500x1777 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1439425459975-9R83PYBWBACH1TIZ4NHH/image-asset.jpeg |
| 3 | Jersey City | June 15, 2015 | jersey-city-2015-06 | 2500x1668 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1434434226406-KUQUL3I6STU7DBN6X98O/image-asset.jpeg |
| 4 | Jersey City | Sept 16, 2014 | jersey-city-2014 | 2500x1875 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1411082502816-YLG15C4FUZX704RX0Y6V/image-asset.jpeg |
| 5 | Black Cat | Jan 9, 2014 | black-cat | 1500x1001 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396167981934-U07PJJ6JY517VG7JZ33E/DSC_0997.jpg |
| 6 | Midtown | May 24, 2012 | midtown-2012-05-24 | 1500x1464 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396168385693-QSM6XENCF9PKFJ10KEF3/DSC_0477.jpg |
| 7 | Eve of Sandy | Oct 29, 2012 | eve-of-sandy | 1498x1500 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396498112880-30T0LXLCRLQ3NDEUW2JW/20121029-IMG_0262.jpg |
| 8 | Midtown | June 15, 2012 | midtown-2012-06-15 | 1500x1125 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497952670-KKLY392S6LFLRNP79M6A/20120615-IMG_0200.jpg |
| 9 | Jersey City | May 25, 2012 | jersey-city-2012 | 1500x1125 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497867202-GCGYE49KIKLQ4NRZK4GA/IMG_0191.jpg |
| 10 | Midtown | May 14, 2012 | midtown-2012-05-14 | 1500x1070 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497807399-F88D0TCH6CEGK8GTN7H0/IMG_0185.jpg |
| 11 | Midtown | May 6, 2012 | midtown-2012-05-06 | 1500x996 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497707017-JZIKX7EQ0OUOSS2WK6IZ/_DSC4617.jpg |
| 12 | Midtown | April 27, 2012 | midtown-2012-04-27 | 1500x1125 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497632401-ZZ9VDLBVJJSW717H053B/IMG_0179.jpg |
| 13 | BBQ | April 25, 2012 | bbq | 1500x996 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497535059-840MHCOY3LYD3TDGUGH6/_DSC4560.jpg |
| 14 | Midtown | March 23, 2012 | midtown-2012-03-23 | 1500x1500 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396497407890-RM99B0ESHOJDU84EORLA/IMG_0174.jpg |
| 15 | Midtown | March 18, 2012 | midtown-2012-03-18 | 1500x996 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396495761850-OS56W4ENM7R3Y72PAH45/_DSC4444.jpg |
| 16 | Lincoln Center | March 11, 2012 | lincoln-center | 1500x1125 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396483017790-P450ODEQ3SH8LZH1OFQO/IMG_0168.jpg |
| 17 | West Village | March 6, 2012 | west-village-2012-03-06-1 | 1500x1035 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396482952844-6UW1C9IYJRT78PMJ3HFJ/IMG_0166.jpg |
| 18 | West Village | March 6, 2012 | west-village-2012-03-06-2 | 1125x1500 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396482816798-1J7H7116XFB7X7VFTUWI/IMG_0160.jpg |
| 19 | Hells Kitchen | March 5, 2012 | hells-kitchen-2012-03 | 1500x887 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396482590609-XDTJ12OP9OOA9WSKOD5Y/_DSC4406.jpg |
| 20 | Eataly | March 3, 2012 | eataly | 1500x1125 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396482501294-PTC9ESF7UXJLUIX65CMD/IMG_0148.jpg |
| 21 | Sapporo | Feb 29, 2012 | sapporo | 1500x1125 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396417086890-74M5FN0641270O1HIG40/IMG_0139.jpg |
| 22 | Hells Kitchen | Feb 28, 2012 | hells-kitchen-2012-02 | 1500x1143 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396416677784-277J3U1MZ3T22MIBRYP1/IMG_0137.jpg |
| 23 | ACE Hotel | Feb 26, 2012 | ace-hotel | 1500x1125 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396416544714-LX8UAITF5GCJ9VSVXRDA/IMG_0126.jpg |
| 24 | Despaña | Jan 2, 2012 | despana | 1500x996 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1396417287814-A43W06OTOKW0EVCI0XUY/_DSC4255.jpg |
| 25 | Midtown | Dec 27, 2009 | midtown-2009 | 2500x1800 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1440884108265-MLYEPS64A4HBD0SKCIB8/image-asset.jpeg |
| 26 | Moma | Jul 5, 2009 | moma | 2500x1661 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1440884169044-9FT1Q7DYQEHRRWQMMZN3/image-asset.jpeg |
| 27 | West Village | June 13, 2009 | west-village-2009 | 2500x1762 | https://images.squarespace-cdn.com/content/v1/5334f070e4b08c4363512a21/1440884201001-1FXREP5L82LW5U72K87B/image-asset.jpeg |

---

## Verification Checklist

After building the Hugo site, verify each item by running `hugo server` and comparing against https://nycnerd.com:

1. **Homepage** shows a full-viewport gallery/slideshow
2. **All 27 photos** appear in the gallery, in correct order (newest first)
3. **Each photo** displays with its location title and date
4. **Images are NOT full-bleed** — there is visible space around them (max 90% width, 85vh height)
5. **Navigation arrows only appear on hover** over the gallery area; fade out after 2s of inactivity
6. **Grid index icon button** is visible in the **bottom-right corner**
7. **Grid index view** opens as full-screen thumbnail overlay showing all photos
8. **Grid close button** (X) appears in bottom-right when grid is open
9. **Navigation bar is at the bottom** of the page with three links: Photoblog, About, Contact
10. **Active link** is highlighted (white text vs gray)
11. **About page** has correct heading, body text, and toesocks image
12. **Contact page** renders (even if empty)
13. **Font** is Raleway
14. **Responsive layout** works on mobile (hamburger menu, resized images)
15. **Mobile hamburger menu** toggles navigation
16. **Header** shows "NYCNERD" as text logo
17. **All images are local** — no external CDN references in the built site
18. **No broken images** — every `<img>` src resolves to an existing file in `static/images/`
19. **No broken links**
20. **`hugo build`** completes without errors
21. **Visual match** — compare homepage, about, contact side-by-side with source
22. **Offline test** — serve the site with no internet connection; everything should load
