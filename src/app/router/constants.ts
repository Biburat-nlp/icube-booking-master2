import BadgeIcon from "@/shared/icons/BadgeIcon.svg?react";
import CarIcon from "@/shared/icons/CarIcon.svg?react";
import DeskIcon from "@/shared/icons/DeskIcon.svg?react";
import LockIcon from "@/shared/icons/LockIcon.svg?react";
import NavCursorIcon from "@/shared/icons/NavCursorIcon.svg?react";
import OfficeIcon from "@/shared/icons/OfficeIcon.svg?react";
import DoorIcon from "@/shared/icons/OfficeIcon.svg?react";
import UserOneIcon from "@/shared/icons/UserOneIcon.svg?react";

import type ReactComponent from "*.svg?react";

type TRoutes = {
    [key: string]: {
        path: string;
        label?: string;
        isFooter: boolean;
        isAction?: boolean;
        Icon?: typeof ReactComponent;
    };
};

export const ROUTES_FIELD: TRoutes = {
    INDEX: {
        path: "/",
        isFooter: false,
    },
    AUTH: {
        path: "/auth",
        isFooter: false,
    },
    KEYCLOAK_AUTHORIZED_REDIRECT: {
        path: "keycloak_authorized_redirect",
        isFooter: false,
    },
    OFFICE: {
        path: "/office",
        label: "routes:my_office",
        isFooter: true,
        Icon: OfficeIcon,
    },
    RESERVATION: {
        path: "/reservation",
        label: "routes:booking",
        isFooter: true,
        isAction: true,
        Icon: LockIcon,
    },
    LOCKERS: {
        path: "/reservation/lockers",
        label: "routes:lockers",
        isFooter: false,
        Icon: DeskIcon,
    },
    MEETING_ROOMS: {
        path: "/reservation/meeting-rooms",
        label: "routes:meeting_rooms",
        isFooter: false,
        Icon: OfficeIcon,
    },
    PARKINGS: {
        path: "/reservation/parkings",
        label: "routes:parkings",
        isFooter: false,
        Icon: CarIcon,
    },
    WORKSPACES: {
        path: "/reservation/workplaces",
        label: "routes:workplaces",
        isFooter: false,
        Icon: DeskIcon,
    },
    INVITATIONS: {
        path: "/invitations",
        label: "routes:invitations",
        isFooter: true,
        Icon: BadgeIcon,
    },
    NAVIGATION: {
        path: "/navigation",
        label: "routes:navigation",
        isFooter: true,
        Icon: NavCursorIcon,
    },
    NAV_ROOMS: {
        path: "/navigation/rooms",
        label: "routes:rooms",
        isFooter: false,
        Icon: DoorIcon,
    },
    NAV_COLLEAGUES: {
        path: "/navigation/colleagues",
        label: "routes:colleagues",
        isFooter: false,
        Icon: UserOneIcon,
    },
    ANALYTICS: {
        path: "/analytics",
        label: "routes:analytics",
        isFooter: false,
        Icon: NavCursorIcon,
    },
    PROFILE: {
        path: "/profile",
        label: "routes:profile",
        isFooter: false,
    },
};
