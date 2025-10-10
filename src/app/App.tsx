import { IonApp, setupIonicReact } from "@ionic/react";

import "@ionic/react/css/core.css";

import "@ionic/react/css/normalize.css";

import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.system.css";

import "./styles/app.scss";

import { IonReactRouter } from "@ionic/react-router";
import { createBrowserHistory } from "history";
import React from "react";

import { AuthProvider } from "@/app/providers/AuthProvider.tsx";
import { RootRouter } from "@/app/router/RootRouter.tsx";

import AppUrlListener from "./providers/AppUrlListener";

const customHistory = createBrowserHistory();

setupIonicReact({ mode: "ios" });

export default function App() {
    return (
        <IonApp>
            <IonReactRouter history={customHistory}>
                <AppUrlListener></AppUrlListener>
                <AuthProvider>
                    <RootRouter />
                </AuthProvider>
            </IonReactRouter>
        </IonApp>
    );
}
