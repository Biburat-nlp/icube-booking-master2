import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Stage, Layer, Circle, Line, Image as KonvaImage } from "react-konva";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import useImage from "use-image";

import { InfoPopup } from "@/features/navigation/ui/InfoPopup.tsx";
import { NavigationControls } from "@/features/navigation/ui/NavigationControls.tsx";
import { RouteLayer } from "@/features/navigation/ui/RouteLayer";

import s from "./NavigationMap.module.scss";

interface Props {
    dims: { width: number; height: number };
    theme: string;
    nativeImage?: HTMLImageElement | null;
    viewWelcomeMessage: boolean;
    viewBox: [number, number];
    userCoords: [number, number] | null;
    userAvatarUrl?: string;
    roomPolygon: number[];
    routePoints: number[];
    onInitTransform: any;
    stageRef: React.RefObject<any>;
    activeUserImg: string | null;
    onBuildRoute: () => void;
    isRoomMode: boolean;
    userData: Record<"title" | "officeTitle" | "floorTitle" | "workspaceTitle" | "roomTitle", string>;
    roomData: Record<"title", string>;
}

export const NavigationMap = ({
    dims,
    theme,
    nativeImage,
    viewWelcomeMessage,
    viewBox,
    userCoords,
    roomPolygon,
    routePoints,
    onInitTransform,
    stageRef,
    activeUserImg,
    onBuildRoute,
    isRoomMode,
    userData,
    roomData,
}: Props) => {
    const [isActiveRoute, setIsActiveRoute] = useState<boolean>(false);
    const [avatarImage] = useImage(activeUserImg || "");
    const avatarRadius = 24;

    const { t } = useTranslation();

    const POPUP_W = 260;
    const POPUP_H = isRoomMode ? 50 : 150;

    const [popup, setPopup] = useState<{
        x: number;
        y: number;
        visible: boolean;
    }>({ x: 0, y: 0, visible: false });

    const handleShowPopup = useCallback((e: any) => {
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();

        if (pointer && !popup.visible) {
            setPopup({ x: pointer.x, y: pointer.y, visible: true });
        }
    }, []);

    const handleStageClick = useCallback(() => {
        if (popup.visible) {
            setPopup({ ...popup, visible: false });
        }
    }, [popup]);

    const handleBuildRoute = useCallback(() => {
        onBuildRoute && onBuildRoute();
        setIsActiveRoute(true);
    }, [onBuildRoute]);

    useEffect(() => {
        setIsActiveRoute(false);
    }, [onBuildRoute]);

    return (
        <div
            style={{
                width: dims.width,
                height: dims.height,
                overflow: "visible",
                position: "relative",
                backgroundColor: theme === "dark" ? "var(--icube-dark-bg)" : "var(--icube-very-light-grey)",
            }}
        >
            {!nativeImage && viewWelcomeMessage && (
                <div className={s.welcomeBlock}>
                    <h3>{t(`${isRoomMode ? "find_room_page" : "find_colleague_page"}:greeting_modal:title`)}</h3>
                    <p>{t(`${isRoomMode ? "find_room_page" : "find_colleague_page"}:greeting_modal:text`)}</p>
                </div>
            )}
            {nativeImage && viewBox[0] > 0 && viewBox[1] > 0 && (
                <TransformWrapper
                    centerOnInit
                    minScale={0.3}
                    maxScale={5}
                    limitToBounds={false}
                    onInit={onInitTransform}
                >
                    {({ zoomIn, zoomOut }) => (
                        <>
                            <NavigationControls
                                onZoomIn={() => zoomIn()}
                                onZoomOut={() => zoomOut()}
                            />
                            <TransformComponent wrapperStyle={{ width: dims.width, height: dims.height }}>
                                <Stage
                                    ref={stageRef}
                                    width={viewBox[0] + POPUP_W}
                                    height={viewBox[1] + POPUP_H}
                                    onTap={handleStageClick}
                                >
                                    <Layer visible>
                                        <KonvaImage
                                            image={nativeImage as any}
                                            width={viewBox[0]}
                                            height={viewBox[1]}
                                            fill={theme === "dark" ? "transparent" : "#949494FF"}
                                        />

                                        {userCoords && avatarImage && (
                                            <Circle
                                                x={userCoords[0]}
                                                y={viewBox[1] - userCoords[1]}
                                                radius={avatarRadius}
                                                fillPatternImage={avatarImage as any}
                                                fillPatternOffset={{
                                                    x: avatarImage.width! / 2,
                                                    y: avatarImage.height! / 2,
                                                }}
                                                fillPatternScale={{
                                                    x: (avatarRadius * 2) / avatarImage.width!,
                                                    y: (avatarRadius * 2) / avatarImage.height!,
                                                }}
                                                fillPatternRepeat="no-repeat"
                                                stroke="white"
                                                strokeWidth={4}
                                                onTap={(e) => {
                                                    handleShowPopup(e);
                                                }}
                                            />
                                        )}

                                        {userCoords && !avatarImage && (
                                            <Circle
                                                x={userCoords[0]}
                                                y={viewBox[1] - userCoords[1]}
                                                radius={8}
                                                fill="blue"
                                                onTap={(e) => {
                                                    handleShowPopup(e);
                                                }}
                                            />
                                        )}

                                        {roomPolygon.length > 0 && (
                                            <Line
                                                points={roomPolygon}
                                                closed
                                                fill="rgba(255,0,0,0.5)"
                                                onTap={(e) => {
                                                    handleShowPopup(e);
                                                }}
                                            />
                                        )}

                                        {isActiveRoute && <RouteLayer points={routePoints} />}
                                    </Layer>
                                    <Layer>
                                        {popup.visible &&
                                            (isRoomMode
                                                ? roomPolygon && (
                                                      <InfoPopup
                                                          x={roomPolygon[2]}
                                                          y={viewBox[1] - roomPolygon[7]}
                                                          onBuildRoute={handleBuildRoute}
                                                          popupData={roomData}
                                                          isRoomMode
                                                      />
                                                  )
                                                : userCoords && (
                                                      <InfoPopup
                                                          x={userCoords[0]}
                                                          y={viewBox[1] - userCoords[1] + POPUP_H / 2}
                                                          onBuildRoute={handleBuildRoute}
                                                          popupData={userData}
                                                      />
                                                  ))}
                                    </Layer>
                                </Stage>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            )}
        </div>
    );
};
