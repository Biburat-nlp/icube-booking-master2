import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "ru.icore.icubespace.app",
    appName: "iCUBE Space",
    webDir: "dist",
    server: {
      // Используем стандартную схему для основного приложения
      androidScheme: 'https',
      hostname: 'localhost',
      // Для iOS используем capacitor://localhost для основного приложения
      // но deep link icube:// остается в Info.plist для OAuth callback
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
