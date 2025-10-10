export interface Desktop {
    id: number;
    title: string;
    center_x: number;
    center_y: number;
    uid: string;
    work_space_id: number;
    vertex: any;
    display_count: number | null;
    has_keyboard: boolean;
    has_window_nearby: boolean;
    has_printer_nearby: boolean;
    has_charger_for_mac: boolean;
    office_id: number;
    floor_id: number;
}

export interface Floor {
    id: number;
    office_id: number;
    title: string;
}

export interface Locker {
    id: number;
    title: string;
    center_x: number;
    center_y: number;
    locker_type: string;
    work_space_id: number;
    vertex: any;
    cells_height: number;
    cells_width: number;
    office_id: number;
    floor_id: number;
}

export interface MeetingRoom {
    id: number;
    title: string;
    center_x: number;
    center_y: number;
    room_number: string | null;
    timeslot_length: string;
    description: string | null;
    work_space_id: number;
    room_geometry: any;
    seats: any;
    has_multimedia_panel: boolean;
    has_conference_call: boolean;
    has_drawing_board: boolean;
    office_id: number;
    floor_id: number;
}

export interface Parking {
    id: number;
    uid: string;
    title: string;
    center_x: number;
    center_y: number;
    work_space_id: number;
    vertex: any;
    office_id: number;
    floor_id: number;
}

export interface WorkSpace {
    floor_id: number;
    id: number;
    office_id: number;
    plan: string;
    title: string;
    entity_types: {
        desktops: boolean;
        lockers: boolean;
        meeting_rooms: boolean;
        parking_places: boolean;
    };
    default_start_vertex: any;
}

export interface OfficeData {
    address: string;
    description: string | null;
    desktops: Desktop[];
    floors: Floor[];
    id: number;
    lockers: Locker[];
    meeting_rooms: MeetingRoom[];
    parkings: Parking[];
    timezone: string;
    title: string;
    workday_end: string;
    workday_start: string;
    workspaces: WorkSpace[];
}

export interface Usage {
    all_count: number;
    group_id: number;
    reserved_count: number;
    reserved_ids: Number[];
}

export type TOffice = "desktops" | "parkings" | "floors" | "lockers" | "meeting_rooms" | "workspaces";
