import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

import { keycloak, prepareKeycloak } from '@/features/auth/keycloak';

export interface CapacitorHttpRequestOptions {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    data?: any;
    params?: Record<string, any>;
}

export interface CapacitorHttpResponse<T = any> {
    data: T;
    status: number;
    headers: Record<string, string>;
    url: string;
}

export class CapacitorHttpClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async makeRequest<T = any>(options: CapacitorHttpRequestOptions): Promise<CapacitorHttpResponse<T>> {
        const { url, method, headers = {}, data, params } = options;
        
        const kc = keycloak ?? await prepareKeycloak();
        if (kc.token) {
            headers['Authorization'] = `Bearer ${kc.token}`;
            
        } else {
            
        }

        headers['Content-Type'] = 'application/json';
        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

        let finalUrl = fullUrl;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                finalUrl += `?${queryString}`;
            }
        }

        

        try {
            const response = await CapacitorHttp.request({
                url: finalUrl,
                method,
                headers,
                data: data ? JSON.stringify(data) : undefined,
            });

            

            return {
                data: response.data,
                status: response.status,
                headers: response.headers,
                url: response.url,
            };
        } catch (error: any) {
            
            
            if (error.status === 401) {
                try {
                    const kc = keycloak ?? await prepareKeycloak();
                    const refreshed = await kc.updateToken(30);
                    if (refreshed && kc.token) {
                        headers['Authorization'] = `Bearer ${kc.token}`;
                        return this.makeRequest(options);
                    }
                } catch (refreshError) {
                    const kc = keycloak ?? await prepareKeycloak();
                    await kc.logout();
                }
            }
            
            throw error;
        }
    }

    async get<T = any>(url: string, params?: Record<string, any>): Promise<CapacitorHttpResponse<T>> {
        return this.makeRequest<T>({ url, method: 'GET', params });
    }

    async post<T = any>(url: string, data?: any, params?: Record<string, any>): Promise<CapacitorHttpResponse<T>> {
        return this.makeRequest<T>({ url, method: 'POST', data, params });
    }

    async put<T = any>(url: string, data?: any, params?: Record<string, any>): Promise<CapacitorHttpResponse<T>> {
        return this.makeRequest<T>({ url, method: 'PUT', data, params });
    }

    async delete<T = any>(url: string, params?: Record<string, any>): Promise<CapacitorHttpResponse<T>> {
        return this.makeRequest<T>({ url, method: 'DELETE', params });
    }

    async patch<T = any>(url: string, data?: any, params?: Record<string, any>): Promise<CapacitorHttpResponse<T>> {
        return this.makeRequest<T>({ url, method: 'PATCH', data, params });
    }
}

export const capacitorHttpClient = new CapacitorHttpClient(import.meta.env.VITE_API_URL);
