import type { ROUTES_FIELD } from "@/app/router/constants.ts";

export const getRouteLabel = (routes: typeof ROUTES_FIELD, path: string) => {
    const current = Object.keys(routes).find((key) => routes[key as keyof typeof routes].path === path);

    return current ? routes[current].label : null;
};
