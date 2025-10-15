import axios, { type AxiosError, type AxiosRequestHeaders } from "axios";
import { Capacitor } from "@capacitor/core";

import { keycloak, prepareKeycloak, KEYS } from "@/features/auth/keycloak.ts";
import { storage } from "@/shared/lib/ionic-storage";
import { serverConfigManager } from "@/shared/config/serverConfig.ts";
import { capacitorHttpClient } from "./capacitorHttp.ts";

import { notifyError } from "@/shared/utils/error/errorNotifier.ts";


export const createApiInstance = async () => {
    const baseURL = await serverConfigManager.getApiBaseUrl();
    return axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const universalApi = {
    async get<T = any>(url: string, params?: Record<string, any>) {
        return api.get<T>(url, { params });
    },

    async post<T = any>(url: string, data?: any, params?: Record<string, any>) {
        return api.post<T>(url, data, { params });
    },

    async put<T = any>(url: string, data?: any, params?: Record<string, any>) {
        return api.put<T>(url, data, { params });
    },

    async delete<T = any>(url: string, params?: Record<string, any>) {
        return api.delete<T>(url, { params });
    },

    async patch<T = any>(url: string, data?: any, params?: Record<string, any>) {
        return api.patch<T>(url, data, { params });
    }
};

export const updateApiBaseUrl = async (domainOrApiBase: string) => {
    let base = domainOrApiBase;
    try {
        const url = new URL(domainOrApiBase);
        const hasApiPath = /\/api(\/|$)/.test(url.pathname);
        if (!hasApiPath) {
            const trimmed = url.origin;
            base = `${trimmed}/api`;
        }
    } catch {
        
    }
    api.defaults.baseURL = base;
};

api.interceptors.request.use(async (config) => {
    const kc = keycloak ?? await prepareKeycloak();
    let token = kc.token;
    if (!token && Capacitor.isNativePlatform()) {
        try {
            await storage.create();
            const stored = await storage.get(KEYS.token);
            if (stored && typeof stored === 'string') {
                token = stored;
            }
        } catch (e) {
            
        }
    }
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
    }
    return config;
});

let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 1;

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 401 && originalRequest) {
            if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
                const kc = keycloak ?? await prepareKeycloak();
                await kc.logout();
                return Promise.reject(error);
            }

            refreshAttempts += 1;

            try {
                const kc = keycloak ?? await prepareKeycloak();
                const refreshed = await kc.updateToken(30);
                if (refreshed) {
                    refreshAttempts = 0;
                    originalRequest.headers = {
                        ...originalRequest.headers,
                        Authorization: `Bearer ${kc.token}`,
                    } as AxiosRequestHeaders;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                const kc = keycloak ?? await prepareKeycloak();
                await kc.logout();
                return Promise.reject(refreshError);
            }
        }

        const errorMessage = (error as any)?.response?.data?.detail?.errors?.[0]?.message || error.message || "Ошибка";
        notifyError(errorMessage);

        return Promise.reject(error);
    }
);
