import React, { useEffect, useRef, useState } from 'react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { InAppBrowser } from '@capacitor/inappbrowser';
import { exchangeCodeForTokens } from '@/features/auth/keycloak';
import { PKCE_KEYS } from '@/features/auth/pkce';
import { Preferences } from '@capacitor/preferences';

const PROCESSED_CODE_KEY = 'auth_processed_code';

const AppUrlListener: React.FC<any> = () => {
    const processingRef = useRef<boolean>(false);
    const [authErrors, setAuthErrors] = useState<string[]>([]);

    const addError = (message: string) => {
      setAuthErrors((prev) => {
        const next = [...prev, message];
        return next.slice(-8);
      });
    };
    
    useEffect(() => {
      const processUrl = async (eventUrl: string) => {
        
        // Защита от одновременной обработки
        if (processingRef.current) {
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
              addError('Auth callback duplicated: code already processed.');
              return;
            }
            
            // Отмечаем, что начали обработку
            processingRef.current = true;
            await Preferences.set({ key: PROCESSED_CODE_KEY, value: code });
            
            const { value: expectedState } = await Preferences.get({ key: PKCE_KEYS.state });
            if (expectedState && expectedState !== state) {
              addError(`State mismatch. Expected: ${expectedState}, got: ${state}`);
              return;
            }
            try { await InAppBrowser.close(); } catch (e) {}
            // Меняем код на токены нативно и перезагружаем UI
            try {
              const { value: redirectUri } = await Preferences.get({ key: PKCE_KEYS.redirectUri });
              await exchangeCodeForTokens(code, redirectUri || 'icube://token');
              
              // Используем setTimeout чтобы дать время токенам сохраниться
              setTimeout(() => {
                // Очищаем URL от параметров авторизации перед перезагрузкой
                window.history.replaceState({}, document.title, '/');
                window.location.reload();
              }, 100);
            } catch (e: any) {
              const msg = e?.message || 'Token exchange failed';
              addError(`Token exchange error: ${msg}`);
            }
            return;
          }
          if (url.searchParams.has('error')) {
            await InAppBrowser.close();
            const err = url.searchParams.get('error') || 'unknown_error';
            const desc = url.searchParams.get('error_description') || '';
            addError(`Keycloak error: ${err}${desc ? ` - ${desc}` : ''}`);
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
                addError('Auth callback duplicated (hash): code already processed.');
                return;
              }
              
              // Отмечаем, что начали обработку
              processingRef.current = true;
              await Preferences.set({ key: PROCESSED_CODE_KEY, value: code });
              
              const { value: expectedState } = await Preferences.get({ key: PKCE_KEYS.state });
              if (expectedState && expectedState !== state) {
                addError(`State mismatch (hash). Expected: ${expectedState}, got: ${state}`);
                return;
              }
              try { await InAppBrowser.close(); } catch (e) {}
              try {
                const { value: redirectUri } = await Preferences.get({ key: PKCE_KEYS.redirectUri });
                await exchangeCodeForTokens(code, redirectUri || 'icube://token');
                
                // Используем setTimeout чтобы дать время токенам сохраниться
                setTimeout(() => {
                  // Очищаем URL от параметров авторизации перед перезагрузкой
                  window.history.replaceState({}, document.title, '/');
                  window.location.reload();
                }, 100);
              } catch (e: any) {
                const msg = e?.message || 'Token exchange failed (hash)';
                addError(`Token exchange error (hash): ${msg}`);
              }
              return;
            }
            await InAppBrowser.close();
            window.location.replace('/#' + hash);
          }
        } catch (error) {
          try { await InAppBrowser.close(); } catch {}
          const msg = (error as any)?.message || 'Auth URL processing failed';
          addError(`Auth processing error: ${msg}`);
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
  
    return authErrors.length ? (
      <div style={{
        position: 'fixed',
        left: 8,
        right: 8,
        bottom: 8,
        zIndex: 99999,
        background: '#fff',
        color: '#000',
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        fontSize: 13,
        maxHeight: '40vh',
        overflow: 'auto',
        whiteSpace: 'pre-wrap'
      }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Проблемы с авторизацией</div>
        {authErrors.map((e, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            {i + 1}. {e}
          </div>
        ))}
      </div>
    ) : null;
  };
  
  export default AppUrlListener;