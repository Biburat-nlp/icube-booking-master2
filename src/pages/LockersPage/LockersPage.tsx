import { IonContent } from "@ionic/react";
import clsx from "clsx";
import React, { useMemo, useCallback, useState, useEffect } from "react";

import { useAuth } from "@/app/providers/AuthProvider.tsx";

import { textFields } from "@/pages/LockersPage/constants.ts";
import { BookCells } from "@/pages/LockersPage/ui/BookCells/BookCells.tsx";
import { Modals } from "@/pages/LockersPage/ui/Modals/Modals.tsx";
import { MyLockers } from "@/pages/LockersPage/ui/MyLockers/MyLockers.tsx";

import type { Cell } from "@/features/booking/api/lockers.ts";
import {
    useCancelLocker,
    useCells,
    useReservations,
    useReserveLocker,
    useUpdateLocker,
} from "@/features/booking/hooks/useLockers.ts";
import type { AnyReservation, TReservationItem } from "@/features/booking/types/reservations.ts";
import type { TModalMessageProps } from "@/features/booking/ui/types.ts";
import { useFilters } from "@/features/filters/model/hooks/useFilters.ts";

import { type TSelectTreeNodeExtended, useOfficeFilters } from "@/entities/offices/hooks/useOfficeFilters.ts";

import { usePagination } from "@/shared/hooks/usePagination.ts";
import { useRouteCache } from "@/shared/hooks/useRouteCache.ts";
import { ReservationsMap } from "@/shared/ui/ReservationsMap/ReservationsMap.tsx";
import { getFullUrl } from "@/shared/utils/getFullUrl.ts";

import { Filter } from "@/widgets/Filter/Filter.tsx";
import { WelcomeReservation } from "@/widgets/WelcomeReservation/WelcomeReservation.tsx";

import styles from "./LockersPage.module.scss";

type TProps = {
    path: string;
};

