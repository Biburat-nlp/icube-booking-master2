import { ErrorBoundary } from "@sentry/react";
import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "react-query";

import { ErrorToastProvider } from "@/app/providers/ErrorToastProvider";
import { ServerConfigProvider } from "@/app/providers/ServerConfigProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

import i18n from "@/features/localisation/i18n";

import { initStorage } from "@/shared/lib/ionic-storage";

import App from "./app/App";
import { I18nextProvider } from "react-i18next";
import { queryClient } from "./app/providers/queryClient";
import { initSentry } from "./features/error-handling/sentry";
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { StatusBar, Style } from '@capacitor/status-bar';

const container = document.getElementById("root");
const root = createRoot(container!);

async function bootstrap() {
    initSentry();

    try {
        // await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Dark });
        await EdgeToEdge.setBackgroundColor({ color: '#000000' });            
    } catch (error) {}

    try {
        await initStorage();
    } catch (err) {
        console.error("Failed to init storage", err);
    }

    root.render(
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ErrorToastProvider>
                    <ServerConfigProvider>
                        <I18nextProvider i18n={i18n}>
                            <ThemeProvider>
                                <App />
                            </ThemeProvider>
                        </I18nextProvider>
                    </ServerConfigProvider>
                </ErrorToastProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

bootstrap();
