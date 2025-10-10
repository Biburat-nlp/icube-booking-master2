## iCube

# Зависимости
npm i
nvm use 23
Android Studio
XCode
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home

# Окружение
Скопируйте .env.example в .env и корректируйте под себя.

# Разбработка в вебе
npm run dev

# Сборка Android (тестовая) на устройство
npm run build:android
android/app/build/outputs/apk/debug/app-debug.apk

# Разбработка на iOS
npm run dev:ios

# Сборка iOS
npm run build:ios