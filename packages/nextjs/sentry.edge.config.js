import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://01464d5902907af717b480cd11e45da9@o4505844659126272.ingest.sentry.io/4505844818575360",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});