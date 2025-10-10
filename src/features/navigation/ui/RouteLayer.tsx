import React from "react";
import { Line } from "react-konva";

interface RouteLayerProps {
    points: number[];
    strokeColor?: string;
    strokeWidth?: number;
}

export const RouteLayer: React.FC<RouteLayerProps> = ({ points, strokeColor = "#44A6FF", strokeWidth = 4 }) => {
    if (points.length < 4) {
        return null;
    }

    return (
        <Line
            points={points}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            dash={[10, 6]}
            lineCap="round"
            lineJoin="round"
            zIndex={1}
        />
    );
};
