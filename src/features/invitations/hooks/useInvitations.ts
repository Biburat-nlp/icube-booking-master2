import { useMutation, useQuery } from "react-query";

import { invitationsApi, invitationsQueryKeys } from "@/features/invitations/api/invitations.ts";
import type { TInvitations } from "@/features/invitations/types/invitations.ts";

export const useInvitations = (onSuccess?: (data: TInvitations[]) => void) => {
    return useQuery<TInvitations[]>(
        [invitationsQueryKeys.all, "invitations"],
        async () => {
            const result = await invitationsApi.getGuests();

            return result;
        },
        {
            enabled: false,
            onSuccess,
        }
    );
};

export const useSetInvitation = (created_by: number, onSuccess?: (data: TInvitations[]) => void) => {
    return useMutation(
        async (data: any) => {
            const result = await invitationsApi.setInvitation(data, created_by);

            return result;
        },
        {
            onSuccess,
            onError: (error) => console.error(error),
        }
    );
};

export const useUpdateInvitation = (created_by: number, onSuccess?: (data: TInvitations[]) => void) => {
    return useMutation(
        async (data: TInvitations) => {
            const result = await invitationsApi.updateInvitation(data, created_by);

            return result;
        },
        {
            onSuccess,
            onError: (error) => console.error(error),
        }
    );
};

export const useRemoveInvitation = (onSuccess?: (data: TInvitations[]) => void) => {
    return useMutation(
        async (id?: number) => {
            if (!id) return Promise.reject(new Error("Произошла ошибка"));

            const result = await invitationsApi.removeInvitation(id);

            return result;
        },
        {
            onSuccess,
            onError: (error) => console.error(error),
        }
    );
};
