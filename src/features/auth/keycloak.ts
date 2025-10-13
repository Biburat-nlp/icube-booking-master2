import { Capacitor } from "@capacitor/core";
import Keycloak from "keycloak-js";

import { storage } from "@/shared/lib/ionic-storage";

import type { KeycloakInitOptions } from "keycloak-js";

export const KEYS = {
    token: "kc_token",
    refresh: "kc_refresh_token",
    id: "kc_id_token",
    skew: "kc_time_skew",
    exp: "kc_access_exp",
    refreshExp: "kc_refresh_exp",
} as const;

export const keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const initKeycloak = async (): Promise<boolean> => {
    await storage.create();

    // Логируем переменные окружения для отладки
    console.log('VITE_KEYCLOAK_URL:', import.meta.env.VITE_KEYCLOAK_URL);
    console.log('VITE_KEYCLOAK_REALM:', import.meta.env.VITE_KEYCLOAK_REALM);
    console.log('VITE_KEYCLOAK_CLIENT_ID:', import.meta.env.VITE_KEYCLOAK_CLIENT_ID);

    const redirectUri = Capacitor.isNativePlatform() 
        ? (import.meta.env.VITE_MOBILE_SCHEME || "icube://token")
        : (import.meta.env.VITE_MOBILE_SCHEME || "icube://token");
    
    console.log('Platform:', Capacitor.isNativePlatform() ? 'Native' : 'Web');
    console.log('Redirect URI:', redirectUri);
    console.log('Current URL:', window.location.href);

    // Проверяем, есть ли сохраненный callback URL от предыдущей сессии
    const savedCallbackUrl = sessionStorage.getItem('keycloak_callback_url');
    if (savedCallbackUrl) {
        console.log('Found saved callback URL:', savedCallbackUrl);
        sessionStorage.removeItem('keycloak_callback_url');
    }

    const [token, refreshToken, idToken, skew, accessExp] = await Promise.all([
        storage.get(KEYS.token),
        storage.get(KEYS.refresh),
        storage.get(KEYS.id),
        storage.get(KEYS.skew),
        storage.get(KEYS.exp),
    ]);

    const haveTokens = !!token && !!refreshToken;

    let options: KeycloakInitOptions;

    if (haveTokens) {
        // Проверяем валидность токенов перед использованием
        try {
            // Простая проверка формата JWT токена
            if (token && token.split('.').length === 3) {
                options = {
                    token,
                    refreshToken,
                    idToken,
                    timeSkew: skew ? Number(skew) : undefined,
                    checkLoginIframe: false,
                    redirectUri,
                };
            } else {
                // Токен невалидный, очищаем хранилище
                await storage.clear();
                options = {
                    checkLoginIframe: false,
                    redirectUri            
                };
            }
        } catch (error) {
            console.error('Invalid token format, clearing storage:', error);
            await storage.clear();
            options = {
                checkLoginIframe: false,
                redirectUri            
            };
        }
    } else {
        options = {
            checkLoginIframe: false,
            redirectUri            
        };
    }

    if (Capacitor.isNativePlatform()) {
        options = {
            ...options,
            adapter: 'cordova-native',
            // Добавляем обработку callback URL для iOS
            onLoad: 'check-sso',
            // Отключаем проверку iframe для мобильных платформ
            checkLoginIframe: false,
            // Отключаем проверку iframe для обновления токенов
            checkLoginIframeInterval: 0
        }
    }

    try {
        const authenticated = await keycloak.init(options);
        
        console.log('Keycloak initialized:', authenticated);
        console.log('Token after init:', !!keycloak.token);
        console.log('Token value:', keycloak.token ? keycloak.token.substring(0, 20) + '...' : 'null');

        // Если есть сохраненный callback URL, пытаемся обработать его
        if (savedCallbackUrl && !authenticated) {
            console.log('Attempting to process saved callback URL...');
            try {
                const callbackUrl = new URL(savedCallbackUrl);
                if (callbackUrl.searchParams.has('code') && callbackUrl.searchParams.has('state')) {
                    // Для мобильных платформ используем специальную обработку callback
                    if (Capacitor.isNativePlatform()) {
                        // Извлекаем параметры из callback URL
                        const code = callbackUrl.searchParams.get('code');
                        const state = callbackUrl.searchParams.get('state');
                        
                        if (code && state) {
                            console.log('Processing OAuth callback with code and state');
                            // Keycloak должен автоматически обработать эти параметры
                            // при следующей инициализации с правильными настройками
                        }
                    }
                }
            } catch (callbackError) {
                console.error('Error processing saved callback URL:', callbackError);
            }
        }

        if (authenticated && haveTokens && accessExp) {
            const msLeft = Number(accessExp) - Date.now();
            console.log('Token expires in:', msLeft, 'ms');
            if (msLeft < 60000) {
                try {
                    console.log('Refreshing token...');
                    await keycloak.updateToken(60);
                    console.log('Token refreshed successfully');
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    // Не пытаемся автоматически логиниться, пусть пользователь сделает это вручную
                }
            }
        }

        return authenticated;
    } catch (error) {
        console.error('Keycloak initialization error:', error);
        // Очищаем хранилище при ошибке инициализации
        await storage.clear();
        return false;
    }
};
