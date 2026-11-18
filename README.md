# Crimson Claws

Demo website for the Crimson Claws, a fictional basketball club playing at the Kiln on Harbour Road. Built with Next.js, React Three Fiber and Tailwind CSS.

## What's in it

- **Home**: the live 3D home court, the next home game, the roster, Rex the mascot and the club kit.
- **Play** (`/play`): a 3D half court in the browser. Drag and flick to shoot from 11 spots including half court, with day, dawn, dusk and night lighting, crowd sound, recorded commentary and a 60-second challenge.
- **Club** (`/club`): the club's history and game-night traditions.
- **Roster, Schedule, Media**: players, fixtures and photos.
- **Tickets** (`/tickets`): pick a home game, seat tier and quantity.
- **Shop** (`/shop`): balls, jerseys, shorts, caps and hoodies with colour and size choices.
- **Bag and checkout** (`/cart`, `/checkout`): one bag for kit and tickets, kept in the browser. Checkout is a demo: no payment is taken.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

Every page is prerendered as static content, so it deploys to Vercel with no extra configuration.

## Project layout

```
app/                 pages (App Router), global and intro styles, favicon
components/game/     the 3D court, ball physics and game HUD
components/mascot/   Rex, the 3D mascot
components/site/     navbar, footer, cart, checkout, tickets, shop sections
components/ui/       pasted UI components (product hero, ticket, footer)
lib/                 game state, cart, tickets, audio and lighting
data/content.ts      roster, schedule, season figures and gallery
public/audio/        commentary clips
public/brand/        logo mark and footer cut-out
public/media/        photos for the media and club pages
public/roster/       player posters
public/shop/         product cut-outs
```

## Credits

Footer photograph by MarcoCrupi via Wikimedia Commons (CC BY-SA 3.0). Crimson Claws, its players and its history are fictional.
