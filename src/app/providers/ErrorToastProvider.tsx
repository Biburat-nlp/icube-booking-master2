import { IonToast } from "@ionic/react";
import React, { createContext, useState, useContext, useEffect } from "react";

import { setShowErrorCallback } from "@/shared/utils/error/errorNotifier.ts";

import type { ReactNode } from "react";

type ErrorContextType = {
    showError: (message: string) => void;
};

const ErrorToastContext = createContext<ErrorContextType | undefined>(undefined);

type ErrorToastProviderProps = {
    children: ReactNode;
};

export const ErrorToastProvider = ({ children }: ErrorToastProviderProps) => {
    const [toastState, setToastState] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: "",
    });

    const showError = (message: string) => {
        setToastState({
            isOpen: true,
            message,
        });
    };

    useEffect(() => {
        setShowErrorCallback(showError);
    }, []);

    return (
        <ErrorToastContext.Provider value={{ showError }}>
            {children}
            <IonToast
                isOpen={toastState.isOpen}
                message={toastState.message}
                duration={3000}
                onDidDismiss={() => setToastState({ isOpen: false, message: "" })}
                cssClass="ion_toast_danger_mode"
                position="top"
            />
        </ErrorToastContext.Provider>
    );
};

export const useErrorToast = (): ErrorContextType => {
    const context = useContext(ErrorToastContext);
    if (!context) {
        throw new Error("useErrorToast must be used within an ErrorToastProvider");
    }
    return context;
};
