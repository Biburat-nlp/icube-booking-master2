import type { TGuest } from "@/shared/types/guest.ts";

export type UserRelated = {
    id: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
};

export type TInvitations = {
    is_deleted: boolean;
    deleted_at?: string | null;
    deleted_by?: number | null;
    id: number;
    uid: string;
    guests: TGuest[];
    created_by?: number;
    office_id: number;
    office_title: string;
    visit_start: string;
    visit_end: string;
    visit_purpose?: string | null | undefined;
    visit_user: UserRelated;
    visit_user_id: number;
};
