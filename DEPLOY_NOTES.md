# Deploy notes (Stage 7)

## Environment variables (set on your host, e.g. Vercel → Project → Settings → Environment Variables)
- `NEXT_PUBLIC_SITE_URL`: your final URL, no trailing slash. Drives canonical/OG URLs, `robots.txt` and `sitemap.xml`.
- `NEXT_PUBLIC_FIREBASE_*` (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID): **required at build time**. Without them `next build` fails on `/api/chat/whatsapp`.
- WhatsApp / AI keys as already used by `app/api/chat/whatsapp` and `lib/ai`.
- Optional: `SCREENSHOT_PROVIDERS`, `MICROLINK_API_KEY`, `THUMIO_KEY`, `SCREENSHOTONE_KEY` (project live previews). See `.env.example`.

## Build
`pnpm install && pnpm build` (or `npm install && npm run build`). Node 20+.

## Replace before launch
1. **`lib/data.ts` placeholders**: projects *Luminary Dashboard*, *Orbit Design System*, *Pulse Mobile App*; timeline "Senior Engineer @ Stealth Startup" / "Series A fintech" / "Frontend Lead @ Orbit"; stats "50k+ Users Reached" (and "12+ / 4+" if not exact); the blog excerpt mentioning "50k users"; unattributed testimonials.
2. **Avatar**: `siteConfig.avatar` is a Facebook CDN URL with an expiring signature. Save the photo to `/public/avatar.jpg` and use `"/avatar.jpg"`.
3. **Privacy page** (`app/(public)/iamsupreme/privacy/page.tsx`): `APP_NAME` and `CONTACT_EMAIL` (`...@example.com`) are TODO placeholders; update `LAST_UPDATED`.
4. **Social image**: add `app/opengraph-image.png` (1200×630) so shared links get a preview card.
5. **Contact email** in `siteConfig.email`: confirm it is the one you want public.
6. **Astronaut model credit**: `public/models/astronaut.glb` is Google (Apache-2.0); keep attribution somewhere (footer or README).

## Known notes
- `pnpm lint` reports pre-existing issues (`no-explicit-any`, React-compiler "setState in effect" in a few components and tool pages, one `prefer-const` in dice). None block the build; tool logic was left untouched per the plan.
- The first-visit loader runs about 2.9 s once per session. It is the main drag on Lighthouse LCP. Shorten `duration` in `components/shell/Loader.tsx` for a better score.
- `public/models/astronaut.glb` is 2.8 MB. It loads only when the finale is near the viewport. Compressing with Draco/meshopt (gltf-transform) would roughly halve it.
- The admin lives in `app/_admin`. A leading underscore makes it a private folder in Next, so it is **not routable**. Rename it if you expect `/admin` to work.

## Smoke-test checklist after deploying
- Home, /projects, a case study, /blog, a post, /tools and one tool.
- Keyboard: Tab shows "Skip to content"; the menu opens, Tab stays inside, Esc closes and focus returns to the Menu button.
- OS "Reduce motion" on: no loader, no curtain, static hero blocks, no smooth-scroll.
- Phone: hero scene stays smooth, no horizontal scroll, finale readable.
- View `/robots.txt` and `/sitemap.xml`; visit a bogus URL to see the 404.
