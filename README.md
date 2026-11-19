# alexhaloeth.github.io

Personal portfolio. React + Vite, prerendered at build time, deployed to GitHub Pages
by `.github/workflows/deploy.yml` on every push to `main`.

## Editing content

All words, links and data live in `src/data/`. Components only render it.

| What | File |
| --- | --- |
| Name, intro, email, profile links, Status sheet | `src/data/profile.js` |
| Blob Arena, Dungeon Forge, earlier GitHub work | `src/data/projects.js` |
| Experience timeline | `src/data/experience.js` |
| Toolkit (skills) and "Leveling up" | `src/data/skills.js` |
| Places on the travel map | `src/data/places.js` |

Images and video go in `public/media/`. Give every image its real `width` and `height`
in the data file so the page does not jump while it loads.

## The 3D scene

The background is a three.js scene in `src/scene/`: a capital ship with escort fighters,
the odd ship dropping out of warp, a ring megastructure and shooting stars. The camera
moves to a new shot for each element marked `data-shot` as you scroll (see `SHOTS` in
`src/scene/scene.js`).

- It loads after the page is idle, so the content never waits for it. On data saver it
  is skipped and a CSS star sky stays in its place.
- Under reduced motion it renders one still frame and never downloads the warp ship.
- Its colours are the `--scene-*` tokens in `src/styles/tokens.css`.
- The ships are GLB models in `public/models/` (see `CREDITS.md` there; Blender sources
  and review renders are in `design/models/`). `src/scene/models.js` attaches engine
  glow, lights and turret motion to the empties named in each model. If a model cannot
  load, the procedural ships in `ship.js` and `fighters.js` stand in.
- In development, `?procedural` shows the procedural ships for comparison.

## The map

The land is precomputed once into `src/data/worldDots.js`, so visitors' browsers do no
map work. To add a place, add a line to `src/data/places.js` with its coordinates and
`kind` (`home`, `worked` or `visited`). No rebuild of the land is needed.

Only run `npm run build:map` if you change the map's bounds or pixel size in
`scripts/build-world-dots.mjs`.

## Commands

```bash
npm run dev        # local dev server
npm run build      # production build into dist/, with the page prerendered
npm run preview    # serve dist/ locally
npm run lint       # ESLint
npm run lint:css   # Stylelint (auto-fixes property order)
```

## Design tokens

Every colour, size and timing is a CSS variable in `src/styles/tokens.css`. Change a
value there and it changes everywhere. Contrast for every text and action pair was
checked against WCAG AA; re-check if you change a colour.
