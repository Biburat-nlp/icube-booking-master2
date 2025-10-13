import axios, { type AxiosError, type AxiosRequestHeaders } from "axios";
import { Capacitor } from "@capacitor/core";

import { keycloak, KEYS } from "@/features/auth/keycloak.ts";
import { storage } from "@/shared/lib/ionic-storage";
import { serverConfigManager } from "@/shared/config/serverConfig.ts";
import { capacitorHttpClient } from "./capacitorHttp.ts";

import { notifyError } from "@/shared/utils/error/errorNotifier.ts";


export const createApiInstance = async () => {
    const baseURL = await serverConfigManager.getBaseUrl();
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

// Универсальный API клиент - используем axios везде для лучшей совместимости
export const universalApi = {
    async get<T = any>(url: string, params?: Record<string, any>) {
        console.log('universalApi.get:', url, 'Platform:', Capacitor.isNativePlatform() ? 'Native' : 'Web');
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

export const updateApiBaseUrl = async (newBaseUrl: string) => {
    api.defaults.baseURL = newBaseUrl;
};

api.interceptors.request.use(async (config) => {
    console.log('API Request:', config.url, 'Token available:', !!keycloak.token);
    let token = keycloak.token;
    if (!token && Capacitor.isNativePlatform()) {
        try {
            await storage.create();
            const stored = await storage.get(KEYS.token);
            if (stored && typeof stored === 'string') {
                token = stored;
                console.log('API Request: using token from storage');
            }
        } catch (e) {
            console.warn('API Request: failed to read token from storage', e);
        }
    }
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
        console.log('Authorization header added');
    } else {
        console.warn('No token available for request:', config.url);
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
        
        console.log('API Response Error:', status, error.config?.url, 'Token available:', !!keycloak.token);

        if (status === 401 && originalRequest) {
            if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
                await keycloak.logout();
                return Promise.reject(error);
            }

            refreshAttempts += 1;

            try {
                const refreshed = await keycloak.updateToken(30);
                if (refreshed) {
                    refreshAttempts = 0;
                    originalRequest.headers = {
                        ...originalRequest.headers,
                        Authorization: `Bearer ${keycloak.token}`,
                    } as AxiosRequestHeaders;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                await keycloak.logout();
                return Promise.reject(refreshError);
            }
        }

        const errorMessage = (error as any)?.response?.data?.detail?.errors?.[0]?.message || error.message || "Ошибка";
        notifyError(errorMessage);

        return Promise.reject(error);
    }
);
