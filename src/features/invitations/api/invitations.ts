import type { TInvitations } from "@/features/invitations/types/invitations.ts";

import { api } from "@/shared/api/api.ts";

export const invitationsQueryKeys = {
    all: ["invitations"] as const,
    list: (params: any) => [...invitationsQueryKeys.all, "list", params],
};

export const invitationsApi = {
    getGuests: async (): Promise<TInvitations[]> => {
        const { data } = await api.get("/invitations/");
        return data.results;
    },

    setInvitation: async (values: any, created_by: number): Promise<TInvitations[]> => {
        const { data } = await api.post("/invitations/", { ...values, created_by });
        return data.results;
    },

    updateInvitation: async (values: TInvitations, created_by: number): Promise<TInvitations[]> => {
        const { data } = await api.patch(`/invitations/${values.id}/`, { ...values, created_by });
        return data.results;
    },

    removeInvitation: async (id: number): Promise<TInvitations[]> => {
        const { data } = await api.delete(`/invitations/${id}/`);
        return data.results;
    },
};
