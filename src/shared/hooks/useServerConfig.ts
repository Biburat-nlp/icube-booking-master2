import { useState, useEffect, useCallback } from "react";
import { serverConfigManager, type ServerConfig } from "@/shared/config/serverConfig.ts";

export const useServerConfig = () => {
    const [config, setConfig] = useState<ServerConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadConfig = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const serverConfig = await serverConfigManager.getConfig();
            setConfig(serverConfig);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load server config");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateConfig = useCallback(async (newConfig: ServerConfig) => {
        try {
            setError(null);
            await serverConfigManager.setConfig(newConfig);
            setConfig(newConfig);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update server config");
            throw err;
        }
    }, []);

    const resetToDefault = useCallback(async () => {
        try {
            setError(null);
            await serverConfigManager.resetToDefault();
            await loadConfig();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reset server config");
            throw err;
        }
    }, [loadConfig]);

    const validateUrl = useCallback((url: string) => {
        return serverConfigManager.validateUrl(url);
    }, []);

    const formatUrl = useCallback((url: string) => {
        return serverConfigManager.formatUrl(url);
    }, []);

    const getDefaultUrl = useCallback(() => {
        return serverConfigManager.getDefaultUrl();
    }, []);

    const isDefaultUrl = useCallback((url: string) => {
        return serverConfigManager.isDefaultUrl(url);
    }, []);

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    return {
        config,
        isLoading,
        error,
        updateConfig,
        resetToDefault,
        validateUrl,
        formatUrl,
        getDefaultUrl,
        isDefaultUrl,
        reload: loadConfig,
    };
};
