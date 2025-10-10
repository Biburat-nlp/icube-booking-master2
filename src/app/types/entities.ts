// import {
//   ENTITY_TYPE,
//   defaultQuery,
//   LockerCellReservation,
//   LockerKind,
//   MeetingRoomReservation,
//   WorkingPlace,
//   WorkingPlaceReservation,
//   LockerType,
//   CellType,
//   NestedRoom,
//   ListParams,
//   EntityType,
//   ListResponse,
//   Room,
//   Account,
//   Guest,
//   ParkingPlaceReservation,
//   Vehicle,
//   ParkingPlaceType,
//   NavVertex,
//   OfficeElementExtraData,
// } from '@shared/types'
// import { DefaultWithTimeParams } from '@shared/api'
//
//
// // Interfaces
// interface IBookingsObtained {
//   getReservations (query?: ListParams): Promise<object[]>
// }
// interface IReservable {
//   reserve (params: object): Promise<object>
// }
// interface ICancellable {
//   cancel (): Promise<void>
// }
// // Move to common types?
// interface IDefaultBookingParams {
//   service_reserve?: boolean | undefined
//   reserve_start: string
//   reserve_end: string
//   target_id: number
//   reserved_by: number
// }
//
// // Abstract classes
// export abstract class BookingsObtained implements IBookingsObtained {
//   abstract getReservations (query: ListParams): Promise<object[]>
// }
// export abstract class EntityReservable extends BookingsObtained implements IReservable {
//   abstract reserve (params: object): Promise<object>
// }
// export abstract class Booking <P extends IDefaultBookingParams = IDefaultBookingParams> implements ICancellable  {
//   abstract type: EntityType
//   abstract params: P
//
//   abstract cancel (): Promise<void>
// }
//
// // Bookings types
//
// export type LockerCellBookingCtor = ReturnType<typeof LockerCellBookingFactory.makeConstructor>
// export type LockerCellBooking = InstanceType<LockerCellBookingCtor>
// export type WorkplaceBookingCtor = ReturnType<typeof WorkplaceBookingFactory.makeConstructor>
// export type WorkplaceBooking = InstanceType<WorkplaceBookingCtor>
// export type MeetingRoomBookingCtor = ReturnType<typeof MeetingRoomBookingFactory.makeConstructor>
// export type MeetingRoomBooking = InstanceType<MeetingRoomBookingCtor>
// export type ParkingPlaceBookingCtor = ReturnType<typeof ParkingPlaceBookingFactory.makeConstructor>
// export type ParkingPlaceBooking = InstanceType<ParkingPlaceBookingCtor>
//
// // Entities types
//
// export type LockerCtor = ReturnType<typeof LockerFactory.makeConstructor>
// export type Locker = InstanceType<LockerCtor>
// export type CellCtor = ReturnType<typeof CellFactory.makeConstructor>
// export type Cell = InstanceType<CellCtor>
// export type MeetingRoomCtor = ReturnType<typeof MeetingRoomFactory.makeConstructor>
// export type MeetingRoom = InstanceType<MeetingRoomCtor>
// export type WorkplaceCtor = ReturnType<typeof WorkplaceFactory.makeConstructor>
// export type Workplace = InstanceType<WorkplaceCtor>
// export type ParkingPlaceCtor = ReturnType<typeof ParkingPlaceFactory.makeConstructor>
// export type ParkingPlace = InstanceType<ParkingPlaceCtor>
//
// // Factories
//
// export class LockerCellBookingFactory {
//   static makeConstructor = (cancelRequest: (lockerId: number, cellId: number, reservationId: number) => Promise<void>) => {
//     return class LockerCellBooking extends Booking {
//       type = ENTITY_TYPE.LOCKER
//       params: LockerCellReservation
//
//       constructor (params: LockerCellReservation) {
//         super()
//         this.params = params
//       }
//
//       async cancel () {
//         return cancelRequest(this.params.locker_id, this.params.target_id, this.params.id)
//       }
//
//       static make (...params: ConstructorParameters<typeof LockerCellBooking>) {
//         return new LockerCellBooking(...params)
//       }
//     }
//   }
// }
//
// export class WorkplaceBookingFactory {
//   static makeConstructor = (cancelRequest: (desktopId: number, reservationId: number) => Promise<void>) => {
//     return class WorkplaceBooking extends Booking {
//       type = ENTITY_TYPE.WORKING_PLACE
//       params: WorkingPlaceReservation
//
//       constructor (params: WorkingPlaceReservation) {
//         super()
//         this.params = params
//       }
//
//       async cancel () {
//         if (!this.params.target_id) {
//           console.error('desktop_id is not defined')
//           return
//         }
//         return cancelRequest(this.params.target_id, this.params.id)
//       }
//
//       static make (...params: ConstructorParameters<typeof WorkplaceBooking>) {
//         return new WorkplaceBooking(...params)
//       }
//     }
//   }
// }
//
// export class MeetingRoomBookingFactory {
//   static makeConstructor = (cancelRequest: (roomId: number, reservationId: number) => Promise<void>) => {
//     return class MeetingRoomBooking extends Booking {
//       type = ENTITY_TYPE.MEETING_ROOM
//       params: MeetingRoomReservation
//
//       constructor (params: MeetingRoomReservation) {
//         super()
//         this.params = params
//       }
//
//       async cancel () {
//         return cancelRequest(this.params.target_id, this.params.id)
//       }
//
//       static make (...params: ConstructorParameters<typeof MeetingRoomBooking>) {
//         return new MeetingRoomBooking(...params)
//       }
//     }
//   }
// }
//
// export class ParkingPlaceBookingFactory {
//   static makeConstructor = (cancelRequest: (parkingPlaceId: number, reservationId: number) => Promise<void>) => {
//     return class ParkingPlaceBooking extends Booking {
//       type = ENTITY_TYPE.PARKING_PLACE
//       params: ParkingPlaceReservation
//
//       constructor (params: ParkingPlaceReservation) {
//         super()
//         this.params = params
//       }
//
//       async cancel () {
//         return cancelRequest(this.params.target_id, this.params.id)
//       }
//
//       static make (...params: ConstructorParameters<typeof ParkingPlaceBooking>) {
//         return new ParkingPlaceBooking(...params)
//       }
//     }
//   }
// }
//
// export class LockerFactory {
//   static makeConstructor = (
//     cellsRequest: (lockerId: number, query?: { limit: number; offset: number }) => Promise<ListResponse<CellType>>,
//     reservationsRequest: (lockerId: number, query: ListParams) => Promise<ListResponse<LockerCellReservation>>,
//     CellCtor: CellCtor,
//     LockerCellBookingCtor: LockerCellBookingCtor,
//   ) => {
//     return class Locker extends BookingsObtained {
//       id: number
//       title: string
//       locker_type?: LockerKind
//       work_space_id: number
//       office_id: number
//       floor_id: number
//       center_x: number | null
//       center_y: number | null
//
//       lockerCells?: Cell[]
//
//       constructor (params: LockerType) {
//         super()
//
//         this.id = params.id
//         this.title = params.title
//         this.locker_type = params.locker_type
//         this.work_space_id = params.work_space_id
//         this.office_id = params.office_id
//         this.floor_id = params.floor_id
//         this.center_y = params.center_y
//         this.center_x = params.center_x
//       }
//
//       get cells (): Promise<Cell[]> {
//         if (this.lockerCells?.length) {
//           return Promise.resolve(this.lockerCells)
//         } else {
//           return (async () => {
//             const cells = await cellsRequest(this.id)
//             this.lockerCells = cells.results.map(cell => new CellCtor(cell))
//
//             return this.lockerCells
//           })()
//         }
//       }
//
//       async getReservations (query: ListParams) {
//         const reservations = await reservationsRequest(this.id, query)
//         return reservations.results.map(reserve => new LockerCellBookingCtor(reserve))
//       }
//
//       static make (...params: ConstructorParameters<typeof Locker>) {
//         return new Locker(...params)
//       }
//     }
//   }
// }
//
// export class CellFactory {
//   static makeConstructor = (
//     reserveRequest: (lockerId: number, cellId: number, body: {
//       reserve_start: string;
//       reserve_end: string;
//     }) => Promise<LockerCellReservation>,
//     reservationsRequest: (lockerId: number, cellId: number, query?: ListParams) => Promise<ListResponse<LockerCellReservation>>,
//     LockerCellBookingCtor: LockerCellBookingCtor,
//   ) => {
//     return class Cell extends EntityReservable implements CellType {
//       id: number
//       board_address: number
//       cell_height: number
//       cell_number: string
//       cell_width: number
//       created_at: string
//       lock_port: number
//       lock_status: 0 | 1
//       locker: number
//       ordering: number
//       status: string
//       updated_at: string
//       position_x: number
//       position_y: number
//
//       constructor (params: CellType) {
//         super()
//
//         this.id = params.id
//         this.board_address = params.board_address
//         this.cell_height = params.cell_height
//         this.cell_number = params.cell_number
//         this.cell_width = params.cell_width
//         this.created_at = params.created_at
//         this.lock_port = params.lock_port
//         this.lock_status = params.lock_status
//         this.locker = params.locker
//         this.ordering = params.ordering
//         this.status = params.status
//         this.updated_at = params.updated_at
//         this.position_x = params.position_x
//         this.position_y = params.position_y
//       }
//
//       async reserve (params: Pick<LockerCellBooking['params'], 'reserve_start' | 'reserve_end'>) {
//         const reservation = await reserveRequest(this.locker, this.id, {
//           reserve_start: params.reserve_start,
//           reserve_end: params.reserve_end,
//         })
//         return new LockerCellBookingCtor(reservation)
//       }
//
//       async getReservations (query: ListParams = defaultQuery) {
//         const cellReservations = await reservationsRequest(this.locker, this.id, query)
//         return cellReservations.results.map(reserve => new LockerCellBookingCtor(reserve))
//       }
//
//       static make (...params: ConstructorParameters<typeof Cell>) {
//         return new Cell(...params)
//       }
//     }
//   }
// }
//
// export class MeetingRoomFactory {
//   static makeConstructor = (
//     reserveRequest: (roomId: Room["id"], body: {
//       reserve_start: string;
//       reserve_end: string;
//       target: Room["id"];
//       invited_users?: Account["id"][];
//       invited_guests?: Guest["id"][];
//       service_reserve?: boolean;
//       meeting_subject?: string;
//     }) => Promise<MeetingRoomReservation>,
//     reservationsRequest: (roomId: number, query?: ListParams) => Promise<ListResponse<MeetingRoomReservation>>,
//     MeetingRoomBookingCtor: MeetingRoomBookingCtor,
//   ) => {
//     return class MeetingRoom extends EntityReservable {
//       id: number
//       title: string
//       description?: string
//       work_space_id: number
//       room_number?: string
//       timeslot_length?: string
//       seats: number | null
//       has_conference_call: boolean
//       has_drawing_board: boolean
//       has_multimedia_panel: boolean
//       office_id: number
//       floor_id: number
//       center_x: number | null
//       center_y: number | null
//
//       constructor (params: Room | NestedRoom) {
//         super()
//
//         this.id = params.id
//         this.title = params.title
//         this.description = params.description
//         this.work_space_id = params.work_space_id
//         this.room_number = params.room_number
//         this.timeslot_length = params.timeslot_length
//         this.seats = params.seats
//         this.has_conference_call = params.has_conference_call
//         this.has_drawing_board = params.has_drawing_board
//         this.has_multimedia_panel = params.has_multimedia_panel
//         this.office_id = params.office_id
//         this.floor_id = params.floor_id
//         this.center_y = params.center_y
//         this.center_x = params.center_x
//       }
//
//       async reserve (params: Pick<MeetingRoomBooking['params'], 'reserve_start' | 'reserve_end' | 'meeting_subject'>) {
//         const reservation = await reserveRequest(this.id, {
//           target: this.id,
//           reserve_start: params.reserve_start,
//           reserve_end: params.reserve_end,
//           meeting_subject: params.meeting_subject,
//         })
//         return new MeetingRoomBookingCtor(reservation)
//       }
//
//       async getReservations (query: ListParams = defaultQuery) {
//         const meetingRoomReservations = await reservationsRequest(this.id, query)
//         return meetingRoomReservations.results.map(reserve => new MeetingRoomBookingCtor(reserve))
//       }
//
//       static make (...params: ConstructorParameters<typeof MeetingRoom>) {
//         return new MeetingRoom(...params)
//       }
//     }
//   }
// }
//
// export class WorkplaceFactory {
//   static makeConstructor = (
//     reserveRequest: (workingPlaceId: number, body: {
//       reserve_start: string;
//       reserve_end: string;
//       target: number;
//     }) => Promise<WorkingPlaceReservation>,
//     reservationsRequest: (workingPlaceId: number, query?: ListParams) => Promise<ListResponse<WorkingPlaceReservation>>,
//     WorkplaceBookingCtor: WorkplaceBookingCtor,
//   ) => {
//     return class Workplace extends EntityReservable {
//       id: number
//       title: string
//       work_space_id: number
//       office_id: number
//       floor_id: number
//       center_x: number | null
//       center_y: number | null
//       vertex: NavVertex | null
//       picture?: string | null
//       display_count: number | null
//       has_charger_for_mac: boolean
//       has_keyboard: boolean
//       has_printer_nearby: boolean
//       has_window_nearby: boolean
//       uid: string
//
//       constructor (params: WorkingPlace & OfficeElementExtraData) {
//         super()
//
//         this.id = params.id
//         this.title = params.title
//         this.work_space_id = params.work_space_id
//         this.office_id = params.office_id
//         this.floor_id = params.floor_id
//         this.center_y = params.center_y
//         this.center_x = params.center_x
//         this.vertex = params.vertex
//         this.picture = params.picture
//
//         this.display_count = params.display_count
//         this.has_charger_for_mac = params.has_charger_for_mac
//         this.has_keyboard = params.has_keyboard
//         this.has_printer_nearby = params.has_printer_nearby
//         this.has_window_nearby = params.has_window_nearby
//         this.uid = params.uid
//       }
//
//       async reserve (params: Pick<WorkplaceBooking['params'], 'reserve_start' | 'reserve_end'>) {
//         const reservation = await reserveRequest(this.id, {
//           target: this.id,
//           reserve_start: params.reserve_start,
//           reserve_end: params.reserve_end,
//         })
//         return new WorkplaceBookingCtor(reservation)
//       }
//
//       async getReservations (query: ListParams = defaultQuery) {
//         const workplaceReservations = await reservationsRequest(this.id, query)
//         return workplaceReservations.results.map(reserve => new WorkplaceBookingCtor(reserve))
//       }
//
//       static make (...params: ConstructorParameters<typeof Workplace>) {
//         return new Workplace(...params)
//       }
//     }
//   }
// }
//
// export class ParkingPlaceFactory {
//   static makeConstructor = (
//     reserveRequest: (parkingPlaceId: number, body: {
//       reserve_start: string;
//       reserve_end: string;
//       vehicle: Omit<Vehicle, 'id'>;
//     }) => Promise<ParkingPlaceReservation>,
//     reservationsRequest: (parkingPlaceId: number, query?: DefaultWithTimeParams) => Promise<ListResponse<ParkingPlaceReservation>>,
//     ParkingPlaceBookingCtor: ParkingPlaceBookingCtor,
//   ) => {
//     return class ParkingPlace extends EntityReservable {
//       id: number
//       title: string
//       work_space_id: number
//       office_id: number
//       floor_id: number
//       center_x: number | null
//       center_y: number | null
//
//       constructor (params: ParkingPlaceType) {
//         super()
//
//         this.id = params.id
//         this.title = params.title
//         this.work_space_id = params.work_space_id
//         this.office_id = params.office_id
//         this.floor_id = params.floor_id
//         this.center_y = params.center_y
//         this.center_x = params.center_x
//       }
//
//       async reserve (params: Pick<Omit<ParkingPlaceBooking['params'], 'vehicle'>, 'reserve_start' | 'reserve_end'> & { vehicle: Omit<Vehicle, 'id'> }) {
//         const reservation = await reserveRequest(this.id, {
//           reserve_start: params.reserve_start,
//           reserve_end: params.reserve_end,
//           vehicle: params.vehicle,
//         })
//         return new ParkingPlaceBookingCtor(reservation)
//       }
//
//       async getReservations (query: DefaultWithTimeParams = defaultQuery) {
//         const parkingPlaceReservations = await reservationsRequest(this.id, query)
//         return parkingPlaceReservations.results.map(reserve => new ParkingPlaceBookingCtor(reserve))
//       }
//
//       static make (...params: ConstructorParameters<typeof ParkingPlace>) {
//         return new ParkingPlace(...params)
//       }
//     }
//   }
// }
//
