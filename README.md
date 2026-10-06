# Mahera Tasfee — Immersive Portfolio

An interactive first-person portfolio for Mahera Tasfee, presented as a calm, cinematic home that visitors explore room by room.

## Experience

- Walk through a 3D residence using scroll, drag, and room transitions.
- Discover education, experience, projects, capabilities, achievements, and contact details as physical exhibits.
- Explore animated lavender gardens through the home’s windows.
- Meet Mahera and her calico cat roaming the entrance room.
- Switch between Golden Hour and After Hours lighting, with an exterior clock synced to Dhaka time.
- Browse all GitHub projects with dedicated exhibits and visual placeholders for future media.

## Built with

- React and TypeScript
- React Three Fiber and Three.js
- Drei for 3D helpers and text
- Vinext / Vite for the application build
- GitHub Actions and GitHub Pages for deployment

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

The GitHub Pages workflow runs on every push to `main`, builds the static export, and publishes it to:

<https://mah-era.github.io/Portfolio/>

## Project structure

```text
app/                 App shell, metadata, and global styles
components/          3D rooms, residents, exhibits, lighting, and interactions
lib/                 Portfolio content and shared utilities
public/assets/       Project screenshots and visual assets
.github/workflows/   GitHub Pages deployment workflow
```

## Content updates

Project copy and profile information live in `lib/portfolio-data.ts`. Project screenshots and future recordings can be added under `public/assets/`, then referenced from the corresponding project entry.

## License

Personal portfolio project. Content and identity belong to Mahera Tasfee.
