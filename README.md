# Cloudflare Pages - Next.js (Next-on-Pages) - LinkedIn Dashboard

## Deploy with Cloudflare Pages (recommended)
1) Create a new project at https://dash.cloudflare.com → Pages → "Create a project" → "Connect to Git".
2) Push this folder to a new GitHub repo and connect it.
3) Build settings:
   - Framework preset: **Next.js**
   - Build command: **npm run build**
   - Build output directory: **.vercel/output/static**
4) Environment variables (Project Settings → Environment Variables):
   - LINKEDIN_CLIENT_ID
   - LINKEDIN_CLIENT_SECRET
5) After deploy, open `/dashboard`.

## Local preview (optional)
- `npm install`
- `npm run dev` (Next dev server)
- `npm run build` then `npm start` (Pages dev against the built output)

This project includes API route stubs at /api/linkedin/* that are compatible with Cloudflare's Edge runtime via next-on-pages.
