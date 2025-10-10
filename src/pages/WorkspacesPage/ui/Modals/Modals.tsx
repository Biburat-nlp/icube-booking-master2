import React from "react";
import { useTranslation } from "react-i18next";

import type { AnyReservation } from "@/features/booking/types/reservations.ts";
import { CancelModal } from "@/features/booking/ui/CancelModal/CancelModal.tsx";
import { ConfirmModal } from "@/features/booking/ui/ConfirmModal/ConfirmModal.tsx";
import { SuccessModal } from "@/features/booking/ui/SuccessModal/SuccessModal.tsx";
import { UpdateModal } from "@/features/booking/ui/UpdateModal/UpdateModal.tsx";

import type { OfficeData } from "@/entities/offices/types.ts";

type TProps = {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    modalProps: { [key: string]: string | number };
    cbModals: (arg: any) => void;
    reservationData: {
        office: OfficeData | null;
        datesFilter: any;
        currentReservation?: AnyReservation | undefined;
        workspaceTitle: string;
        selectedFloor?: string;
    };
};

export const Modals = ({ isOpen, onClose, modalProps, cbModals, reservationData }: TProps) => {
    const { t } = useTranslation();
    
    switch (modalProps.type) {
        case "successBook":
            return (
                <SuccessModal
                    isOpen={isOpen}
                    onClose={onClose}
                    title={t("modals:workplace_booked", { title: reservationData.workspaceTitle })}
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
                    title={t("modals:workplace_title", { title: reservationData.workspaceTitle })}
                    modalProps={modalProps}
                    cbModals={cbModals}
                    reservationData={reservationData}
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
                    reservationData={reservationData.currentReservation}
                />
            );
            break;
        default:
            return null;
    }
};
