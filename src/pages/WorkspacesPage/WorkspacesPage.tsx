import { IonContent } from "@ionic/react";
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { BookWorkspace } from "@/pages/WorkspacesPage/ui/BookWorkspace/BookWorkspace.tsx";
import { Modals } from "@/pages/WorkspacesPage/ui/Modals/Modals.tsx";
import { MyWorkspaces } from "@/pages/WorkspacesPage/ui/MyWorkspaces/MyWorkspaces.tsx";
import { isPartFree } from "@/pages/WorkspacesPage/utils/isPartFree.ts";

import {
    useCancelWorkspace,
    useReservations,
    useReserveWorkspace,
    useUpdateWorkspace,
} from "@/features/booking/hooks/useWorkspaces.ts";
import type { AnyReservation, TReservationItem } from "@/features/booking/types/reservations.ts";
import { useFilters } from "@/features/filters/model/hooks/useFilters.ts";

import { type TSelectTreeNodeExtended, useOfficeFilters } from "@/entities/offices/hooks/useOfficeFilters.ts";
import type { Desktop } from "@/entities/offices/types.ts";

import { usePagination } from "@/shared/hooks/usePagination.ts";
import { useRouteCache } from "@/shared/hooks/useRouteCache.ts";
import { ReservationsMap } from "@/shared/ui/ReservationsMap/ReservationsMap.tsx";
import { getFullUrl } from "@/shared/utils/getFullUrl.ts";
import type { TSwitchValue } from "@/shared/ui/SwitchItems/SwitchItems.tsx";

import { Filter } from "@/widgets/Filter/Filter.tsx";
import { WelcomeReservation } from "@/widgets/WelcomeReservation/WelcomeReservation.tsx";

import { filterFields, textFields } from "./constants.ts";

import styles from "./WorkspacesPage.module.scss";

type TProps = {
    path: string;
};

