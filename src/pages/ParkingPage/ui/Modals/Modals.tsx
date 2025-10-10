import React from "react";

import type { AnyReservation } from "@/features/booking/types/reservations.ts";
import { CancelModal } from "@/features/booking/ui/CancelModal/CancelModal.tsx";
import { ConfirmModal } from "@/features/booking/ui/ConfirmModal/ConfirmModal.tsx";
import { SuccessModal } from "@/features/booking/ui/SuccessModal/SuccessModal.tsx";

import type { OfficeData } from "@/entities/offices/types.ts";

type TProps = {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    modalProps: { [key: string]: string | number | number[] };
    cbModals: (arg: any) => void;
    reservationData: {
        office: OfficeData | null;
        datesFilter: any;
        currentReservation?: AnyReservation | undefined;
        parkingTitle: string;
        selectedFloor?: string;
    };
};

export const Modals = ({ isOpen, onClose, modalProps, cbModals, reservationData }: TProps) => {
    switch (modalProps.type) {
        case "successBook":
            return (
                <SuccessModal
                    isOpen={isOpen}
                    onClose={onClose}
                    title={`Парковка ${reservationData.parkingTitle} забронирована`}
                    cbModals={cbModals}
                    reservationData={reservationData}
                />
            );
            break;
        case "cancelBook":
            return (
                <CancelModal
                    isOpen={isOpen}
                    onClose={onClose}
                    cbModal={cbModals}
                />
            );
            break;
        case "confirmBook":
            return (
                <ConfirmModal
                    isOpen={isOpen}
                    onClose={onClose}
                    title={`Парковка ${reservationData.parkingTitle}`}
                    modalProps={modalProps}
                    cbModals={cbModals}
                    reservationData={reservationData}
                />
            );

            break;
        default:
            return null;
    }
};
