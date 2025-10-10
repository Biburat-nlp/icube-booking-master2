import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "ru.icore.icubespace.app",
    appName: "iCUBE Space",
    webDir: "dist",
    server: {
      // Используем стандартную схему для работы History API
      // Deep link icube:// остается в AndroidManifest для OAuth
      androidScheme: 'https',
      hostname: 'localhost',
      // Для iOS лучше не указывать iosScheme - будет capacitor://localhost
    },
    plugins: {
        StatusBar: {
          overlaysWebView: false,
          style: "DARK",
        },
        CapacitorHttp: {
          enabled: true  // Включаем для обхода CORS в native
        }
      },
};

export default config;
