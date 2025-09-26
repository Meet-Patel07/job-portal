// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://409c7ec3885234748a8ac732de4e05ed@o4510084529979392.ingest.us.sentry.io/4510085143003136",
  integrations: [nodeProfilingIntegration(), Sentry.mongooseIntegration()],
  // Tracing
  // tracesSampleRate: 1.0, // Capture 100% of the transaction
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
Sentry.profiler.startProfiler();

// Starts a transaction that will also be profiled
Sentry.startSpan(
  {
    name: "My First Transaction",
  },
  () => {
    // the code executing inside the transaction will be wrapped in a span and profiled
  }
);

// Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// your application until the process exists or stopProfiling is called.ql-action
Sentry.profiler.stopProfiler();
