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

## Activity notifications

Set `DISCORD_ACTIVITY_WEBHOOK_URL` as a server-side environment variable in `.env.local` and in the production host. Keep the webhook URL out of `NEXT_PUBLIC_` variables and source control. Successful vehicle, fleet, issue, document, and service actions send short operational alerts. If Discord is unavailable, the user action still succeeds.

## Document expiry SMS cron

After deploying this app and applying `supabase/migrations/20261010190000_document_sms_reminders.sql`, configure a job in cron-job.org:

- URL: `https://motorambos.com/api/cron/document-reminders` (use the actual deployed app host if different)
- Method: `POST`
- Schedule: every day at 09:00, timezone `Africa/Accra`
- Header: `Authorization: Bearer <CRON_REMINDER_SECRET>`

Set the same strong `CRON_REMINDER_SECRET` on the app host. The endpoint also needs `HUBTEL_SMS_BASIC_AUTH`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. It sends insurance and roadworthy reminders at 30, 7, and 1 days before expiry to personal vehicle owners and assigned fleet drivers with Ghana phone numbers. A database claim prevents repeat sends for the same interval; failed attempts can retry while that interval is current. The response contains counts only, without phone numbers.

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
