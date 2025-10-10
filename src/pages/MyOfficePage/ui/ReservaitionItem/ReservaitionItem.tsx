import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import { ROUTES_FIELD } from "@/app/router/constants.ts";

import type { AnyReservation } from "@/features/booking/types/reservations.ts";
import { LockerItem } from "@/features/booking/ui/LockerItem/LockerItem.tsx";
import { MeetingRoomItem } from "@/features/booking/ui/MeetingRoomItem/MeetingRoomItem.tsx";
import { ParkingItem } from "@/features/booking/ui/ParkingItem/ParkingItem.tsx";
import { WorkplaceItems } from "@/features/booking/ui/WorkplaceItem/WorkplaceItem.tsx";

import PlusIcon from "@/shared/icons/PlusIcon.svg?react";

import styles from "./ReservaitionItem.module.scss";

import type ReactComponent from "*.svg?react";

type TProps = {
    results: AnyReservation[];
    nameBlock: string;
    Icon: typeof ReactComponent;
    type: string;
    cb: (arg: any, moduleType: "lockers" | "meeting-room" | "parkings" | "workspace") => void;
};

export const ReservaitionItem = ({ results, nameBlock, Icon, type, cb }: TProps) => {
    const history = useHistory();
    const location = useLocation();
    const { t } = useTranslation();

    const getEmptyMessage = () => {
        switch (type) {
            case "meeting-room":
                return t("my_booking:tables:meeting_rooms", { part: 1 });

                break;
            case "lockers":
                return t("my_booking:tables:lockers", { part: 1 });

                break;
            case "parking":
                return t("my_booking:tables:parking_places", { part: 1 });

                break;
            case "workspace":
                return t("my_booking:tables:workplaces", { part: 1 });

                break;
            default:
                return;
        }
    };

    const handleAddReservations = () => {
        switch (type) {
            case "lockers":
                history.replace({ pathname: ROUTES_FIELD.LOCKERS.path, search: location.search });

                break;
            case "meeting-room":
                history.replace({
                    pathname: ROUTES_FIELD.MEETING_ROOMS.path,
                    search: location.search,
                });

                break;
            case "parking":
                history.replace({ pathname: ROUTES_FIELD.PARKINGS.path, search: location.search });

                break;
            case "workspace":
                history.replace({ pathname: ROUTES_FIELD.WORKSPACES.path, search: location.search });

                break;
            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>{t(nameBlock, { part: 0 })}</span>
                <button
                    className={styles.addButton}
                    onClick={handleAddReservations}
                >
                    <PlusIcon className={styles.icon} />
                </button>
            </div>

            <div className={clsx(styles.cards, { [styles.emptyCards]: !results.length })}>
                {results.length > 0 ? (
                    results.map((el, i) => {
                        if (type === "lockers")
                            return (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <LockerItem
                                        {...el}
                                        Icon={Icon}
                                        cb={(arg) => cb(arg, type)}
                                    />
                                </div>
                            );
                        else if (type === "workspace")
                            return (
                                <div
                                    key={`${el.workspace_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <WorkplaceItems
                                        {...el}
                                        Icon={Icon}
                                        cb={(arg) => cb(arg, type)}
                                    />
                                </div>
                            );
                        else if (type === "meeting-room")
                            return (
                                <div
                                    key={`${el.target_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <MeetingRoomItem
                                        {...el}
                                        Icon={Icon}
                                        cb={(arg) => cb(arg, type)}
                                    />
                                </div>
                            );
                        else if (type === "parking")
                            return (
                                <div
                                    key={`${el.target_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <ParkingItem
                                        {...el}
                                        Icon={Icon}
                                        cb={(arg) => cb(arg, "parkings")}
                                    />
                                </div>
                            );
                    })
                ) : (
                    <span className={styles.emptyMessage}>{t("my_booking:no_booked")} {getEmptyMessage()}</span>
                )}
            </div>
        </div>
    );
};
