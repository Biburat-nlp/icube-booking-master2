import React from "react";

import type { TSelectedReservation } from "@/features/booking/types/reservations.ts";
import { CancelModal } from "@/features/booking/ui/CancelModal/CancelModal.tsx";
import { UpdateMeetingRoomModal } from "@/features/booking/ui/UpdateMeetingRoomModal/UpdateMeetingRoomModal.tsx";
import { UpdateModal } from "@/features/booking/ui/UpdateModal/UpdateModal.tsx";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    modalProps: { [key: string]: string | number };
    cbModals: (arg: any) => void;
    reservationData?: TSelectedReservation;
};

export const Modals = ({ isOpen, onClose, modalProps, cbModals, reservationData }: TProps) => {
    switch (modalProps.type) {
        case "cancelBook":
            return (
                <CancelModal
                    isOpen={isOpen}
                    onClose={onClose}
                    cbModal={cbModals}
                />
            );
            break;
        case "updateBook":
            return (
                <UpdateModal
                    isOpen={isOpen}
                    onClose={onClose}
                    modalProps={modalProps}
                    cbModal={cbModals}
                    reservationData={reservationData}
                />
            );
            break;
        case "updateBookMeetingRoom":
            return (
                <UpdateMeetingRoomModal
                    isOpen={isOpen}
                    onClose={onClose}
                    cb={cbModals}
                    currentReservation={reservationData}
                    office={null}
                />
            );
            break;
        default:
            return null;
    }
};
