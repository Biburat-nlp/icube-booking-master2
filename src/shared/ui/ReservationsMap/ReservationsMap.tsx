import { IonSpinner } from "@ionic/react";
import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Group } from "react-konva";
import { useImage } from "react-konva-utils";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import { useTheme } from "@/app/providers/ThemeProvider.tsx";

import MinusIcon from "@/shared/icons/MinusIcon.svg?react";
import PlusIcon from "@/shared/icons/PlusIcon.svg?react";
import SearchIcon from "@/shared/icons/SearchIcon.svg?react";
import { ReservationCircle } from "@/shared/ui/ReservationsMap/ReservationCircle/ReservationCircle.tsx";

import s from "./ReservationsMap.module.scss";

export interface ReservationPoint {
    id: string | number;
    x: number;
    y: number;
    free: boolean;
    myReserve?: boolean;
    isPartFree?: boolean;
    avatar?: string | null;
}

export interface TProps {
    imageUrl: string | null;
    reservations?: ReservationPoint[];
    circleProps?: {
        radius?: number;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
    };
    onReservationClick: (type?: "update" | "create", value?: any) => void;
    handleMapToggle: () => void;
}

const Controls = ({
    zoomIn,
    zoomOut,
    handleMapToggle,
}: {
    zoomIn: () => void;
    zoomOut: () => void;
    handleMapToggle: () => void;
}) => {
    return (
        <div className={s.controls}>
            <button
                type="button"
                onClick={handleMapToggle}
                className={s.searchButton}
            >
                <SearchIcon className={s.icon} />
            </button>
            <div className={s.sizeActions}>
                <button
                    type="button"
                    onClick={zoomIn}
                    className={s.button}
                >
                    <PlusIcon className={s.icon} />
                </button>
                <button
                    type="button"
                    onClick={zoomOut}
                    className={s.button}
                >
                    <MinusIcon className={s.icon} />
                </button>
            </div>
        </div>
    );
};

