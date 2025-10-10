import { useCallback, useMemo, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

export type CacheValue = Record<string, unknown>;
type RouteKey = string;
type MapCache = Map<RouteKey, CacheValue>;

const cache: MapCache = new Map();

function useQueryParams() {
    const location = useLocation();
    const history = useHistory();

    const actualLocation = location;

    const queryParams = useMemo(() => {
        const searchParams = new URLSearchParams(actualLocation.search);
        const params: Record<string, string> = {};
        for (const [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    }, [actualLocation.search]);

    const setQueryParams = useCallback(
        (params: Record<string, string>) => {
            const searchParams = new URLSearchParams(actualLocation.search);
            Object.entries(params).forEach(([key, value]) => {
                searchParams.set(key, value);
            });
            history.push({
                ...actualLocation,
                search: searchParams.toString(),
            });
        },
        [actualLocation, history]
    );

    return { queryParams, setQueryParams };
}

export function useRouteCache<T extends CacheValue = CacheValue>(routeKey: RouteKey) {
    if (!routeKey) {
        throw new Error("The current routeKey parameter is missing");
    }

    const { queryParams, setQueryParams } = useQueryParams();

    const [localCache, setLocalCache] = useState<T | undefined>(() => {
        let initialCache = cache.get(routeKey) as T | undefined;
        if (!initialCache && Object.keys(queryParams).length > 0) {
            initialCache = queryParams as unknown as T;
            cache.set(routeKey, initialCache);
        }
        return initialCache;
    });

    const pushToRouteCache = useCallback(
        (value: T): void => {
            const existing = cache.get(routeKey) || {};
            const newValue = {
                ...existing,
                ...value,
            };

            cache.set(routeKey, newValue);
            setLocalCache(newValue);

            const newQueryParams: Record<string, string> = {};
            for (const key in newValue) {
                const v = newValue[key];
                if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
                    newQueryParams[key] = String(v);
                }
            }
            setQueryParams(newQueryParams);
        },
        [routeKey, setQueryParams]
    );

    const clearRouteCache = useCallback(() => {
        cache.delete(routeKey);
        setLocalCache(undefined);
    }, [routeKey]);

    const clearCache = useCallback(() => {
        cache.clear();
        setLocalCache(undefined);
    }, []);

    const routeCache = localCache;

    return {
        routeCache,
        pushToRouteCache,
        clearRouteCache,
        clearCache,
    };
}
