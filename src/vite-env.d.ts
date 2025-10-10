/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_KEYCLOAK_URL: string;
    readonly VITE_KEYCLOAK_REALM: string;
    readonly VITE_KEYCLOAK_CLIENT_ID: string;
    readonly VITE_API_URL: string;
    readonly VITE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "*.svg?react" {
    import type { FC, SVGProps } from "react";
    const ReactComponent: FC<SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

declare module "*.json" {
    const value: { [key: string]: string };
    export default value;
}
