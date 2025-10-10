import { storage } from "@/shared/lib/ionic-storage";

export interface ServerConfig {
    baseUrl: string;
    isCustom: boolean;
}

const DEFAULT_SERVER_URL = import.meta.env.VITE_API_URL || "https://icube-space.ru/api";
const STORAGE_KEY = "server_config";

export class ServerConfigManager {
    private static instance: ServerConfigManager;
    private config: ServerConfig | null = null;

    private constructor() {}

    public static getInstance(): ServerConfigManager {
        if (!ServerConfigManager.instance) {
            ServerConfigManager.instance = new ServerConfigManager();
        }
        return ServerConfigManager.instance;
    }

    public async getConfig(): Promise<ServerConfig> {
        if (this.config) {
            return this.config;
        }

        try {
            const storedConfig = await storage.get(STORAGE_KEY);
            if (storedConfig && storedConfig.baseUrl) {
                this.config = storedConfig;
                return this.config!;
            }
        } catch (error) {
            console.warn("Failed to load server config from storage:", error);
        }

        // Fallback to default config
        this.config = {
            baseUrl: DEFAULT_SERVER_URL,
            isCustom: false,
        };
        return this.config;
    }

    public async setConfig(config: ServerConfig): Promise<void> {
        try {
            await storage.set(STORAGE_KEY, config);
            this.config = config;
        } catch (error) {
            console.error("Failed to save server config:", error);
            throw error;
        }
    }

    public async resetToDefault(): Promise<void> {
        const defaultConfig: ServerConfig = {
            baseUrl: DEFAULT_SERVER_URL,
            isCustom: false,
        };
        await this.setConfig(defaultConfig);
    }

    public async getBaseUrl(): Promise<string> {
        const config = await this.getConfig();
        return config.baseUrl;
    }

    public async isCustomConfig(): Promise<boolean> {
        const config = await this.getConfig();
        return config.isCustom;
    }

    public validateUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    public formatUrl(url: string): string {
        // Remove trailing slash
        let formatted = url.trim().replace(/\/$/, "");
        
        // Add protocol if missing
        if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
            formatted = "https://" + formatted;
        }
        
        return formatted;
    }

    public getDefaultUrl(): string {
        return DEFAULT_SERVER_URL;
    }

    public isDefaultUrl(url: string): boolean {
        const formattedUrl = this.formatUrl(url);
        const formattedDefault = this.formatUrl(DEFAULT_SERVER_URL);
        return formattedUrl === formattedDefault;
    }
}

export const serverConfigManager = ServerConfigManager.getInstance();
