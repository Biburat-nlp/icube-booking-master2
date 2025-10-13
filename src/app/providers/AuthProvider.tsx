import React, { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

import { initKeycloak, keycloak, KEYS } from "@/features/auth/keycloak";
import { generateCodeVerifier, generateCodeChallenge, PKCE_KEYS } from "@/features/auth/pkce";
import { Preferences } from '@capacitor/preferences';

import { usersApi } from "@/entities/users/api/api.ts";

import { storage } from "@/shared/lib/ionic-storage";
import type { TUser } from "@/shared/types/user";
import { InAppBrowser, DefaultSystemBrowserOptions } from '@capacitor/inappbrowser';
import { Capacitor } from "@capacitor/core";

export interface IAuthContextType {
    isLoading: boolean;
    user: TUser | null;
    login: (to: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

type TProps = {
    children: ReactNode;
};

const AuthContext = createContext<IAuthContextType | null>(null);

export const AuthProvider = ({ children }: TProps) => {
    const history = useHistory();
    const queryClient = useQueryClient();
    const mountedRef = useRef(true);

    const [user, setUser] = useState<TUser | null>(null);
    const [isLoading, setLoad] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const me = await usersApi.me();
            setUser(me);
        } catch (e) {
            console.error("Не удалось обновить профиль:", e);
        }
    }, []);

    const persistTokens = useCallback(async () => {
        await Promise.all([
            storage.set(KEYS.token, keycloak.token),
            storage.set(KEYS.refresh, keycloak.refreshToken),
            storage.set(KEYS.id, keycloak.idToken),
            storage.set(KEYS.skew, keycloak.timeSkew),

            keycloak.tokenParsed?.exp && storage.set(KEYS.exp, keycloak.tokenParsed.exp * 1_000),
            keycloak.refreshTokenParsed?.exp && storage.set(KEYS.refreshExp, keycloak.refreshTokenParsed.exp * 1_000),
        ]);

        refreshUser();
    }, []);

    const login = useCallback(async (redirect: string) => {
        sessionStorage.setItem("kc_redirect_path", redirect);
        
        const redirectUri = Capacitor.isNativePlatform() 
            ? (import.meta.env.VITE_MOBILE_SCHEME || "icube://token")
            : (import.meta.env.VITE_BASE_URL || window.location.href);
        
        console.log('AuthProvider - Platform:', Capacitor.isNativePlatform() ? 'Native' : 'Web');
        console.log('AuthProvider - Redirect URI:', redirectUri);
        
        if (Capacitor.isNativePlatform()) {
            // Генерируем PKCE и state для ручного auth-запроса
            const verifier = await generateCodeVerifier();
            const challenge = await generateCodeChallenge(verifier);
            const state = await generateCodeVerifier(32);
            // Очистим старые значения
            await Preferences.remove({ key: PKCE_KEYS.verifier });
            await Preferences.remove({ key: PKCE_KEYS.state });
            await Preferences.remove({ key: PKCE_KEYS.challenge });
            await Preferences.remove({ key: PKCE_KEYS.redirectUri });

            await Preferences.set({ key: PKCE_KEYS.verifier, value: verifier });
            await Preferences.set({ key: PKCE_KEYS.state, value: state });
            await Preferences.set({ key: PKCE_KEYS.redirectUri, value: redirectUri });

            const base = `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/auth`;
            const qs = new URLSearchParams({
                client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
                redirect_uri: redirectUri,
                response_type: 'code',
                response_mode: 'query',
                scope: 'openid',
                state,
                code_challenge: challenge,
                code_challenge_method: 'S256',
            }).toString();
            await Preferences.set({ key: PKCE_KEYS.challenge, value: challenge });
            console.log('PKCE prepare:', { verifierLen: verifier.length, challenge: challenge.substring(0,4) + '...' + challenge.slice(-4), state: state.substring(0,4) + '...' + state.slice(-4) });
            const authUrl = `${base}?${qs}`;

            await InAppBrowser.openInSystemBrowser({ url: authUrl, options: DefaultSystemBrowserOptions });
        } else {
            await keycloak.login({ redirectUri });
        }        
    }, []);

    const logout = useCallback(async () => {
        setLoad(true);
        try {
        if (Capacitor.isNativePlatform()) {
            const url = await keycloak.createLogoutUrl();
            await InAppBrowser.openInSystemBrowser({
                url,
                options: DefaultSystemBrowserOptions
            });
        } else {
            await keycloak.logout();
        }
            
            setUser(null);
            queryClient.clear();
            await storage.clear();
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            mountedRef.current && setLoad(false);
        }
    }, [history, queryClient]);

    useEffect(() => {
        const boot = async () => {
            setLoad(true);
            try {
                const ok = await initKeycloak();

                if (ok && keycloak.token) {
                    const me = await usersApi.me();
                    if (mountedRef.current) setUser(me);

                    await persistTokens();
                    keycloak.onAuthSuccess = persistTokens;
                    keycloak.onAuthRefreshSuccess = persistTokens;
                }
            } catch (e) {
                console.error("Auth init error:", e);
            } finally {
                mountedRef.current && setLoad(false);
            }
        };

        boot();

        return () => {
            mountedRef.current = false;
        };
    }, [persistTokens]);

    return (
        <AuthContext.Provider value={{ isLoading, user, login, logout, refreshUser }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): IAuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
