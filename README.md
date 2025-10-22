# LinkedIn Dashboard – Cloudflare Pages

This project is a performance dashboard for tracking LinkedIn posts, built with Next.js 15 and deployed on Cloudflare using the OpenNext adapter.

## Setup

1. Clone the repo  
2. Install dependencies: `npm install`  
3. Develop locally: `npm run dev`  
4. Build for production: `npm run build`  
5. Deploy: `npm run deploy` (or via GitHub & Cloudflare Pages)  

## Environment Variables

- `LINKEDIN_CLIENT_ID`  
- `LINKEDIN_CLIENT_SECRET`  

Set these in Cloudflare Pages → Settings → Environment Variables.

## Deploying

This repo is connected to GitHub → Cloudflare Pages. Commits to the `main` branch trigger automatic builds and deploys.
