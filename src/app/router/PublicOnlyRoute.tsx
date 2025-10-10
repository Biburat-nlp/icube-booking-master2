import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider.tsx";
import { ROUTES_FIELD } from "@/app/router/constants.ts";

import type { RouteProps } from "react-router-dom";

interface IProps extends RouteProps {
    component: React.ComponentType<any>;
}

export const PublicOnlyRoute = ({ component: Component, ...rest }: IProps) => {
    const { user } = useAuth();

    return (
        <Route
            {...rest}
            render={(props) => {
                if (user) {
                    return (
                        <Redirect
                            to={{
                                pathname: ROUTES_FIELD.OFFICE.path,
                                state: {
                                    from: props.location.pathname + props.location.search,
                                },
                            }}
                        />
                    );
                }

                return <Component {...props} />;
            }}
        />
    );
};
