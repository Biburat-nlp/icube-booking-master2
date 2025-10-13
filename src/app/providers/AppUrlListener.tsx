import React, { useEffect } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { InAppBrowser } from '@capacitor/inappbrowser';

const AppUrlListener: React.FC<any> = () => {
    useEffect(() => {
      App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
        console.log('AppUrlListener received URL:', event.url);
        
        try {
          const url = new URL(event.url);
          
          // Проверяем, что это callback от Keycloak
          if (url.searchParams.has('code') && url.searchParams.has('state')) {
            console.log('Keycloak callback detected');
            // Keycloak автоматически обработает callback при следующей инициализации
            await InAppBrowser.close();
            // Перезагружаем приложение для обработки callback
            window.location.reload();
          } else if (url.searchParams.has('error')) {
            console.error('OAuth error:', url.searchParams.get('error'));
            await InAppBrowser.close();
            // Можно показать пользователю ошибку
          } else {
            // Обрабатываем hash для обычной навигации
            const hash = url.hash.substring(1);
            if (hash) {
              await InAppBrowser.close();
              window.location.replace('/#' + hash);
            }
          }
        } catch (error) {
          console.error('Error processing URL:', error);
          // Закрываем браузер в случае ошибки
          try {
            await InAppBrowser.close();
          } catch (closeError) {
            console.error('Error closing browser:', closeError);
          }
        }
      });
    }, []);
  
    return null;
  };
  
  export default AppUrlListener;