import { IonAlert } from "@ionic/react";
import * as Sentry from "@sentry/react";

import type { ReactNode } from "react";

type TProps = {
    children: ReactNode;
};

export const ErrorBoundary = ({ children }: TProps) => (
    <Sentry.ErrorBoundary
        fallback={({ error }) => (
            <IonAlert
                isOpen
                header="Error"
                message={`Error: ${error}`}
                buttons={["OK"]}
            />
        )}
    >
        {children}
    </Sentry.ErrorBoundary>
);
