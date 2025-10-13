function toBase64Url(input: ArrayBuffer): string {
    const bytes = new Uint8Array(input);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function generateCodeVerifier(length = 64): Promise<string> {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);
    let result = "";
    for (let i = 0; i < randomValues.length; i++) {
        result += charset[randomValues[i] % charset.length];
    }
    return result;
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
    const enc = new TextEncoder();
    const data = enc.encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return toBase64Url(digest);
}

export const PKCE_KEYS = {
    verifier: 'pkce_verifier',
    state: 'pkce_state',
} as const;


