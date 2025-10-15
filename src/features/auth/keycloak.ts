import { Capacitor } from "@capacitor/core";
import Keycloak from "keycloak-js";

import { storage } from "@/shared/lib/ionic-storage";
import { serverConfigManager } from "@/shared/config/serverConfig.ts";

import type { KeycloakInitOptions } from "keycloak-js";

export const KEYS = {
    token: "kc_token",
    refresh: "kc_refresh_token",
    id: "kc_id_token",
    skew: "kc_time_skew",
    exp: "kc_access_exp",
    refreshExp: "kc_refresh_exp",
} as const;

let currentKcBase: string | null = null;
export let keycloak: Keycloak | null = null;

export const prepareKeycloak = async (): Promise<Keycloak> => {
    const kcBase = await serverConfigManager.getKeycloakBaseUrl();
    if (!keycloak || currentKcBase !== kcBase) {
        keycloak = new Keycloak({
            url: kcBase,
            realm: import.meta.env.VITE_KEYCLOAK_REALM,
            clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
        });
        currentKcBase = kcBase;
    }
    return keycloak;
};

export const initKeycloak = async (): Promise<boolean> => {
    await storage.create();
    const kc = await prepareKeycloak();

    const redirectUri = Capacitor.isNativePlatform() 
        ? (import.meta.env.VITE_MOBILE_SCHEME || "icube://token")
        : (import.meta.env.VITE_BASE_URL || window.location.origin);

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
        try {
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
                await storage.clear();
                options = {
                    checkLoginIframe: false,
                    redirectUri            
                };
            }
        } catch (error) {
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

    options = {
        ...options,
        checkLoginIframe: false,
        flow: 'standard'
    };

    try {
        const authenticated = await kc.init(options);

        if (authenticated && haveTokens && accessExp) {
            const msLeft = Number(accessExp) - Date.now();
            if (msLeft < 60000) {
                try {
                    await kc.updateToken(60);
                } catch (error) {
                }
            }
        }

        return authenticated;
    } catch (error) {
        await storage.clear();
        return false;
    }
};

export async function exchangeCodeForTokens(code: string, redirectUri: string): Promise<void> {
    const { serverConfigManager } = await import("@/shared/config/serverConfig.ts");
    const kcBase = await serverConfigManager.getKeycloakBaseUrl();
    const tokenUrl = `${kcBase}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', import.meta.env.VITE_KEYCLOAK_CLIENT_ID);
    body.set('code', code);
    body.set('redirect_uri', redirectUri);
    
    try {
    const { Preferences } = await import('@capacitor/preferences');
    const { PKCE_KEYS } = await import('./pkce');
        const { value: verifier } = await Preferences.get({ key: PKCE_KEYS.verifier });
    const { value: challengeSaved } = await Preferences.get({ key: PKCE_KEYS.challenge });
        if (verifier) {
            body.set('code_verifier', verifier);
        }
    } catch {}

    const resp = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });
    if (!resp.ok) {
        await resp.text();
        throw new Error(`Token exchange failed: ${resp.status}`);
    }
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

    const kc = await prepareKeycloak();
    kc.token = data.access_token;
    kc.refreshToken = data.refresh_token;
    kc.idToken = data.id_token;
    kc.authenticated = true;

    try {
        const { Preferences } = await import('@capacitor/preferences');
        const { PKCE_KEYS } = await import('./pkce');
        await Preferences.remove({ key: PKCE_KEYS.verifier });
        await Preferences.remove({ key: PKCE_KEYS.state });
    } catch {}
}
