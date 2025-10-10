import { IonContent } from "@ionic/react";
import React from "react";

import { useNavigationPage } from "@/features/navigation/hooks/useNavigationPage";
import { NavigationMap } from "@/features/navigation/ui/NavigationMap";
import { NavigationPageHeader } from "@/features/navigation/ui/NavigationPageHeader";
import { getFullUrl } from "@/shared/utils/getFullUrl.ts";
import s from "./NavigationPage.module.scss";

export const NavigationPage = ({ path }: { path: string }) => {
    const page = useNavigationPage(path);

    return (
        <IonContent
            scrollY={false}
            className={s.container}
        >
            <NavigationPageHeader
                offices={page.offices}
                selectedWorkspace={page.selectedWorkspace}
                onWorkspaceChange={page.handleWorkspaceChange}
                users={page.users}
                activeUser={page.activeUser}
                onUserChange={page.handleUserChange}
                roomOptions={page.roomOptions}
                activeRoom={page.activeRoom}
                onRoomChange={page.onRoomChange}
                isRoomMode={page.isRoomMode}
            />

            <NavigationMap
                dims={page.dims}
                theme={page.theme}
                nativeImage={page.nativeImage}
                viewWelcomeMessage={page.viewWelcomeMessage}
                viewBox={page.viewBox}
                userCoords={page.userCoords}
                roomPolygon={page.roomPolygon}
                routePoints={page.routePoints}
                onInitTransform={page.handleInitTransform}
                stageRef={page.stageRef}
                activeUserImg={page.activeUserImg}
                onBuildRoute={page.onBuildRoute}
                isRoomMode={page.isRoomMode}
                userData={page.userData}
                roomData={page.roomData}
            />
        </IonContent>
    );
};
