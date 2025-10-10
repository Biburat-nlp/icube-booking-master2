import type { TVehicle } from "@/shared/types/vehicle.ts";

export type DocumentType = "citizen_passport" | "international_passport" | "military_id";

export interface TGuest {
    is_deleted: boolean;
    deleted_at?: string | null;
    deleted_by?: number | null;
    id: number;
    document_number?: string | null;
    document_type?: DocumentType;
    email?: string | null;
    first_name: string | null;
    first_registration?: number | null;
    is_document_number_filled: boolean;
    last_name?: string | null;
    middle_name?: string | null;
    organization?: string | null;
    vehicle?: TVehicle;
    //Локальный id, используется только для работы с объектом
    idByCreate?: string;
}
