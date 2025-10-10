import { IonContent } from "@ionic/react";
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { BookParking } from "@/pages/ParkingPage/ui/BookParking/BookParking.tsx";
import { Modals } from "@/pages/ParkingPage/ui/Modals/Modals.tsx";
import { MyParkings } from "@/pages/ParkingPage/ui/MyParkings/MyParkings.tsx";

import { useCancelParking, useReservations, useReserveParking } from "@/features/booking/hooks/useParkings.ts";
import { useFilters } from "@/features/filters/model/hooks/useFilters.ts";

import { type TSelectTreeNodeExtended, useOfficeFilters } from "@/entities/offices/hooks/useOfficeFilters.ts";
import type { Parking } from "@/entities/offices/types.ts";

import { usePagination } from "@/shared/hooks/usePagination.ts";
import { useRouteCache } from "@/shared/hooks/useRouteCache.ts";
import { ReservationsMap } from "@/shared/ui/ReservationsMap/ReservationsMap.tsx";
import { getFullUrl } from "@/shared/utils/getFullUrl.ts";

import { Filter } from "@/widgets/Filter/Filter.tsx";
import { WelcomeReservation } from "@/widgets/WelcomeReservation/WelcomeReservation.tsx";

import { textFields } from "./constants.ts";

import styles from "./ParkingPage.module.scss";

type TProps = {
    path: string;
};

export const ParkingPage = ({ path }: TProps) => {
    const [filterOpen, setFilterOpen] = useState(true);

    const [openReservations, setOpenReservations] = useState<boolean>(false);
    const [freeParkings, setFreeParkings] = useState<Record<string, Parking[]> | undefined>();

    const [currentParking, setCurrentParking] = useState<Parking | undefined>();
    const [openBookParking, setOpenBookParking] = useState<boolean>(false);

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<{ [key: string]: string | number | number[] }>({
        type: "",
    });

    const [isStartInterface, setIsStartInterface] = useState(true);
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

    const { treeData, office } = useOfficeFilters(params, selectedSpace, () => {}, "parkings");

    const { data: reservations, refetch: refetchReservations } = useReservations(params, (data) => {
        const filteredByUsage = office?.parkings.filter(({ id }) =>
            data?.usage?.reserved_ids ? !data?.usage?.reserved_ids.includes(id) : id
        );

        const workspaceMap = office?.workspaces.reduce<Record<number, string>>((map, ws) => {
            map[ws.id] = ws.title;
            return map;
        }, {});

        const groupByWorkspaces = filteredByUsage?.reduce<Record<string, Parking[]>>(
            (acc, item) => {
                const key = workspaceMap ? workspaceMap[item.work_space_id] : item.work_space_id.toString();
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            },
            {} as Record<string, Parking[]>
        );

        setFreeParkings(groupByWorkspaces);
    });

    const { mutate: reserveParking } = useReserveParking(() => {
        setOpenBookParking(false);
        refetchReservations();
    });

    const { mutate: cancelParking } = useCancelParking(() => {
        setOpenMessage(false);
        refetchReservations();
    });

    const handleOpenMap = useCallback(async () => {
        refetchReservations();

        setIsStartInterface(false);
    }, [refetchReservations, office]);

    const handleMapToggle = async () => {
        await refetchReservations().then(() => setOpenReservations((prev) => !prev));
        setMapMode((prevMapMode) => !prevMapMode);
    };

    const handleReserveParking = useCallback(
        (data: any) => {
            reserveParking(data);
        },
        [reserveParking]
    );

    const handleCancelParking = useCallback(
        (data: any) => {
            cancelParking(data);
        },
        [reserveParking]
    );

    const cbModals = useCallback(
        (data: any) => {
            if (data.type === "confirmBook") {
                handleReserveParking(modalProps);
            }
            if (modalProps.type === "cancelBook") {
                handleCancelParking(modalProps);
            }
        },
        [modalProps]
    );

    const handleOpenModal = useCallback(
        (data: any) => {
            setModalProps(data);
            setOpenMessage(true);
        },
        [modalProps]
    );

    const handleSelectWorkSpace = (data: TSelectTreeNodeExtended) => {
        const current = treeData.find((node) => node.workspace_id === data.workspace_id);
        if (current) {
            setCurrentPlanImg(current.plan ? getFullUrl(current.plan) : null);
            setSelectedSpace(String(data.workspace_id));
            setSelectedOffice(String(data.office_id));
            setSelectedFloor(String(data.floor_id));
        }
    };

    const handleOpenBookParking = (data: any, type?: "create" | "update") => {
        if (type === "update") return;
        if (!freeParkings) return;
        const current: Parking | undefined = Object.values(freeParkings ?? {})
            .flat()
            .find((p: Parking) => p.id === data.id);
        setCurrentParking(current);
        setOpenBookParking(true);
    };

    useEffect(() => {
        if (selectedSpace && !!office) {
            const myReservedIds = new Set(reservations?.current?.results.map((el) => el.target_id) ?? []);
            const reservedIds = new Set(reservations?.usage?.reserved_ids ?? []);

            const points = office?.parkings
                .filter(({ work_space_id }) => work_space_id === +selectedSpace)
                .map(({ id, center_x, center_y }) => ({
                    id,
                    x: center_x,
                    y: center_y,
                    free: freeParkings
                        ? Object.values(freeParkings).some((arr) => arr.some((p: Parking) => p.id === id))
                        : false,
                    myReserve: myReservedIds.has(id) && reservedIds.has(id),
                }));

            setMapPoints(points);
        }
    }, [office, selectedSpace, freeParkings]);

    useEffect(() => {
        if (!freeParkings) return;

        const handler = window.setTimeout(() => {
            refetchReservations();
        }, 100);

        return () => {
            window.clearTimeout(handler);
        };
    }, [datesFilter]);

    return (
        <IonContent>
            <div className={clsx(styles.parkingsPage, { [styles.flexCenter]: !filterOpen })}>
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
                <Modals
                    isOpen={openMessage}
                    onClose={() => setOpenMessage(false)}
                    modalProps={modalProps}
                    cbModals={cbModals}
                    reservationData={{
                        office,
                        datesFilter,
                        parkingTitle: (modalProps.title as string) ?? "",
                        selectedFloor,
                    }}
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
                            onReservationClick={(type, value) => handleOpenBookParking(value, type)}
                            reservations={mapPoints}
                            handleMapToggle={handleMapToggle}
                        />
                        <MyParkings
                            isOpen={openReservations}
                            onClose={() => setOpenReservations(false)}
                            reservations={reservations?.current}
                            historyReservations={reservations?.historyReservation}
                            freeParkings={freeParkings}
                            setOpenBook={handleOpenBookParking}
                            cbModal={handleOpenModal}
                        />
                        <BookParking
                            isOpen={openBookParking}
                            onClose={() => setOpenBookParking(false)}
                            datesFilter={datesFilter}
                            parking={currentParking}
                            office={office}
                            cb={handleOpenModal}
                        />
                    </>
                )}
            </div>
        </IonContent>
    );
};
