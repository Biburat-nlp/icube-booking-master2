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
        : (import.meta.env.VITE_BASE_URL || window.location.origin);
    
    console.log('Platform:', Capacitor.isNativePlatform() ? 'Native' : 'Web');
    console.log('Redirect URI:', redirectUri);
    console.log('Current URL:', window.location.href);

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

    // Общие настройки
    options = {
        ...options,
        checkLoginIframe: false,
        flow: 'standard'
    };

    try {
        const authenticated = await keycloak.init(options);
        
        console.log('Keycloak initialized:', authenticated);
        console.log('Token after init:', !!keycloak.token);
        console.log('Token value:', keycloak.token ? keycloak.token.substring(0, 20) + '...' : 'null');

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

export async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<void> {
    const tokenUrl = `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', import.meta.env.VITE_KEYCLOAK_CLIENT_ID);
    body.set('code', code);
    body.set('redirect_uri', redirectUri);
    // Если использовали PKCE, можно добавить code_verifier из storage
    const codeVerifier = await storage.get('pkce_verifier');
    if (codeVerifier) body.set('code_verifier', codeVerifier);

    const resp = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });
    if (!resp.ok) throw new Error(`Token exchange failed: ${resp.status}`);
    const data = await resp.json();

    await storage.create();
    await Promise.all([
        storage.set(KEYS.token, data.access_token),
        storage.set(KEYS.refresh, data.refresh_token),
        storage.set(KEYS.id, data.id_token),
        storage.set(KEYS.skew, 0),
        data.expires_in && storage.set(KEYS.exp, Date.now() + data.expires_in * 1000),
        data.refresh_expires_in && storage.set(KEYS.refreshExp, Date.now() + data.refresh_expires_in * 1000),
    ]);
}
