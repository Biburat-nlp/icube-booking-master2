export function getFullUrl(path: string): string {
    const base = import.meta.env.VITE_URL;
    const trimmedBase = (base || "").replace(/\/+$/, "");
    if (/^https?:\/\//i.test(path)) return path;

    const cleanedPath = (path || "").replace(/^\/+/, "");

    const normalizedPath = cleanedPath.startsWith("media/")
        ? cleanedPath
        : `media/${cleanedPath}`;

    return `${trimmedBase}/${normalizedPath}`;
}
