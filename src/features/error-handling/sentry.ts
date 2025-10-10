import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";
import { replayIntegration } from "@sentry/react";

export const initSentry = () => {
    if (import.meta.env.REACT_APP_SENTRY_DSN) {
        Sentry.init({
            dsn: import.meta.env.REACT_APP_SENTRY_DSN,
            environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT,
            integrations: [
                browserTracingIntegration(),
                replayIntegration({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
        });
    }
};