export const WorkspacesPage = ({ path }: TProps) => {
    const [filterOpen, setFilterOpen] = useState(true);
    const [switchFilter, setSwitchFilter] = useState<{ [key: string]: boolean }>({
        has_keyboard: false,
        has_window_nearby: false,
        has_printer_nearby: false,
        has_charger_for_mac: false,
        display_count: false,
        display_count_2: false,
    });

    const [openReservations, setOpenReservations] = useState<boolean>(false);
    const [freeDesktops, setFreeDesktops] = useState<Record<string, Desktop[]> | undefined>();
    const [filteredDesktops, setFilteredDesktops] = useState<Desktop[] | undefined>();

    const [currentDesktop, setCurrentDesktop] = useState<Desktop | undefined>();
    const [openBookDesktops, setOpenBookDesktops] = useState<boolean>(false);

    const [currentReservation, setCurrentReservation] = useState<AnyReservation | undefined>();

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<{ [key: string]: string | number }>({
        type: "",
    });

    const [isStartInterface, setIsStartInterface] = useState(true);
    const [currentPlanImg, setCurrentPlanImg] = useState<string | null>(null);
    const [mapPoints, setMapPoints] =
        useState<
            { id: number; x: number; y: number; free: boolean; myReserve: boolean; avatar: string | null | undefined }[]
        >();

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

    const { treeData, office } = useOfficeFilters(params, selectedSpace, () => {}, "desktops");
    const { data: reservations, refetch: refetchReservations } = useReservations(params, (data) => {
        console.log('WorkspacesPage onSuccess data:', data);
        
        const filteredByUsage = filteredDesktops?.filter(({ id }) =>
            data?.usage?.reserved_ids ? !data?.usage?.reserved_ids.includes(id) : id
        );
        
        console.log('filteredDesktops:', filteredDesktops);
        console.log('filteredByUsage:', filteredByUsage);
        console.log('data.usage.reserved_ids:', data?.usage?.reserved_ids);

        const workspaceMap = office?.workspaces.reduce<Record<number, string>>((map, ws) => {
            map[ws.id] = ws.title;
            return map;
        }, {});

        const groupByWorkspaces = filteredByUsage?.reduce<Record<string, Desktop[]>>(
            (acc, item) => {
                const key = workspaceMap ? workspaceMap[item.work_space_id] : item.work_space_id.toString();
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            },
            {} as Record<string, Desktop[]>
        );

        console.log('groupByWorkspaces:', groupByWorkspaces);
        setFreeDesktops(groupByWorkspaces);
    });

    const handleFilterDesktops = useCallback(() => {
        console.log('handleFilterDesktops called');
        console.log('office:', office);
        console.log('office.desktops:', office?.desktops);
        console.log('switchFilter:', switchFilter);
        console.log('selectedSpace:', selectedSpace);
        
        const filteredByOptions = office?.desktops.filter(
            (el) =>
                (!switchFilter.has_keyboard || el.has_keyboard) &&
                (!switchFilter.has_window_nearby || el.has_window_nearby) &&
                (!switchFilter.has_printer_nearby || el.has_printer_nearby) &&
                (!switchFilter.has_charger_for_mac || el.has_charger_for_mac) &&
                (!switchFilter.display_count || el.display_count === 1) &&
                (!switchFilter.display_count_2 || el.display_count === 2)
        );

        const filteredBySpaceId = selectedSpace
            ? filteredByOptions?.filter(({ work_space_id }) => work_space_id === +selectedSpace)
            : filteredByOptions;

        console.log('filteredByOptions:', filteredByOptions);
        console.log('filteredBySpaceId:', filteredBySpaceId);
        
        setFilteredDesktops(filteredBySpaceId);
    }, [office, selectedSpace, switchFilter]);

    const handleShowReservations = () => {
        refetchReservations();
    };

    const handleSwitchFilter = (state: boolean, data: TSwitchValue) => {
        const newFilterData = { [data.value]: state };
        setSwitchFilter((prev) => ({ ...prev, ...newFilterData }));
    };

    const { mutate: reserveWorkspace } = useReserveWorkspace(() => {
        setOpenMessage(true);
        setModalProps((prev) => ({ ...prev, type: "successBook" }));

        handleShowReservations();
    });

    const { mutate: cancelWorkspace } = useCancelWorkspace(() => {
        setOpenMessage(false);
        handleShowReservations();
    });

    const { mutate: updateWorkspace } = useUpdateWorkspace(() => {
        setOpenMessage(false);
        handleShowReservations();
    });

    const handleReserveWorkspace = useCallback(
        (data: any) => {
            reserveWorkspace(data);
        },
        [reserveWorkspace]
    );

    const handleCancelWorkspace = useCallback(
        (data: any) => {
            cancelWorkspace(data);
        },
        [cancelWorkspace]
    );

    const handleUpdatelWorkspace = useCallback(
        (data: any) => {
            updateWorkspace(data);
        },
        [updateWorkspace]
    );

    const handleOpenMap = useCallback(() => {
        handleShowReservations();

        setIsStartInterface(false);
    }, [refetchReservations, office]);

    const handleMapToggle = async () => {
        await refetchReservations().then(() => setOpenReservations((prev) => !prev));
    };

    const cbModals = useCallback(
        (data: any) => {
            if (data.type === "confirmBook") {
                handleReserveWorkspace(modalProps);
                setModalProps(modalProps);
            } else if (modalProps.type === "cancelBook") {
                handleCancelWorkspace(modalProps);
            } else if (modalProps.type === "updateBook" && modalProps.id) {
                handleUpdatelWorkspace({
                    id: modalProps.id,
                    reservationId: modalProps.reservationId,
                    datetime_start: data.datetime_start,
                    datetime_end: data.datetime_end,
                });
            } else if (modalProps.type === "successBook") {
                setOpenBookDesktops(false);
            }
        },
        [modalProps]
    );

    const handleOpenModal = useCallback(
        (data: any) => {
            if (data.type === "updateBook") {
                const current =
                    (reservations?.current as TReservationItem).results.find((item) =>
                        data.isMap ? data.id === item.target_id : data.id === item.id
                    ) ?? undefined;
                setCurrentReservation(current);
                setModalProps({ ...data, reservationId: current?.id });
            } else {
                setModalProps(data);
                setOpenMessage(true);
            }
        },
        [reservations, modalProps]
    );

    const handleOpenBook = useCallback(
        (data: Desktop) => {
            if (!filteredDesktops) return;
            const current: Desktop | undefined = Object.values(filteredDesktops ?? {})
                .flat()
                .find((p: Desktop) => p.id === data.id);

            setCurrentDesktop(current);
            setOpenBookDesktops(true);
        },
        [filteredDesktops]
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

    useEffect(() => {
        handleFilterDesktops();
    }, [office, switchFilter, selectedSpace]);

    useEffect(() => {
        if (!selectedSpace || !office || !filteredDesktops) {
            setMapPoints(undefined);
            return;
        }

        const filteredIds = new Set(filteredDesktops.map((d) => d.id));
        const { usage: { reserved_ids = [] } = {}, current: { results = [] } = {} } = reservations || {};

        const reservedIds = new Set(reserved_ids);
        const myReservedIds = new Set(results.map((el) => el.target_id));

        const points = office.desktops
            .filter(({ work_space_id }) => work_space_id === +selectedSpace)
            .filter(({ id }) => filteredIds.has(id))
            .map(({ id, center_x: x, center_y: y }) => ({
                id,
                x,
                y,
                free: filteredIds.has(id) && !reservedIds.has(id),
                myReserve: myReservedIds.has(id) && reservedIds.has(id),
                avatar: reservations?.all
                    ? reservations.all.find((r) => r.target_id === id)?.reserved_by_user.avatar
                    : null,
                isPartFree: reservations?.all
                    ? isPartFree(
                          datesFilter,
                          reservations?.all.find((r) => r.target_id === id)
                      )
                    : false,
            }));

        setMapPoints(points);
    }, [office, filteredDesktops, reservations]);

    useEffect(() => {
        if (!filteredDesktops) return;

        const handler = window.setTimeout(() => {
            refetchReservations();
        }, 100);

        return () => {
            window.clearTimeout(handler);
        };
    }, [datesFilter, selectedSpace]);

    return (
        <IonContent>
            <div className={clsx(styles.workplacesPage, { [styles.flexCenter]: !filterOpen })}>
                <Modals
                    isOpen={openMessage}
                    onClose={() => setOpenMessage(false)}
                    modalProps={modalProps}
                    cbModals={cbModals}
                    reservationData={{
                        office,
                        datesFilter: {
                            datetime_start: modalProps.datetime_start,
                            datetime_end: modalProps.datetime_end,
                        },
                        workspaceTitle: (modalProps.title as string) ?? "",
                        selectedFloor,
                        currentReservation,
                    }}
                />
                <BookWorkspace
                    isOpen={openBookDesktops}
                    onClose={() => setOpenBookDesktops(false)}
                    desktop={currentDesktop}
                    datesFilter={datesFilter}
                    office={office}
                    cb={handleOpenModal}
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
                    switchItems={filterFields}
                    onChangeFilterSwitch={handleSwitchFilter}
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
                            onReservationClick={(type, value) =>
                                type === "create"
                                    ? handleOpenBook(value)
                                    : handleOpenModal({ ...value, type: "updateBook", isMap: true })
                            }
                            reservations={mapPoints}
                            handleMapToggle={handleMapToggle}
                        />
                        <MyWorkspaces
                            isOpen={openReservations}
                            onClose={() => setOpenReservations(false)}
                            reservations={reservations?.current}
                            historyReservations={reservations?.historyReservation}
                            freeDesktops={freeDesktops}
                            cbModal={handleOpenModal}
                            setOpenBook={handleOpenBook}
                        />
                    </>
                )}
            </div>
        </IonContent>
    );
};
