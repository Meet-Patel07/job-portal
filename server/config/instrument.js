// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://d5c2fd3fb5c45503912bbfddf85fae65@o4510084529979392.ingest.us.sentry.io/4510140973776896",
  integrations: [nodeProfilingIntegration(), Sentry.mongooseIntegration()],
  // Tracing
  // tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
Sentry.profiler.startProfiler();

// Profiling happens automatically after setting it up with `Sentry.init()`.
// All spans (unless those discarded by sampling) will have profiling data attached to them.
Sentry.startSpan(
  {
    name: "My Span",
  },
  () => {
    // The code executed here will be profiled
  }
);

// Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// your application until the process exits or stopProfiling is called.ql-action
Sentry.profiler.stopProfiler();
