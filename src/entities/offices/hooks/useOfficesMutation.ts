import { useMutation, useQueryClient } from "react-query";

import { officesApi, officesQueryKeys } from "@/entities/offices/api/api.ts";
import type { OfficeData } from "@/entities/offices/types.ts";

export const useOfficesMutation = (
    params?: { limit: number; offset: number },
    callbackLockers?: (data: OfficeData[]) => void
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => officesApi.getOffices(params),
        retry: 0,
        onSuccess: (data) => {
            queryClient.setQueryData(officesQueryKeys.list(params), data);
            callbackLockers && callbackLockers(data);
        },
    });
};
