# Public assets

Everything in this folder is served at the site root. The portfolio ships
without binary files on purpose — you add them when you are ready, and the UI
picks them up automatically.

```
public/
├── profile/        → the hero + about portrait
├── projects/       → project screenshots
├── certificates/   → certificate images (optional)
└── resume/         → the resume PDF for the "Download Resume" button
```

## How automatic detection works

Nothing here is hardcoded to a single filename. On load, the site probes a
list of candidate paths and uses the first one that actually resolves:

### Profile photo

Drop any one of these into `public/profile/`:

| Filename    | Supported extensions        |
| ----------- | --------------------------- |
| `profile`   | `.webp` `.jpg` `.jpeg` `.png` `.avif` |
| `portrait`  | same                        |
| `snehasmita`| same                        |
| `me`        | same                        |
| `headshot`  | same                        |

The same names also work directly in `public/`. If no file is found, a
designed monogram placeholder is rendered instead — the page never breaks.

**Recommended:** a square image, at least 800 × 800 px, `.webp` preferred
(Next.js will also serve AVIF automatically).

### Project screenshots

Name each file after the project slug and drop it into `public/projects/`:

```
indian-health-system.webp
seafarers-association.webp
omniorra.webp
spanco-tek.webp
ecommerce.webp
restaurant-management.webp
daily-expenditure.webp
plot-selling.webp
biryani-express.webp
```

`.webp`, `.jpg`, `.jpeg`, `.png` and `.avif` are all detected. Until a file
exists, the card shows a designed placeholder built from the project name.

**Recommended:** 16:10 landscape, ~1600 × 1000 px, `.webp`.

### Resume

Drop the PDF here as:

```
public/resume/Snehasmita-Pradhan-Resume.pdf
```

If no PDF is found, the "Download Resume" button links to the contact
section instead of 404-ing. You can also point the button somewhere else by
setting `NEXT_PUBLIC_RESUME_FILE` in `.env.local`.

### Certificates (optional)

Drop certificate images into `public/certificates/`, then add a
`certificateUrl` (or `credentialUrl`) to the matching entry in
`src/data/certifications.js`. Cards without a link never show a link icon.
