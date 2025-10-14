import { storage } from "@/shared/lib/ionic-storage";

export interface ServerConfig {
    baseUrl: string;
    isCustom: boolean;
}

const DEFAULT_DOMAIN = (() => {
    const apiUrl = (import.meta as any)?.env?.VITE_API_URL as string | undefined;
    if (apiUrl) {
        try {
            const u = new URL(apiUrl);
            return `${u.protocol}//${u.host}`;
        } catch {}
    }
    return "https://icube-space.ru";
})();
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
        }

        this.config = {
            baseUrl: DEFAULT_DOMAIN,
            isCustom: false,
        };
        return this.config;
    }

    public async setConfig(config: ServerConfig): Promise<void> {
        try {
            await storage.set(STORAGE_KEY, config);
            this.config = config;
        } catch (error) {
            throw error;
        }
    }

    public async resetToDefault(): Promise<void> {
        const defaultConfig: ServerConfig = {
            baseUrl: DEFAULT_DOMAIN,
            isCustom: false,
        };
        await this.setConfig(defaultConfig);
    }

    public async getDomain(): Promise<string> {
        const config = await this.getConfig();
        return this.formatUrl(config.baseUrl);
    }

    public async getApiBaseUrl(): Promise<string> {
        const domain = await this.getDomain();
        return this.appendPath(domain, "/api");
    }

    public async getKeycloakBaseUrl(): Promise<string> {
        const domain = await this.getDomain();
        return this.appendPath(domain, "/kc");
    }

    public async isCustomConfig(): Promise<boolean> {
        const config = await this.getConfig();
        return config.isCustom;
    }

    public validateUrl(url: string): boolean {
        try {
            const formatted = this.formatUrl(url);
            new URL(formatted);
            return true;
        } catch {
            return false;
        }
    }

    public formatUrl(url: string): string {
        let formatted = url.trim().replace(/\/$/, "");
        
        if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
            formatted = "https://" + formatted;
        }
        
        return formatted;
    }

    public getDefaultUrl(): string {
        return DEFAULT_DOMAIN;
    }

    public isDefaultUrl(url: string): boolean {
        const formattedUrl = this.formatUrl(url);
        const formattedDefault = this.formatUrl(DEFAULT_DOMAIN);
        return formattedUrl === formattedDefault;
    }

    public getApiBaseUrlFromDomain(domain: string): string {
        return this.appendPath(this.formatUrl(domain), "/api");
    }

    public getKeycloakBaseUrlFromDomain(domain: string): string {
        return this.appendPath(this.formatUrl(domain), "/kc");
    }

    private appendPath(base: string, path: string): string {
        const trimmedBase = base.replace(/\/$/, "");
        const trimmedPath = path.startsWith("/") ? path : `/${path}`;
        return `${trimmedBase}${trimmedPath}`;
    }
}

export const serverConfigManager = ServerConfigManager.getInstance();
