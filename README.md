# JAMail

An email-themed birthday archive for Shiv's 25th, named after Jam Jam the cat.

- **Shiv's view:** https://jamail.vercel.app. Desktop shows a QR code; on a phone it opens the envelope splash. The login PIN is `2410`.
- **Friends' upload page:** https://jamail.vercel.app/submit. The password is the `SUBMIT_PASSWORD` env var.

## Stack

Next.js 14 (App Router) on Vercel. Photos and videos upload straight from the browser to Vercel Blob. Each friend's message is stored as `data/messages/<slug>.json`. Loose folder uploads live under `uploads/folders/<spam|top-secret|blackmail>/<from-slug>__<file>`.

## Local dev

```
vercel env pull .env.local
npm install
npm run dev
```

To change the friends' password: `vercel env rm SUBMIT_PASSWORD production`, then `vercel env add SUBMIT_PASSWORD production`, then redeploy.
