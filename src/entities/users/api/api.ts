import type { TUsers } from "@/entities/users/types.ts";

import { universalApi } from "@/shared/api/api.ts";
import type { TUser } from "@/shared/types/user.ts";

export const usersQueryKeys = {
    all: ["users"] as const,
    list: (params?: any) => [...usersQueryKeys.all, "list", params] as const,
    detail: (id: number) => [...usersQueryKeys.all, "detail", id] as const,
};

export const usersApi = {
    getUsers: async (params?: { search: string }): Promise<TUsers[]> => {
        const { data } = await universalApi.get("/users/profile/", params);
        return data.results;
    },

    me: async (): Promise<TUser> => {
        const { data } = await universalApi.get("/users/me/");
        return data;
    },

    getPincode: async () => {
        const { data } = await universalApi.post("/users/pin-code/");

        return data.pin_code;
    },

    uploadAvatar: async (file: File): Promise<TUser> => {
        const formData = new FormData();
        formData.append("avatar", file);

        const { data } = await universalApi.post("/users/me/upload-avatar/", formData);
        return data.results;
    },

    updateUser: async (fields: any): Promise<TUser> => {
        const { data } = await universalApi.patch("/users/me/", { ...fields });
        return data.results;
    },
};
