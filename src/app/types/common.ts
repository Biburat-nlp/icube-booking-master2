// import type {
//     Locker,
//     MeetingRoom,
//     Workplace,
//     MeetingRoomBooking,
//     LockerCellBooking,
//     WorkplaceBooking,
//     ParkingPlaceBooking,
//     ParkingPlace,
// } from "@app/types/entities";
// import type { ObjectValues, Nullable } from "@app/types/helpers";
// import type { Interval } from "date-fns";
// import type { MultiPolygon } from "geojson";
//
// export const DOCUMENT_TYPE = {
//     CITIZEN_PASSPORT: "citizen_passport",
//     INTERNATIONAL_PASSPORT: "international_passport",
//     MILITARY_ID: "military_id",
// } as const;
// export type DocumentType = ObjectValues<typeof DOCUMENT_TYPE>;
//
// export const OFFICE_ELEMENT_STATUS = {
//     DRAFT: "draft",
//     PUBLIC: "public",
//     HIDDEN: "hidden",
// } as const;
// export type OfficeElementStatus = ObjectValues<typeof OFFICE_ELEMENT_STATUS>;
//
// export const LOCKER_TYPE = {
//     LOCKER: "locker",
// } as const;
// export type LockerKind = ObjectValues<typeof LOCKER_TYPE>;
//
// export const ENTITY_TYPE = {
//     WORKING_PLACE: "working_place",
//     MEETING_ROOM: "meeting_room",
//     LOCKER: "locker",
//     PARKING_PLACE: "parking_place",
//     ROOM_GEOMETRY: "room_geometry",
// } as const;
// export type EntityType = ObjectValues<typeof ENTITY_TYPE>;
//
// export type ReservableEntityType =
//     | typeof ENTITY_TYPE.LOCKER
//     | typeof ENTITY_TYPE.PARKING_PLACE
//     | typeof ENTITY_TYPE.WORKING_PLACE
//     | typeof ENTITY_TYPE.MEETING_ROOM;
//
// export const defaultQuery = {
//     limit: 9999,
//     offset: 0,
// };
//
// export type OfficeElement = (MeetingRoom | Locker | Workplace | ParkingPlace | RoomGeometry) & OfficeElementExtraData;
//
// export type OfficeElementReservation = MeetingRoomBooking | LockerCellBooking | WorkplaceBooking | ParkingPlaceBooking;
//
// export type NestedRoom = Coords2D & {
//     readonly id: number;
//     description: string;
//     room_number: string;
//     timeslot_length: string;
//     title: string;
//     seats: number | null;
//     has_conference_call: boolean;
//     has_drawing_board: boolean;
//     has_multimedia_panel: boolean;
//     readonly work_space_id: number;
//     readonly office_id: number;
//     readonly floor_id: number;
// };
//
// export type LockerType = Coords2D & {
//     readonly id: number;
//     title: string;
//     locker_type: LockerKind;
//     readonly work_space_id: number;
//     readonly office_id: number;
//     readonly floor_id: number;
// };
//
// export type LockerCellReservation = ReservationFields & {
//     locker_id: number;
//     locker_title: string;
// };
//
// export type WorkSpace = {
//     readonly id: number;
//     readonly floor_id: number;
//     readonly office_id: number;
//     plan: string;
//     title: string;
//     default_start_vertex: NavVertex;
// };
//
// export type WorkingPlace = Coords2D & {
//     readonly id: number;
//     title: string;
//     readonly uid: string;
//     readonly work_space_id: number;
//     readonly office_id: number;
//     readonly floor_id: number;
//     vertex: NavVertex;
//     display_count: number | null;
//     has_charger_for_mac: boolean;
//     has_keyboard: boolean;
//     has_printer_nearby: boolean;
//     has_window_nearby: boolean;
// };
//
// export type ParkingPlaceType = Coords2D & {
//     readonly id: number;
//     title: string;
//     readonly uid: string;
//     readonly work_space_id: number;
//     readonly office_id: number;
//     readonly floor_id: number;
// };
//
// export type AvailableReservation = {
//     reserve_start: string;
//     reserve_end: string;
// };
//
// export type Room = Coords2D & {
//     id: number;
//     title: string;
//     description?: string;
//     work_space_id: number;
//     room_number?: string;
//     timeslot_length?: string;
//     seats: number | null;
//     has_conference_call: boolean;
//     has_drawing_board: boolean;
//     has_multimedia_panel: boolean;
//     office_id: number;
//     floor_id: number;
// };
//
// export type LockerReservation = CellReservation;
//
// export type CellReservation = ReservationFields & {
//     cell_number: string;
//     cell_id: number;
//     locker_id: number;
// };
//
// export type Webinar = {
//     readonly id: number;
//     webinar_id: string;
//     topic: string;
//     url: string;
//     webclient_url: string;
//     pin: string;
//     source_data: string;
// };
//
// export type MeetingRoomReservation = ReservationFields & {
//     invited_users: UserInfo[];
//     invited_users_set: number[];
//     invited_guests: Guest[];
//     meeting_subject: string;
//     create_webinar: boolean;
//     webinar: Webinar | null;
// };
//
// export type WorkingPlaceReservation = ReservationFields;
//
// // TODO: Add correct type when it will be implemented on the backend
// export type ParkingPlaceReservation = ReservationFields & {
//     vehicle: Vehicle;
// };
//
// export type Floor = {
//     readonly id: number;
//     readonly office_id: number;
//     title: string;
// };
//
// export type Office = {
//     readonly id: number;
//     address: string;
//     description: string;
//     timezone: string;
//     title: string;
//     workday_end: string;
//     workday_start: string;
//     readonly desktops: WorkingPlace[];
//     readonly floors: Floor[];
//     readonly lockers: LockerType[];
//     readonly meeting_rooms: NestedRoom[];
//     readonly workspaces: WorkSpace[];
//     readonly parkings: ParkingPlaceType[];
// };
//
// export type ModifiedOffice = Omit<Office, "workday_start" | "workday_end"> & {
//     workday_start: Date;
//     workday_end: Date;
// };
//
// export type Subdivision = {
//     readonly id: number;
//     title: string;
//     description?: string;
//     rooms_geometry: RoomGeometry[];
// };
//
// export type Vehicle = {
//     readonly id: number;
//     vehicle_model: string;
//     vehicle_number: string;
// };
//
// export type Guest = {
//     is_deleted?: boolean;
//     deleted_at?: string;
//     deleted_by?: string;
//     readonly id: number;
//     document_number?: string;
//     document_type?: DocumentType;
//     is_document_number_filled: boolean;
//     email?: string;
//     first_name: string;
//     first_registration: number;
//     last_name: string;
//     middle_name: string;
//     organization?: string;
//     vehicle: Vehicle;
//     pass_ordered: boolean;
//     parking_reserved: boolean;
// };
//
// export type GuestInvitation = {
//     readonly id: number;
//     readonly uid: string;
//     is_deleted?: boolean;
//     deleted_at?: string;
//     deleted_by?: string;
//     guests: Guest[];
//     created_by?: number;
//     office_id: Office["id"];
//     office_title: Office["title"];
//     visit_start: string;
//     visit_end: string;
//     visit_purpose: string;
//     visit_user: number;
// };
//
// export type OrganizationRelated = {
//     readonly id: number;
//     title: string;
// };
//
// export type UserInfo = Pick<Account, "id" | "first_name" | "last_name" | "email" | "thumb">;
//
// export type Account = {
//     readonly id: number;
//     avatar: string | null;
//     messenger_link: string | null;
//     thumb: string | null;
//     work_day_end: string;
//     work_day_start: string;
//     email: string;
//     first_name: string;
//     last_name: string;
//     organization: OrganizationRelated;
//     username: string;
//     is_staff: boolean;
// };
//
// export type ModifiableAccountFields = Partial<
//     Pick<Account, "email" | "messenger_link" | "work_day_start" | "work_day_end">
// >;
//
// export type Profile = {
//     readonly id: number;
//     last_name: string;
//     first_name: string;
//     middle_name: string;
//     subdivision: unknown;
//     email: string;
//     phone: string;
//     avatar: string;
//     thumb: string;
// };
//
// export type CellType = {
//     id: number;
//     board_address: number;
//     cell_height: number;
//     cell_number: string;
//     cell_width: number;
//     created_at: string;
//     lock_port: number;
//     lock_status: 0 | 1;
//     locker: number;
//     ordering: number;
//     position_x: number;
//     position_y: number;
//     status: string;
//     updated_at: string;
// };
//
// export type RoomDevice = {
//     readonly id: number;
//     title: string;
//     readonly room?: string;
// };
//
// export type RoomConfig = {
//     readonly id: number;
//     title: string;
//     readonly offset?: string;
//     readonly booking_link?: string;
//     readonly timeslot_length?: string;
//     readonly workday_start?: string;
//     readonly workday_end?: string;
// };
//
// export type JWTTokenResponse = {
//     token: string;
// };
//
// export type Error = {
//     code: string;
//     message: string;
//     name: string;
// };
//
// export type ErrorDetail = {
//     errors: Error[];
// };
//
// export type UsageInfoBody = {
//     data_sliced_by: "office" | "floor" | "workspace";
//     data_grouped_by: "office" | "floor" | "workspace" | "target_group";
//     reserve_start: string;
//     reserve_end: string;
// };
//
// export type MeetingRoomFilterParams = "has_conference_call" | "has_drawing_board" | "has_multimedia_panel";
//
// export type WorkplaceFilterParams = "has_keyboard" | "has_window_nearby" | "has_printer_nearby" | "has_charger_for_mac";
//
// export type UsageInfo = {
//     group_id: number;
//     all_count: number;
//     reserved_count: number;
//     reserved_ids: number[] | null;
// };
//
// export type ValidationErrorResponse = {
//     status: string;
//     detail?: ErrorDetail;
// };
//
// export type ChangePassword = {
//     old_password: string;
//     password: string;
//     password_confirm: string;
// };
//
// export type TokenRefreshResponse = {
//     access: string;
// };
//
// export type TokenRefresh = {
//     refresh: string;
//     readonly access?: string;
// };
//
// export type TokenObtainPairResponse = {
//     access: string;
//     refresh: string;
//     user: Account;
// };
//
// export type TokenObtainPair = {
//     username: string;
//     password: string;
// };
//
// export type ListParams = {
//     limit?: number;
//     offset?: number;
//     sortBy?: string;
//     filter?: object;
//     order?: "ASC" | "DESC";
//     datetime_start?: string;
//     datetime_end?: string;
//     within_date_range?: boolean;
//     extent?: {
//         minx: number;
//         miny: number;
//         maxx: number;
//         maxy: number;
//     };
// };
//
// export type ListResponse<T> = {
//     results: T[];
//     count: number;
//     next: string | null;
//     previous: string | null;
// };
//
// export type ReserveStartEndFilter = Partial<Pick<ReservationFields, "reserve_start" | "reserve_end">>;
//
// export type OfficeFloorSpaceFilters = {
//     office_id: number;
//     floor_id: number;
//     space_id: number;
// };
//
// /**************/
// /* Navigation */
// /**************/
//
// export type NavVertex = Required<Coords2D> & {
//     readonly id: number;
//     work_space: number;
// };
//
// export type NavMilestone = {
//     /**
//      * 'id' of access point (NavVertex)
//      */
//     readonly id: number;
//     step_distance: number;
//     step_description: string[];
// };
//
// export type RoomGeometry = Coords2D & {
//     readonly id: number;
//     title: string;
//     description: string;
//     geometry: MultiPolygon["coordinates"];
//     work_space_id: number;
//     entrances: RoomEntrance[];
// };
//
// export type RoomEntrance = {
//     readonly id: number;
//     title: string;
//     room: number;
//     vertex: NavVertex;
// };
//
// export type POI = {
//     readonly id: number;
//     legend: string;
//     logo: string;
//     color: string;
//     qr_code: string;
//     vertex: NavVertex;
// };
//
// /*****************/
// /* Common Fields */
// /*****************/
//
// export type Coords2D = Nullable<{
//     center_x: number;
//     center_y: number;
// }>;
//
// export type ReservationFields = {
//     readonly id: number;
//     reserve_start: string;
//     reserve_end: string;
//     service_reserve?: boolean;
//     reserved_by: number;
//     reserved_by_user?: Profile;
//     readonly target_title: string;
//     readonly target_id: number;
//     readonly workspace_title: string;
// };
//
// /**************/
// /* Interfaces */
// /**************/
//
// export interface IUpdatable {
//     update(): void;
// }
//
// export interface IDisposable {
//     dispose(): void;
// }
//
// /**********************/
// /* Other common types */
// /**********************/
//
// export type TimeString = `${number}:${number}:${number}`;
// export type BookingRange = {
//     start: Date;
//     end: Date;
// };
// export type CellsReservationsById = {
//     allCells: CellType[];
//     allReservations: LockerCellReservation[];
//     reservedCells: CellType[];
//     serviceReserved: CellType[];
// };
// export type BackendError = {
//     detail: {
//         errors: Array<{
//             code: string | null;
//             message: string;
//             name: string;
//         }>;
//     };
//     status: string;
// };
//
// // TODO: replace all usages of DateFnsDateInterval with Interval or Interval<Date, Date>
// export type DateFnsDateInterval = Interval<Date, Date>;
//
// export type OmitOffice = Omit<
//     ModifiedOffice,
//     "desktops" | "parkings" | "floors" | "lockers" | "meeting_rooms" | "workspaces"
// >;
//
// export type OfficeElementExtraData = {
//     picture?: string | null;
// };
