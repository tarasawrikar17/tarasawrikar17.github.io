# Tara Sawrikar — Graphics & Pipeline Engineering Portfolio

Static portfolio served by GitHub Pages at `tarasawrikar.com`.

## Structure

- `index.html` — overview, selected work, experience, and contact
- `art.html` — optimized artwork gallery
- `resume.html` — accessible resume viewer and download
- `assets/projects/` — real project demos and screenshots
- `assets/art/` — responsive gallery images

## Validate before publishing

Run:

```sh
python3 scripts/check_site.py
```

The checker verifies local page and asset references, fragment targets, image dimensions and alternative text, iframe titles, and safe new-tab links.

## Publish

Commit the approved files to the repository's main branch. GitHub Pages will serve the site using the existing `CNAME` file.
