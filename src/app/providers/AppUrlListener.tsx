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
            await InAppBrowser.close();
            
            // Сохраняем callback URL для обработки Keycloak
            sessionStorage.setItem('keycloak_callback_url', event.url);
            
            // Для мобильных платформ используем более безопасный способ перезагрузки
            if (window.location.href.includes('localhost')) {
              // Если мы на localhost, просто перезагружаем
              window.location.reload();
            } else {
              // Иначе перенаправляем на главную страницу
              window.location.href = window.location.origin;
            }
          } else {
            // Обрабатываем hash для обычной навигации
            const hash = url.hash.substring(1);
            if (hash) {
              await InAppBrowser.close();
              // Используем более безопасный способ навигации
              try {
                window.location.replace('/#' + hash);
              } catch (error) {
                console.error('Navigation error:', error);
                window.location.href = '/#' + hash;
              }
            }
          }
        } catch (error) {
          console.error('Error processing URL:', error);
        }
      });
    }, []);
  
    return null;
  };
  
  export default AppUrlListener;