export const LockersPage = ({ path }: TProps) => {
    const { user } = useAuth();
    const [filterOpen, setFilterOpen] = useState(true);
    const [openReservations, setOpenReservations] = useState<boolean>(false);
    const [openBookCells, setOpenBookCells] = useState<boolean>(false);

    const [currentReservation, setCurrentReservation] = useState<AnyReservation | undefined>();

    const [currentCell, setCurrentCell] = useState<Cell | undefined>();

    const [currentLockerTitle, setCurrentLockerTitle] = useState<string>("");

    const [openMessage, setOpenMessage] = useState<boolean>(false);

    const [modalProps, setModalProps] = useState<TModalMessageProps>({
        type: "successBook",
    });

    const [currentPlanImg, setCurrentPlanImg] = useState<string | null>(null);
    const [mapPoints, setMapPoints] = useState<{ id: number; x: number; y: number; free: boolean }[]>();
    const [mapMode, setMapMode] = useState<boolean>(true);

    const { limit, offset } = usePagination({ rowsPerPage: 9999 });
    const { routeCache, pushToRouteCache } = useRouteCache(path);

    const {
        selectedOffice,
        setSelectedOffice,
        selectedSpace,
        setSelectedSpace,
        selectedFloor,
        setSelectedFloor,
        datesFilter,
        setDatesFilter,
        dateTimeFilterLabel,
    } = useFilters(routeCache, pushToRouteCache);

    const params = useMemo(
        () => ({
            limit,
            offset,
            office_id: selectedOffice,
            floor_id: selectedFloor,
            space_id: selectedSpace,
            datetime_start: datesFilter.datetime_start,
            datetime_end: datesFilter.datetime_end,
        }),
        [limit, offset, selectedOffice, selectedFloor, selectedSpace, datesFilter]
    );

    const [isStartInterface, setIsStartInterface] = useState(true);

    const { data: reservations, refetch: refreshReservations } = useReservations(params);

    const { data: cells, refetch: refetchCells } = useCells(params, selectedSpace);

    const { mutate: reserveLockerMutation } = useReserveLocker(params, selectedSpace, async () => {
        setOpenMessage(true);
        setModalProps({ type: "successBook" });

        await refreshReservations().then(() => setOpenReservations(true));
    });

    const { mutate: cancelLocker } = useCancelLocker(async () => {
        await refreshReservations().then(() => setOpenReservations(true));
    });

    const { mutate: updateLocker } = useUpdateLocker(async () => {
        await refreshReservations().then(() => setOpenReservations(true));
    });

    const { treeData, office } = useOfficeFilters(params, selectedSpace, () => {
        if (office && selectedSpace) {
            const findLocker = office.lockers.find(({ work_space_id }) => work_space_id === +selectedSpace);

            if (findLocker) setCurrentLockerTitle(findLocker.title);
        }
    });

    const handleShowReservation = useCallback(async () => {
        await refreshReservations().then(() => setOpenReservations(true));
    }, [refreshReservations]);

    const handleShowLockers = useCallback(async () => {
        if (isStartInterface) return;

        await Promise.all([refetchCells(), refreshReservations()]).then(() => setOpenBookCells(true));
    }, [refetchCells, selectedSpace, isStartInterface]);

    const handleOpenMap = useCallback(async () => {
        refetchCells();
        setIsStartInterface(false);
    }, [office, refetchCells, isStartInterface]);

    const handleMapToggle = async () => {
        await refreshReservations().then(() => setOpenReservations((prev) => !prev));
        setMapMode((prevMapMode) => !prevMapMode);
    };

    const handleSelectLocker = useCallback(
        (id: string) => {
            reserveLockerMutation(id);
        },
        [reserveLockerMutation]
    );

    const handleCancelLocker = useCallback(
        (locker_id: string | number, target_id: string | number, id: string | number) => {
            cancelLocker({ lockerId: locker_id, cellId: target_id, reservationId: id });
        },
        [cancelLocker]
    );

    const handleUpdateLocker = useCallback(
        (
            locker_id: string | number,
            target_id: string | number,
            id: string | number,
            datetime_start: string,
            datetime_end: string
        ) => {
            updateLocker({ lockerId: locker_id, cellId: target_id, reservationId: id, datetime_start, datetime_end });
        },
        [updateLocker]
    );

    const cbModals = (arg: any) => {
        if (modalProps.type === "confirmBook" && modalProps.id) {
            handleSelectLocker(String(arg.id));
        } else if (modalProps.type === "cancelBook" && modalProps.id) {
            handleCancelLocker(modalProps.locker_id, modalProps.target_id, modalProps.id);
        } else if (modalProps.type === "updateBook" && modalProps.id) {
            handleUpdateLocker(
                modalProps.locker_id,
                modalProps.target_id,
                modalProps.id,
                arg.datetime_start,
                arg.datetime_end
            );
        }
    };

    const handleOpenModals = async (arg: any) => {
        if (arg.type === "confirmBook" && arg.id) {
            const currentCell = cells?.find(({ id }) => id === arg.id);

            currentCell && setCurrentCell(currentCell);
        } else if (arg.type === "updateBook") {
            const currentReservation =
                (reservations?.current as TReservationItem).results.find((item) => item.id === arg.id) ?? undefined;
            setCurrentReservation(currentReservation);
        }

        setModalProps({ ...arg });
        setOpenMessage(true);
    };

    const handleSelectWorkSpace = (data: TSelectTreeNodeExtended) => {
        const current = treeData.find((node) => node.workspace_id === data.workspace_id);

        if (current) {
            setCurrentPlanImg(current.plan ? getFullUrl(current.plan) : null);
            setSelectedSpace(String(data.workspace_id));
            setSelectedOffice(String(data.office_id));
            setSelectedFloor(String(data.floor_id));
        }
    };

    useEffect(() => {
        if (selectedSpace && !!office) {
            const points = office?.lockers
                .filter(({ work_space_id }) => work_space_id === +selectedSpace)
                .map(({ id, center_x, center_y }) => ({
                    id,
                    x: center_x,
                    y: center_y,
                    free: !!(cells && cells?.length > 0),
                }));

            setMapPoints(points);
        }
    }, [office, selectedSpace, cells]);

    useEffect(() => {
        if (!isStartInterface) refetchCells();
    }, [selectedSpace]);

    useEffect(() => {
        if (!cells) return;

        const handler = window.setTimeout(() => {
            refetchCells();
        }, 100);

        return () => {
            window.clearTimeout(handler);
        };
    }, [datesFilter]);

    return (
        <IonContent>
            <div className={clsx(styles.lockerPage, { [styles.flexCenter]: !filterOpen })}>
                <Modals
                    isOpen={openMessage}
                    onClose={() => setOpenMessage(false)}
                    modalProps={modalProps}
                    cbModals={cbModals}
                    reservationData={{
                        office,
                        currentLockerTitle,
                        datesFilter,
                        currentCell,
                        currentReservation,
                        selectedFloor,
                    }}
                />
                <Filter
                    isOpen={filterOpen}
                    setIsOpen={setFilterOpen}
                    officesData={treeData}
                    selectedSpace={selectedSpace}
                    datesFilter={datesFilter}
                    setDatesFilter={setDatesFilter}
                    handleSelectWorkSpace={handleSelectWorkSpace}
                    dateTimeFilterLabel={dateTimeFilterLabel}
                    pushToRouteCache={pushToRouteCache}
                />
                {isStartInterface ? (
                    <WelcomeReservation
                        centerPosition={!filterOpen}
                        textFields={textFields.greeting_modal}
                        selectedSpace={selectedSpace}
                        datesFilter={datesFilter}
                        popoverText={textFields.popoverText}
                        onClick={handleOpenMap}
                    />
                ) : (
                    <>
                        <ReservationsMap
                            imageUrl={currentPlanImg}
                            onReservationClick={handleShowReservation}
                            reservations={mapPoints}
                            handleMapToggle={handleMapToggle}
                        />
                        <MyLockers
                            isOpen={openReservations}
                            onClose={() => setOpenReservations(false)}
                            amountFreeLockers={reservations?.freeCells}
                            historyReservations={reservations?.historyReservation}
                            reservations={reservations?.current}
                            handleShowLockers={handleShowLockers}
                            currentLockerTitle={currentLockerTitle}
                            cb={handleOpenModals}
                            handleMapToggle={handleMapToggle}
                        />
                        <BookCells
                            isOpen={openBookCells}
                            onClose={() => setOpenBookCells(false)}
                            onSelectLocker={handleOpenModals}
                            cells={cells}
                            reservations={reservations}
                            usage={reservations?.usage}
                            currentLockerTitle={currentLockerTitle}
                            userId={user?.id}
                        />
                    </>
                )}
            </div>
        </IonContent>
    );
};
