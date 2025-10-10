import type { OfficeData } from "@/entities/offices/types.ts";

import { universalApi } from "@/shared/api/api.ts";

export const officesQueryKeys = {
    all: ["offices"] as const,
    list: (params: any) => [...officesQueryKeys.all, "list", params],
};

export const officesApi = {
    getOffices: async (params?: { limit: number; offset: number }): Promise<OfficeData[]> => {
        const { data } = await universalApi.get("/offices/", params);
        return data.results;
    },
};
