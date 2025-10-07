// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://d5c2fd3fb5c45503912bbfddf85fae65@o4510084529979392.ingest.us.sentry.io/4510140973776896",
  integrations: [nodeProfilingIntegration(), Sentry.mongooseIntegration()],
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
});

Sentry.startSpan({ name: "My Span" }, () => {
  // The code executed here will be profiled
});
