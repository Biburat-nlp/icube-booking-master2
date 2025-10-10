import { useState, useMemo } from "react";

export type TParams = {
    page: number;
    rowsPerPage: number;
};

export function usePagination(initialState?: Partial<TParams>) {
    const [pagination, setPagination] = useState<TParams>({
        page: initialState?.page || 1,
        rowsPerPage: initialState?.rowsPerPage || 5,
    });

    const { limit, offset } = useMemo(
        () => ({
            limit: pagination.rowsPerPage,
            offset: (pagination.page - 1) * pagination.rowsPerPage,
        }),
        [pagination.page, pagination.rowsPerPage]
    );

    const onPageChange = (newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const onRowsPerPageChange = (newRows: number) => {
        setPagination({ page: 1, rowsPerPage: newRows });
    };

    return {
        page: pagination.page,
        limit,
        offset,
        rowsPerPage: pagination.rowsPerPage,
        onPageChange,
        onRowsPerPageChange,
    };
}
