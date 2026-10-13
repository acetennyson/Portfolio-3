# Portfolio

A full-stack portfolio application with interactive 3D elements, admin CMS, and integrated lab tools.

## Architecture

### Frontend
- **Next.js 16.2** with App Router
- **React 19** Server & Client Components
- **Tailwind CSS 4** for styling
- **TypeScript** throughout

### 3D & Animation
- **Three.js** for WebGL rendering (hero scene, astronaut finale)
- **cannon-es** for physics simulation
- **anime.js** for timeline-based animations
- **Lenis** for smooth scroll

### Backend & Data
- **Firebase** (Firestore, Auth, Storage)
- Projects and blog posts stored in Firestore with static fallbacks
- Rate limiting and deduplication for API routes
- Admin CMS for content management

### Key Features

**Interactive Hero**  
Physics-based 3D block scene with cannon-es rigid bodies, mouse/touch interaction, and WebGL fallback detection.

**Content Management**  
Admin routes (`/_admin`) with Editor.js integration for creating and managing blog posts and projects. Note: `_admin` is a Next.js private folder pattern — not publicly routable.

**Lab Tools**  
Self-contained utility applications:
- Calculator
- Dice Roller (3D physics)
- Weather (city/ZIP/IP lookup, 7-day forecast)
- Compass (device orientation)
- Unit Converter (currency, length, weight, temperature, time)
- World Clock (multiple timezones, 4 clock styles)
- BMI Tracker

**Page Transitions**  
View-transition-based navigation with data attributes for contextual animations.

**Motion System**  
Reusable animation primitives: `Reveal`, `SplitReveal`, `Magnetic`, scroll-triggered word reveals.

**Accessibility**  
Respects `prefers-reduced-motion`, keyboard navigation (skip links, focus management), semantic HTML.

## Setup

### Prerequisites
- Node.js 20+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env
```

### Environment Variables

Required for Firebase integration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Optional for project screenshots:
```env
SCREENSHOT_PROVIDERS=microlink,thumio
MICROLINK_API_KEY=
THUMIO_KEY=
SCREENSHOTONE_KEY=
```

Site URL for SEO:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
app/
├── (public)/          # Public routes
│   ├── blog/          # Blog index & posts
│   ├── projects/      # Project showcase
│   ├── tools/         # Lab utilities
│   └── page.tsx       # Homepage
├── _admin/            # CMS (private folder, not routable)
│   ├── blog/new/      # Create blog posts
│   └── projects/      # Manage projects
├── api/               # API routes
│   └── chat/whatsapp/ # WhatsApp webhook
└── layout.tsx         # Root layout

components/
├── editor/            # Editor.js wrapper
├── hero/              # 3D block scene
├── home/              # Homepage sections
├── motion/            # Animation primitives
├── renderers/         # Content block renderer
├── shell/             # Layout components
└── ui/                # Base UI components

firebase/
├── config.js          # Firebase initialization
├── firestore.js       # Firestore queries
├── auth.js            # Authentication
└── rateLimitStore.js  # API rate limiting

lib/
├── data.ts            # Site configuration & content
└── projects.ts        # Project resolver logic
```

## Content Management

Content is stored in Firestore with static fallbacks defined in `lib/data.ts`.

**Projects:** Fetched from Firestore collection `projects`, falls back to `staticProjects`  
**Blog:** Fetched from Firestore collection `blogs`, falls back to `staticBlogs`

Admin routes use Editor.js for rich content editing with support for headers, paragraphs, lists, and images.

## Performance Considerations

- First-visit loader runs once per session (~2.9s)
- Astronaut model (2.8 MB) loads only when finale section enters viewport
- 3D scenes skip rendering when `prefers-reduced-motion` is set
- Static content serves immediately; Firebase data revalidates every 60 seconds

## Tech Stack

| Category | Technologies |
|----------|-------------|
| Framework | Next.js 16.2, React 19 |
| Styling | Tailwind CSS 4, CSS custom properties |
| 3D/Animation | Three.js, cannon-es, anime.js, Lenis |
| Backend | Firebase (Firestore, Auth, Storage) |
| Content | Editor.js |
| Icons | Lucide React |
| Fonts | Bricolage Grotesque, JetBrains Mono, Instrument Serif |

## License

Private project. Code and design © Ado Daniel NJ.

**Attribution:**  
`public/models/astronaut.glb` by Google, licensed under Apache-2.0.
