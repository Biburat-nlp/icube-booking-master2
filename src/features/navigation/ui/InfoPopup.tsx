import React from "react";
import { Group, Text, Rect, Line, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { useTranslation } from "react-i18next";

import arrowUrl from "@/shared/icons/BuildRouteIcon.svg";

interface InfoPopupProps {
    x: number;
    y: number;
    onBuildRoute: () => void;
    popupData: any;
    isRoomMode?: boolean;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ x, y, onBuildRoute, popupData, isRoomMode }) => {
    const { t } = useTranslation();
    const [arrowImg] = useImage(arrowUrl);

    const { title, officeTitle, floorTitle, workspaceTitle, roomTitle } = popupData;

    const WIDTH = 260;
    const BODY_HEIGHT = isRoomMode ? 50 : 150;
    const BUTTON_Y = BODY_HEIGHT + 22;

    return (
        <Group
            x={x - WIDTH / 2}
            y={y - BODY_HEIGHT * 2}
            zIndex={2}
        >
            <Rect
                width={WIDTH}
                height={BODY_HEIGHT + 60}
                cornerRadius={8}
                fill="rgba(54, 55, 63, 1)"
                opacity={0.9}
                onClick={onBuildRoute}
                onTap={onBuildRoute}
            />
            <Text
                text={[title, officeTitle, floorTitle, workspaceTitle, roomTitle].filter(Boolean).join("\n")}
                fontSize={14}
                lineHeight={1.5}
                fill="#fff"
                padding={8}
                width={260 - 24}
            />
            <Line
                points={[0 + 8, BODY_HEIGHT + 20, WIDTH - 8, BODY_HEIGHT + 20]}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={1}
            />

            <Group
                x={8}
                y={BUTTON_Y}
                onTap={onBuildRoute}
                zIndex={1}
            >
                <Text
                    text={t("navigation:build_route")}
                    fontSize={14}
                    x={0}
                    y={10}
                    fill="#FFF"
                />
                {arrowImg && (
                    <KonvaImage
                        image={arrowImg}
                        x={WIDTH - 32}
                        y={8}
                        width={16}
                        height={16}
                    />
                )}
            </Group>
        </Group>
    );
};
