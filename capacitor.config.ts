import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "ru.icore.icubespace.app",
    appName: "iCUBE Space",
    webDir: "dist",
    server: {
      androidScheme: 'https',
      hostname: 'localhost',

    },
    plugins: {
        StatusBar: {
          overlaysWebView: false,
          style: "DARK",
        },
        CapacitorHttp: {
          enabled: true
        }
      },
};

export default config;
