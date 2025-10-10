import React from "react";
import { Route, Redirect } from "react-router-dom";

import { MainLayout } from "@/app/layouts/MainLayout/MainLayout.tsx";
import { useAuth } from "@/app/providers/AuthProvider.tsx";
import { ROUTES_FIELD } from "@/app/router/constants.ts";

import type { RouteProps } from "react-router-dom";

interface IProps extends RouteProps {
    component: React.ComponentType<any>;
}

export const ProtectedRoute = ({ component: Component, ...rest }: IProps) => {
    const { user } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!user) {
                    return (
                        <Redirect
                            to={{
                                pathname: ROUTES_FIELD.AUTH.path,
                                state: {
                                    from: props.location.pathname + props.location.search,
                                },
                            }}
                        />
                    );
                }

                return (
                    <MainLayout path={props.match.path}>
                        <Component
                            {...props}
                            path={props.match.path}
                        />
                    </MainLayout>
                );
            }}
        />
    );
};
