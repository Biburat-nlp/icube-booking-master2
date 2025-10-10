import React from "react";
import { Circle } from "react-konva";
import { useImage } from "react-konva-utils";

import type { ReservationPoint } from "@/shared/ui/ReservationsMap/ReservationsMap.tsx";

interface ReservationCircleProps {
    res: ReservationPoint;
    viewBoxHeight: number;
    circleProps?: {
        radius?: number;
        stroke?: string;
        strokeWidth?: number;
    };
    onReservationClick: (type?: "update" | "create", value?: any) => void;
}

export const ReservationCircle = ({ res, viewBoxHeight, circleProps, onReservationClick }: ReservationCircleProps) => {
    const [avatarImage] = useImage(res.avatar || "");
    const avatarRadius = 24;
    const avatarSize = 28;

    const handleReservationClick = () => {
        if (res.free) {
            onReservationClick("create", res);
        } else if (res.myReserve) {
            onReservationClick("update", res);
        }
    };

    if (avatarImage) {
        return (
            <Circle
                x={res.x}
                y={viewBoxHeight - res.y}
                radius={avatarRadius}
                width={avatarSize}
                height={avatarSize}
                fillPatternImage={avatarImage}
                fillPatternOffset={{
                    x: avatarImage.width! / 2,
                    y: avatarImage.height! / 2,
                }}
                fillPatternScale={{
                    x: (avatarRadius * 1.2) / avatarImage.width!,
                    y: (avatarRadius * 1.2) / avatarImage.height!,
                }}
                fillPatternRepeat="no-repeat"
                stroke={circleProps?.stroke}
                strokeWidth={2}
                onTap={handleReservationClick}
                hitStrokeWidth={circleProps?.strokeWidth ?? 10}
            />
        );
    }

    return (
        <Circle
            x={res.x}
            y={viewBoxHeight - res.y}
            radius={circleProps?.radius ?? 8}
            fill={circleProps?.stroke}
            strokeWidth={circleProps?.strokeWidth}
            onTap={handleReservationClick}
            hitStrokeWidth={circleProps?.strokeWidth ?? 10}
        />
    );
};
