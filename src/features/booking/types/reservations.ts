import type { TUser } from "@/shared/types/user.ts";

import type ReactComponent from "*.svg?react";

export type TReservation = "meeting-room" | "parking" | "lockers" | "workspace";

export type TBaseReservation = {
    id: number;
    target_id: number;
    locker_id: number;
    reserve_start: string;
    reserve_end: string;
    target_title?: string;
    workspace_title?: string;
    locker_title?: string;
    reserved_by_user: TUser;
};

export type TMeetingRoomReservation = TBaseReservation & {
    meeting_subject: string;
    webinar?: {
        webclient_url: string;
    };
    invited_users: Array<{ [key: string]: any }>;
};

export type TParkingReservation = TBaseReservation & {
    vehicle_plate: string;
    parking_zone: string;
    vehicle: {
        vehicle_model: string;
        vehicle_number: string;
    };
};

export type TLockerReservation = TBaseReservation & {
    locker_id: number;
    cell_number: number;
    locker_title: string;
    datetime_start?: string;
    datetime_end?: string;
};

export type TWorkplaceReservation = TBaseReservation & {
    workplace_number: string;
    equipment: string[];
};

export type AnyReservation = TMeetingRoomReservation | TParkingReservation | TLockerReservation | TWorkplaceReservation;

export type TReservationItem = {
    results: AnyReservation[];
    nameBlock: string;
    Icon: typeof ReactComponent;
    type: TReservation;
};

export type TSelectedReservation = {
    [key: string]: any;
};
