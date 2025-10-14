import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { serverConfigManager } from "@/shared/config/serverConfig.ts";
import { updateApiBaseUrl } from "@/shared/api/api.ts";

interface ServerConfigContextType {
    isInitialized: boolean;
    baseUrl: string;
    isCustom: boolean;
    refreshConfig: () => Promise<void>;
}

const ServerConfigContext = createContext<ServerConfigContextType | null>(null);

interface ServerConfigProviderProps {
    children: ReactNode;
}

export const ServerConfigProvider: React.FC<ServerConfigProviderProps> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const [isCustom, setIsCustom] = useState(false);

    const refreshConfig = async () => {
        try {
            const config = await serverConfigManager.getConfig();
            setBaseUrl(config.baseUrl);
            setIsCustom(config.isCustom);
            // Update API base URL derived from domain
            const apiBase = await serverConfigManager.getApiBaseUrl();
            await updateApiBaseUrl(apiBase);
        } catch (error) {
        }
    };

    useEffect(() => {
        const initializeConfig = async () => {
            try {
                await refreshConfig();
                setIsInitialized(true);
            } catch (error) {
                setIsInitialized(true); // Избегаем бесконечной загрузки kappa
            }
        };

        initializeConfig();
    }, []);

    const contextValue: ServerConfigContextType = {
        isInitialized,
        baseUrl,
        isCustom,
        refreshConfig,
    };

    return (
        <ServerConfigContext.Provider value={contextValue}>
            {children}
        </ServerConfigContext.Provider>
    );
};

export const useServerConfigContext = (): ServerConfigContextType => {
    const context = useContext(ServerConfigContext);
    if (!context) {
        throw new Error("useServerConfigContext must be used within a ServerConfigProvider");
    }
    return context;
};
