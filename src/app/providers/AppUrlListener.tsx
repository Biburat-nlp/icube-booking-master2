import React, { useEffect } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { InAppBrowser } from '@capacitor/inappbrowser';

const AppUrlListener: React.FC<any> = () => {
    useEffect(() => {
      const processUrl = async (eventUrl: string) => {
        console.log('AppUrlListener received URL:', eventUrl);
        try {
          const url = new URL(eventUrl);
          // Проверяем, что это callback от Keycloak
          if (url.searchParams.has('code') && url.searchParams.has('state')) {
            const params = url.searchParams.toString();
            const current = new URL(window.location.href);
            const newHref = `${current.origin}${current.pathname}?${params}${current.hash || ''}`;
            await InAppBrowser.close();
            window.location.replace(newHref);
            return;
          }
          if (url.searchParams.has('error')) {
            console.error('OAuth error:', url.searchParams.get('error'));
            await InAppBrowser.close();
            return;
          }
          // Фоллбек: OAuth параметры во фрагменте
          const hash = url.hash.substring(1);
          if (hash) {
            const params = new URLSearchParams(hash);
            if (params.has('code') && params.has('state')) {
              const current = new URL(window.location.href);
              const newHref = `${current.origin}${current.pathname}?${params.toString()}`;
              await InAppBrowser.close();
              window.location.replace(newHref);
              return;
            }
            await InAppBrowser.close();
            window.location.replace('/#' + hash);
          }
        } catch (error) {
          console.error('Error processing URL:', error);
          try { await InAppBrowser.close(); } catch {}
        }
      };

      // Обработать URL запуска (cold start)
      App.getLaunchUrl().then((res) => {
        if (res?.url) {
          processUrl(res.url);
        }
      });

      // Слушать дальнейшие открытия по deep link
      App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
        await processUrl(event.url);
      });
    }, []);
  
    return null;
  };
  
  export default AppUrlListener;