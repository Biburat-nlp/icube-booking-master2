import { useLocation } from "react-router-dom";

import CarIcon from "@/shared/icons/CarIcon.svg?react";
import DeskIcon from "@/shared/icons/DeskIcon.svg?react";
import OfficeIcon from "@/shared/icons/OfficeIcon.svg?react";
import DoorIcon from "@/shared/icons/OfficeIcon.svg?react";
import TilesIcon from "@/shared/icons/TilesIcon.svg?react";
import UserOneIcon from "@/shared/icons/UserOneIcon.svg?react";

import type { TFooterTabItems } from "@/widgets/Footer/types/types.ts";
import type { History } from "history";

export const getReservationItems: () => TFooterTabItems = () => {
    const location = useLocation();
    return [
        {
            path: "/reservation/workplaces",
            label: "routes:workplaces",
            Icon: DeskIcon,
            action: (history: History) =>
                history.replace({ pathname: "/reservation/workplaces", search: location.search }),
        },
        {
            path: "/reservation/lockers",
            label: "routes:lockers",
            Icon: TilesIcon,
            action: (history: History) =>
                history.replace({ pathname: "/reservation/lockers", search: location.search }),
        },
        {
            path: "/reservation/meeting-rooms",
            label: "routes:meeting_rooms",
            Icon: OfficeIcon,
            action: (history: History) =>
                history.replace({ pathname: "/reservation/meeting-rooms", search: location.search }),
        },
        {
            path: "/reservation/parkings",
            label: "routes:parkings",
            Icon: CarIcon,
            action: (history: History) =>
                history.replace({ pathname: "/reservation/parkings", search: location.search }),
        },
    ];
};

export const getNavigationsItems: () => TFooterTabItems = () => {
    const location = useLocation();
    return [
        {
            path: "/navigation/rooms",
            label: "routes:rooms",
            Icon: DoorIcon,
            action: (history: History) => history.replace({ pathname: "/navigation/rooms", search: location.search }),
        },
        {
            path: "/navigation/colleagues",
            label: "routes:colleagues",
            Icon: UserOneIcon,
            action: (history: History) =>
                history.replace({ pathname: "/navigation/colleagues", search: location.search }),
        },
    ];
};
