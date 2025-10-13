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
            // Переносим code/state из deep link в URL WebView, чтобы keycloak-js смог их обработать
            const params = url.searchParams.toString();
            const current = new URL(window.location.href);
            const newHref = `${current.origin}${current.pathname}?${params}${current.hash || ''}`;
            await InAppBrowser.close();
            window.location.replace(newHref);
            return;
          } else if (url.searchParams.has('error')) {
            console.error('OAuth error:', url.searchParams.get('error'));
            await InAppBrowser.close();
            // Можно показать пользователю ошибку
          } else {
            // Если OAuth вернулся во фрагменте (#code&state=...), конвертируем во входные параметры запроса
            const hash = url.hash.substring(1);
            if (hash) {
              const params = new URLSearchParams(hash);
              if (params.has('code') && params.has('state')) {
                const current = new URL(window.location.href);
                const newHref = `${current.origin}${current.pathname}?${params.toString()}`;
                await InAppBrowser.close();
                window.location.replace(newHref);
                return;
              } else {
                // Обычная навигация по hash
                await InAppBrowser.close();
                window.location.replace('/#' + hash);
              }
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