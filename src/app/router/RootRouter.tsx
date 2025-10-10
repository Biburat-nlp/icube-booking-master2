import { IonRouterOutlet } from "@ionic/react";
import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider.tsx";
import { ROUTES_FIELD } from "@/app/router/constants";
import { PublicOnlyRoute } from "@/app/router/PublicOnlyRoute.tsx";

import { AuthPage } from "@/pages/AuthPage/AuthPage";
import { InvitationsPage } from "@/pages/InvitationsPage/InvitationsPage";
import { LoadingPage } from "@/pages/LoadingPage/LoadingPage.tsx";
import { LockersPage } from "@/pages/LockersPage/LockersPage";
import { MeetingRoomsPage } from "@/pages/MeetingRoomsPage/MeetingRoomsPage";
import { MyOfficePage } from "@/pages/MyOfficePage/MyOfficePage";
import { NavigationPage } from "@/pages/NavigationPage/NavigationPage.tsx";
import { ParkingPage } from "@/pages/ParkingPage/ParkingPage";
import { ProfilePage } from "@/pages/ProfilePage/ProfilePage";
import { WorkspacesPage } from "@/pages/WorkspacesPage/WorkspacesPage";

import { ProtectedRoute } from "./ProtectedRoute";

export const RootRouter = () => {
    const location = useLocation();
    const { isLoading } = useAuth();

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <IonRouterOutlet>
            <PublicOnlyRoute
                exact
                path={ROUTES_FIELD.AUTH.path}
                component={AuthPage}
            />
            <Route
                exact
                path="/"
            >
                <Redirect to={{ pathname: ROUTES_FIELD.OFFICE.path, search: location.search }} />
            </Route>

            <Route
                exact
                path={ROUTES_FIELD.RESERVATION.path}
            >
                <Redirect to={{ pathname: ROUTES_FIELD.WORKSPACES.path, search: location.search }} />
            </Route>

            <Route
                exact
                path={ROUTES_FIELD.NAVIGATION.path}
            >
                <Redirect to={{ pathname: ROUTES_FIELD.NAV_COLLEAGUES.path, search: location.search }} />
            </Route>

            <ProtectedRoute
                exact
                path={ROUTES_FIELD.OFFICE.path}
                component={MyOfficePage}
            />
            <ProtectedRoute
                exact
                path={ROUTES_FIELD.LOCKERS.path}
                component={LockersPage}
            />
            <ProtectedRoute
                exact
                path={ROUTES_FIELD.MEETING_ROOMS.path}
                component={MeetingRoomsPage}
            />
            <ProtectedRoute
                exact
                path={ROUTES_FIELD.WORKSPACES.path}
                component={WorkspacesPage}
            />
            <ProtectedRoute
                exact
                path={ROUTES_FIELD.PARKINGS.path}
                component={ParkingPage}
            />
            <ProtectedRoute
                exact
                path={ROUTES_FIELD.NAV_ROOMS.path}
                component={NavigationPage}
            />
            <ProtectedRoute
                exact
                path={ROUTES_FIELD.NAV_COLLEAGUES.path}
                component={NavigationPage}
            />
            <ProtectedRoute
                exact
                path={ROUTES_FIELD.INVITATIONS.path}
                component={InvitationsPage}
            />
            <ProtectedRoute
                exact
                path={ROUTES_FIELD.PROFILE.path}
                component={ProfilePage}
            />
        </IonRouterOutlet>
    );
};
