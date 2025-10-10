import { useState, useEffect } from "react";

import { api } from "@/shared/api/api.ts";

interface Vertex {
    id: number;
    center_x: number;
    center_y: number;
    work_space: number;
}

/**
 * Хук для получения маршрута между двумя вершинами.
 * @param startVertex ID стартовой вершины
 * @param endVertex ID конечной вершины
 * @param viewBoxHeight Высота SVG (для инверсии Y)
 * @returns { routePoints: number[]; loading: boolean; error: Error | null }
 */

export function useRoute(startVertex: number | null, endVertex: number | null, viewBoxHeight: number) {
    const [routePoints, setRoutePoints] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!startVertex || !endVertex || viewBoxHeight <= 0) {
            setRoutePoints([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        api.get(`/nav/calc-route/?start_vertex=${startVertex}&end_vertex=${endVertex}`)
            .then((response) => {
                const verts: Vertex[] = response.data.vertices;
                const pts = verts.map((v) => [v.center_x, viewBoxHeight - v.center_y]).flat();
                setRoutePoints(pts);
            })
            .catch((err) => {
                console.error("Error fetching route:", err);
                setError(err);
                setRoutePoints([]);
            })
            .finally(() => setLoading(false));
    }, [startVertex, endVertex, viewBoxHeight]);

    return { routePoints, loading, error };
}
