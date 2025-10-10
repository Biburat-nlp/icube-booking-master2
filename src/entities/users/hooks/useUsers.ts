import { useMutation, useQuery } from "react-query";

import { usersApi, usersQueryKeys } from "@/entities/users/api/api.ts";
import type { TUsers } from "@/entities/users/types.ts";

import type { TUser } from "@/shared/types/user.ts";

export const useUsers = (params?: any, onSuccess?: (data: any) => void) => {
    return useQuery<TUsers[]>(
        [usersQueryKeys.all, "users", params],
        async () => {
            const users: TUsers[] | [] = await usersApi.getUsers(params);
            return users;
        },
        {
            enabled: false,
            onSuccess,
        }
    );
};

export const useUploadUserPhoto = (onSuccess?: (updated: TUser) => void) => {
    return useMutation<TUser, unknown, File>((file) => usersApi.uploadAvatar(file), {
        onSuccess,
        onError: (err) => {
            console.error("Произошла ошибка", err);
        },
    });
};

export const useUpdateUser = (onSuccess?: (user: TUser) => void) => {
    return useMutation(
        (data: Pick<TUser, "messenger_link" | "work_day_start" | "work_day_end">) => usersApi.updateUser(data),
        {
            onSuccess,
            onError: (err) => {
                console.error("Произошла ошибка", err);
            },
        }
    );
};

export const useGetPinCode = (onSuccess?: (pinCode: string) => void) => {
    return useMutation(() => usersApi.getPincode(), {
        onSuccess,
        onError: (err) => {
            console.error("Произошла ошибка", err);
        },
    });
};