export const ReservationsMap = ({ imageUrl, reservations = [], onReservationClick, handleMapToggle }: TProps) => {
    if (!imageUrl) return null;

    const { theme } = useTheme();

    const [resolvedUrl, setResolvedUrl] = useState<string | null>(imageUrl);
    const [nativeImage, status] = useImage(resolvedUrl ?? "");

    const [viewBox, setViewBox] = useState<[number, number]>([0, 0]);

    const [dims, setDims] = useState({
        width: window.innerWidth,
        height: window.innerHeight - 200,
    });

    const stageRef = useRef<any>(null);

    const COLORS = {
        myReserve: "#44A6FF",
        partFree: "#FFA901",
        free: "#7DD836",
        default: "#FF3636",
    };

    useEffect(() => {
        if (!imageUrl) return;

        fetch(imageUrl)
            .then((r) => r.text())
            .then((txt) => {
                const svg = new DOMParser().parseFromString(txt, "image/svg+xml").documentElement;
                if (svg && svg.nodeName.toLowerCase() === "svg") {
                    const blob = new Blob([txt], { type: "image/svg+xml" });
                    const url = URL.createObjectURL(blob);
                    setResolvedUrl(url);
                } else {
                    setResolvedUrl(imageUrl);
                }
                const vb = svg.getAttribute("viewBox");
                if (vb) {
                    const [, , w, h] = vb.split(" ").map(Number);
                    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
                        setViewBox([w, h]);
                        return;
                    }
                }
                const wAttr = Number(svg.getAttribute("width"));
                const hAttr = Number(svg.getAttribute("height"));
                if (Number.isFinite(wAttr) && Number.isFinite(hAttr) && wAttr > 0 && hAttr > 0) {
                    setViewBox([wAttr, hAttr]);
                    return;
                }
                if (nativeImage && (nativeImage as any).naturalWidth && (nativeImage as any).naturalHeight) {
                    setViewBox([(nativeImage as any).naturalWidth, (nativeImage as any).naturalHeight]);
                } else {
                    setViewBox([0, 0]);
                }
            })
            .catch(() => {
                setResolvedUrl(imageUrl);
                if (nativeImage && (nativeImage as any).naturalWidth && (nativeImage as any).naturalHeight) {
                    setViewBox([(nativeImage as any).naturalWidth, (nativeImage as any).naturalHeight]);
                } else {
                    setViewBox([0, 0]);
                }
            });
        return () => {
            if (resolvedUrl && resolvedUrl.startsWith("blob:")) {
                URL.revokeObjectURL(resolvedUrl);
            }
        };
    }, [imageUrl]);

    useEffect(() => {
        if (status === "loaded" && viewBox[0] === 0 && nativeImage) {
            const w = (nativeImage as any).naturalWidth ?? 0;
            const h = (nativeImage as any).naturalHeight ?? 0;
            if (w > 0 && h > 0) {
                setViewBox([w, h]);
            }
        }
    }, [status, nativeImage, viewBox]);

    const isReady = viewBox[0] > 0 && viewBox[1] > 0 && dims.width > 0 && dims.height > 0;

    return (
        <div
            style={{
                position: "relative",
                width: dims.width,
                height: dims.height,
            }}
        >
            {!isReady ? (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <IonSpinner name="crescent" />
                </div>
            ) : (
                <TransformWrapper
                    minScale={0.3}
                    maxScale={2}
                    centerOnInit
                    onInit={(utils) => {
                        const { centerView, zoomToElement, setTransform } = utils;

                        if (viewBox[0] > 0 && viewBox[1] > 0 && dims.width > 0 && dims.height > 0) {
                            const scaleX = dims.width / viewBox[0];
                            const scaleY = dims.height / viewBox[1];
                            const scale = Math.min(scaleX, scaleY) * 0.9;

                            const offsetX = (dims.width - viewBox[0] * scale) / 2;
                            const offsetY = (dims.height - viewBox[1] * scale) / 2;

                            setTransform(offsetX, offsetY, scale, scale);
                        }
                    }}
                >
                    {({ zoomIn, zoomOut }) => (
                        <>
                            <Controls
                                zoomIn={() => zoomIn()}
                                zoomOut={() => zoomOut()}
                                handleMapToggle={handleMapToggle}
                            />
                            <TransformComponent wrapperStyle={{ width: dims.width, height: dims.height }}>
                                <div
                                    style={{
                                        width: viewBox[0],
                                        height: viewBox[1],
                                        position: "relative",
                                    }}
                                >
                                    <Stage
                                        ref={stageRef}
                                        width={viewBox[0]}
                                        height={viewBox[1]}
                                    >
                                        {!!nativeImage && (
                                            <Layer>
                                                <KonvaImage
                                                    image={nativeImage}
                                                    width={viewBox[0]}
                                                    height={viewBox[1]}
                                                    fill={theme === "dark" ? "transparent" : "#949494FF"}
                                                />
                                            </Layer>
                                        )}
                                        <Layer>
                                            {reservations.map((res) => (
                                                <Group key={res.x}>
                                                    <ReservationCircle
                                                        res={res}
                                                        circleProps={{
                                                            radius: 8,
                                                            stroke: res.isPartFree
                                                                ? COLORS.partFree
                                                                : res.myReserve
                                                                  ? COLORS.myReserve
                                                                  : res.free
                                                                    ? COLORS.free
                                                                    : COLORS.default,
                                                            strokeWidth: 2,
                                                        }}
                                                        viewBoxHeight={viewBox[1]}
                                                        onReservationClick={onReservationClick}
                                                    />
                                                </Group>
                                            ))}
                                        </Layer>
                                    </Stage>
                                </div>
                            </TransformComponent>
                        </>
                    )}
                </TransformWrapper>
            )}
        </div>
    );
};
