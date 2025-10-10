import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useImage } from "react-konva-utils";

import { useAuth } from "@/app/providers/AuthProvider.tsx";
import { useTheme } from "@/app/providers/ThemeProvider";

import { useFilters } from "@/features/filters/model/hooks/useFilters";
import { useRoute } from "@/features/navigation/hooks/useRoute.ts";

import { useOfficesMutation } from "@/entities/offices/hooks/useOfficesMutation";

import { api } from "@/shared/api/api";
import { usePagination } from "@/shared/hooks/usePagination";
import { useRouteCache } from "@/shared/hooks/useRouteCache";

export function useNavigationPage(path: string) {
    const isRoomMode = path.includes("rooms");
    const { theme } = useTheme();
    const stageRef = useRef<any>(null);

    const { user: me } = useAuth();

    const [dims, setDims] = useState({ width: window.innerWidth, height: window.innerHeight - 200 });
    const { limit, offset } = usePagination({ rowsPerPage: 9999 });
    const { routeCache, pushToRouteCache } = useRouteCache(path);
    const { selectedOffice, selectedSpace, selectedFloor } = useFilters(routeCache, pushToRouteCache);
    const params = useMemo(
        () => ({ limit, offset, office_id: selectedOffice, floor_id: selectedFloor, space_id: selectedSpace }),
        [limit, offset, selectedOffice, selectedSpace, selectedFloor]
    );

    const [offices, setOffices] = useState<any[]>([]);
    const { mutate: loadOffices } = useOfficesMutation(params, (data) => setOffices(data));

    const [viewWelcomeMessage, setViewWelcomeMessage] = useState(true);
    const [activePlan, setActivePlan] = useState<string>("");

    const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
    const [fromSelf, setFromSelf] = useState(false);
    const [myVertex, setMyVertex] = useState<number | null>(null);
    const [startVertex, setStartVertex] = useState<number | null>(null);
    const [endVertex, setEndVertex] = useState<number | null>(null);

    const [viewBox, setViewBox] = useState<[number, number]>([0, 0]);
    const [nativeImage] = useImage(`${import.meta.env.VITE_URL}${activePlan}`);

    const [users, setUsers] = useState<any[]>([]);
    const [activeUser, setActiveUser] = useState<number | null>(null);
    const [activeUserImg, setActiveUserImg] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>([]);
    const [roomData, setRoomData] = useState<any>([]);

    const { routePoints, loading: routeLoading } = useRoute(startVertex, endVertex, viewBox[1]);

    const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
    const [roomOptions, setRoomOptions] = useState<{ value: string; label: string }[]>([]);
    const [activeRoom, setActiveRoom] = useState<string | undefined>();
    const [roomPolygon, setRoomPolygon] = useState<number[]>([]);

    const handleWorkspaceChange = useCallback((ws: any) => {
        setSelectedWorkspace(ws);
        setActivePlan(ws?.plan || "");
        setActiveUser(null);
        setUserCoords(null);
        setEndVertex(null);
        setActiveRoom(undefined);
        setRoomPolygon([]);
    }, []);

    const handleUserChange = useCallback(
        (id: number) => {
            const curUser = users.find((user) => user.id === +id);
            const curOffice = offices.find(({ id }) => id === selectedWorkspace.office_id);
            const curFloor = curOffice?.floors.find(({ id }: { id: number }) => id === selectedWorkspace.floor_id);

            setUserData({
                title: curUser.first_name ? `${curUser.first_name[0]}. ${curUser.last_name}` : "",
                officeTitle: curOffice.title,
                floorTitle: curFloor.title,
                workspaceTitle: selectedWorkspace.title,
            });

            setActiveUser(id);
        },
        [users, selectedWorkspace, offices]
    );

    const handleRoomChange = useCallback((val: string) => {
        const curRoom = roomOptions.find((room) => room.value === val);

        setRoomData({ title: curRoom?.label });
        setActiveRoom(val);
    }, []);

    const handleInitTransform = useCallback(
        ({ setTransform }: { setTransform: any }) => {
            const [w, h] = viewBox;
            const { width: cw, height: ch } = dims;
            const fit = Math.min(cw / w, ch / h) * 0.9;
            setTransform((cw - w * fit) / 2, (ch - h * fit) / 2, fit, fit);
        },
        [dims, viewBox]
    );

    useEffect(() => loadOffices(), [loadOffices]);

    useEffect(() => {
        api.get("/users/profile/").then((r) => setUsers(r.data.results));
    }, []);

    useEffect(() => {
        if (!me) return;
        api.get(`/users/profile/${me.id}/get_user_desktop/`).then((r) => setMyVertex(r.data.vertex.id));
    }, [me]);

    useEffect(() => {
        if (!activeUser) {
            setUserCoords(null);
            setEndVertex(null);
            return;
        }
        api.get(`/users/profile/${activeUser}/get_user_desktop/`).then((r) => {
            if (r.data.center_x != null && r.data.center_y != null) {
                setUserData((prev: any) => ({ ...prev, roomTitle: `Место ${r.data.title}` }));
                setUserCoords([r.data.center_x, r.data.center_y]);
            } else setUserCoords(null);
        });

        setActiveUserImg(users.find(({ id }) => id === activeUser)?.avatar || null);
    }, [activeUser, selectedWorkspace, offices]);

    useEffect(() => {
        if (!selectedWorkspace) return setStartVertex(null);
        setStartVertex(myVertex ? myVertex : selectedWorkspace.default_start_vertex?.id || null);
    }, [selectedWorkspace, myVertex]);

    useEffect(() => {
        const onResize = () => setDims({ width: window.innerWidth, height: window.innerHeight - 200 });
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (!activePlan) return;
        setViewWelcomeMessage(false);
        fetch(`${import.meta.env.VITE_URL}${activePlan}`)
            .then((r) => r.text())
            .then((txt) => {
                const svg = new DOMParser().parseFromString(txt, "image/svg+xml").documentElement;
                const vb = svg.getAttribute("viewBox")!;
                const [, , w, h] = vb.split(" ").map(Number);
                setViewBox([w, h]);
            });
    }, [activePlan]);

    useEffect(() => {
        api.get("/nav/rooms/").then((r) =>
            setRoomOptions(
                r.data.results.map((rm: any) => ({
                    value: `work_space_id=${selectedWorkspace.id}&search=${rm.title}&limit=1`,
                    label: rm.title,
                }))
            )
        );
    }, [selectedWorkspace]);

    useEffect(() => {
        if (!activeRoom) return setRoomPolygon([]);
        api.get(`/nav/rooms/?${activeRoom}`).then((r) => {
            setRoomPolygon(
                r.data.results[0].geometry
                    .flat(2)
                    .map(([x, y]: number[]) => [x, viewBox[1] - y])
                    .flat()
            );
            setRoomData({ title: r.data.results[0].title, workspaceTitle: selectedWorkspace.title });
        });
    }, [activeRoom, viewBox, selectedWorkspace]);

    const onBuildRoute = useCallback(() => {
        const start = myVertex ? myVertex : selectedWorkspace?.default_start_vertex?.id || null;
        setStartVertex(start);

        if (isRoomMode && activeRoom) {
            api.get(`/nav/rooms/?${activeRoom}`).then((r) => {
                const room = r.data.results[0];
                const entrance = room.entrances?.[0];
                if (entrance?.vertex) {
                    setEndVertex(entrance.vertex.id);
                    setUserCoords([entrance.vertex.center_x, entrance.vertex.center_y]);
                }
            });
        } else if (activeUser) {
            api.get(`/users/profile/${activeUser}/get_user_desktop/`).then((r) => {
                setEndVertex(r.data.vertex.id);
                if (r.data.center_x != null && r.data.center_y != null) {
                    setUserCoords([r.data.center_x, r.data.center_y]);
                }
            });
            setActiveUserImg(users.find(({ id }) => id === activeUser)?.avatar || null);
        }
    }, [myVertex, selectedWorkspace, activeUser, me, users, activeRoom, isRoomMode]);

    return {
        isRoomMode,
        theme,
        dims,
        stageRef,
        offices,
        selectedWorkspace,
        users,
        activeUser,
        activeUserImg,
        userData,
        roomData,
        roomOptions,
        activeRoom,
        fromSelf,
        viewWelcomeMessage,
        nativeImage,
        viewBox,
        userCoords,
        roomPolygon,
        routePoints,
        routeLoading,
        handleWorkspaceChange,
        handleUserChange,
        onRoomChange: handleRoomChange,
        onBuildRoute,
        handleInitTransform,
    };
}
