import React, { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/app/providers/AuthProvider";

import { useSetInvitation, useUpdateInvitation } from "@/features/invitations/hooks/useInvitations";
import type { TInvitations } from "@/features/invitations/types/invitations";

import { GuestModal } from "./ui/GuestModal/GuestModal";
import { InvitationModal } from "./ui/InvitationModal/InvitationModal";

import type { TLocalGuest } from "./ui/GuestModal/GuestModal";
import type { TInvitationForm } from "./ui/InvitationModal/InvitationModal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    isUpdate?: boolean;
    cb: () => void;
    currentInvitation?: TInvitations;
};

export const Modals: React.FC<Props> = ({ isOpen, onClose, isUpdate = false, cb, currentInvitation }) => {
    const { user } = useAuth();
    const [guests, setGuests] = useState<TLocalGuest[]>([]);
    const [guestModalOpen, setGuestModalOpen] = useState(false);
    const [currentGuest, setCurrentGuest] = useState<TLocalGuest | undefined>();

    const { mutate: createInv } = useSetInvitation(user!.id, () => {
        cb();
        onClose();
    });
    const { mutate: updateInv } = useUpdateInvitation(user!.id, () => {
        cb();
        onClose();
    });

    useEffect(() => {
        if (!isOpen) return;
        if (isUpdate && currentInvitation) {
            setGuests(
                currentInvitation.guests.map((g) => ({
                    ...g,
                    idByCreate: crypto.randomUUID(),
                })) as any
            );
        } else {
            setGuests([]);
        }
    }, [isOpen, isUpdate, currentInvitation]);

    const openGuest = useCallback((g?: TLocalGuest) => {
        setCurrentGuest(g);
        setGuestModalOpen(true);
    }, []);

    const saveGuest = useCallback((g: TLocalGuest) => {
        setGuests((prev) => {
            const idx = prev.findIndex((x) => x.idByCreate === g.idByCreate);
            if (idx >= 0) {
                const arr = [...prev];
                arr[idx] = g;
                return arr;
            }
            return [...prev, g];
        });
        setGuestModalOpen(false);
    }, []);

    const removeGuest = useCallback((idByCreate: string) => {
        setGuests((prev) => prev.filter((g) => g.idByCreate !== idByCreate));
    }, []);

    const submitInvitation = useCallback(
        (form: TInvitationForm) => {
            const payload: TInvitations = {
                ...form,
                ...(currentInvitation?.id && { id: currentInvitation.id }),
                guests: guests.map(({ idByCreate, ...rest }) => rest),
            } as any;
            isUpdate ? updateInv(payload) : createInv(payload);
        },
        [guests, isUpdate, currentInvitation, createInv, updateInv]
    );

    return (
        <>
            <InvitationModal
                isOpen={isOpen}
                onClose={onClose}
                handleOpenGuest={openGuest}
                guests={guests}
                removeGuest={removeGuest}
                onSubmit={submitInvitation}
                isUpdate={isUpdate}
                currentInvitation={currentInvitation}
            />
            <GuestModal
                isOpen={guestModalOpen}
                onClose={() => setGuestModalOpen(false)}
                setGuest={saveGuest}
                currentGuest={currentGuest}
            />
        </>
    );
};
