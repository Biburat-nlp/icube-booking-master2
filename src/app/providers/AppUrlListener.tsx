import React, { useEffect, useRef } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { InAppBrowser } from '@capacitor/inappbrowser';
import { exchangeCodeForTokens } from '@/features/auth/keycloak';
import { PKCE_KEYS } from '@/features/auth/pkce';
import { Preferences } from '@capacitor/preferences';

const PROCESSED_CODE_KEY = 'auth_processed_code';

const AppUrlListener: React.FC<any> = () => {
    const processingRef = useRef<boolean>(false);
    
    useEffect(() => {
      const processUrl = async (eventUrl: string) => {
        console.log('AppUrlListener received URL:', eventUrl);
        
        // Защита от одновременной обработки
        if (processingRef.current) {
          console.log('Already processing an auth callback, skipping');
          return;
        }
        
        try {
          const url = new URL(eventUrl);
          // Проверяем, что это callback от Keycloak
          if (url.searchParams.has('code') && url.searchParams.has('state')) {
            const code = url.searchParams.get('code')!;
            const state = url.searchParams.get('state')!;
            
            // Проверяем, не был ли этот код уже обработан
            const { value: processedCode } = await Preferences.get({ key: PROCESSED_CODE_KEY });
            if (processedCode === code) {
              console.log('Code already processed, skipping:', code.substring(0, 10) + '...');
              return;
            }
            
            // Отмечаем, что начали обработку
            processingRef.current = true;
            await Preferences.set({ key: PROCESSED_CODE_KEY, value: code });
            
            const { value: expectedState } = await Preferences.get({ key: PKCE_KEYS.state });
            if (expectedState && expectedState !== state) {
              console.error('State mismatch, aborting.');
              return;
            }
            try { await InAppBrowser.close(); } catch (e) { console.warn('IAB close ignored:', e); }
            // Меняем код на токены нативно и перезагружаем UI
            try {
              console.log('Exchanging auth code for tokens (query) ...');
              const { value: redirectUri } = await Preferences.get({ key: PKCE_KEYS.redirectUri });
              console.log('Using redirectUri for exchange:', redirectUri);
              await exchangeCodeForTokens(code, redirectUri || 'icube://token');
              
              // Используем setTimeout чтобы дать время токенам сохраниться
              setTimeout(() => {
                // Очищаем URL от параметров авторизации перед перезагрузкой
                window.history.replaceState({}, document.title, '/');
                window.location.reload();
              }, 100);
            } catch (e) {
              console.error('Token exchange failed (query):', e);
            }
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
              const code = params.get('code')!;
              const state = params.get('state')!;
              
              // Проверяем, не был ли этот код уже обработан
              const { value: processedCode } = await Preferences.get({ key: PROCESSED_CODE_KEY });
              if (processedCode === code) {
                console.log('Code already processed (fragment), skipping:', code.substring(0, 10) + '...');
                return;
              }
              
              // Отмечаем, что начали обработку
              processingRef.current = true;
              await Preferences.set({ key: PROCESSED_CODE_KEY, value: code });
              
              const { value: expectedState } = await Preferences.get({ key: PKCE_KEYS.state });
              if (expectedState && expectedState !== state) {
                console.error('State mismatch, aborting.');
                return;
              }
              try { await InAppBrowser.close(); } catch (e) { console.warn('IAB close ignored:', e); }
              try {
                console.log('Exchanging auth code for tokens (fragment) ...');
                const { value: redirectUri } = await Preferences.get({ key: PKCE_KEYS.redirectUri });
                console.log('Using redirectUri for exchange:', redirectUri);
                await exchangeCodeForTokens(code, redirectUri || 'icube://token');
                
                // Используем setTimeout чтобы дать время токенам сохраниться
                setTimeout(() => {
                  // Очищаем URL от параметров авторизации перед перезагрузкой
                  window.history.replaceState({}, document.title, '/');
                  window.location.reload();
                }, 100);
              } catch (e) {
                console.error('Token exchange failed (fragment):', e);
              }
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