This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google API setup (YouTube uploads)

This project supports uploading videos to YouTube. To enable uploads you must provide a Google OAuth refresh token to the server via the `GOOGLE_REFRESH_TOKEN` environment variable.

Quick steps to get a refresh token for local development:

1. Ensure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` are set in your `.env.local`.
2. Start the dev server: 

```bash
npm run dev
```

3. Visit the OAuth start URL in your browser: `http://localhost:3000/api/google/auth-url`.
4. Complete the consent flow; the OAuth callback will exchange the code and log or return tokens via `GET /api/google/callback` depending on implementation.
5. Copy the `refresh_token` value and add it to `.env.local`:

```env
GOOGLE_REFRESH_TOKEN=ya29.your_refresh_token_here
```

6. Restart the Next.js server. The upload endpoint will now be able to use the refresh token to get access tokens and upload videos.

If you don't intend to enable YouTube uploads, you can ignore this step; the upload API will return an explanatory error if the refresh token is not configured.
