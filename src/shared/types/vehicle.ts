export type TVehicle = {
    is_deleted: boolean;
    readonly deleted_at?: string | null;
    readonly deleted_by?: number | null;
    readonly id: number;
    vehicle_model: string;
    vehicle_number: string;
    readonly created_by?: number;
};
