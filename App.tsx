import * as Keychain from 'react-native-keychain';
import 'react-native-gesture-handler';
import {Platform} from 'react-native';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import AppStackScreen from './drawer/AppStackScreen';
import AuthStackScreen from './drawer/AuthStackScreen';
import LoaderScreen from './components/LoaderScreen ';
import {Provider as ReduxProvider, useSelector} from 'react-redux';
import SnackBarComponent from './components/SnackBarComponent';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SnackbarProvider} from './context/SnackbarContext';
import {createNavigationContainerRef} from '@react-navigation/native';
import {Buffer} from 'buffer';

import store from './store';
import {AuthProvider} from './context/auth/AuthContext';
import * as Sentry from '@sentry/react-native';
import {decodeJwt} from './utils/jwt';

Sentry.init({
  dsn: 'https://d9662ad4abf05d35701627f363a229ec@o4510109389029376.ingest.us.sentry.io/4510109391978496',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export const navigationRef = createNavigationContainerRef();

const App = () => {
  if (typeof atob === 'undefined') {
    global.atob = input => {
      return Buffer.from(input, 'base64').toString('binary');
    };
  }
  const {isAuthenticated, isInitialized} = useSelector(
    (state: any) => state.Auth,
  );

  useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();
  }, []);

  useEffect(() => {
    const initializeTracking = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const username = decodeJwt(credentials.password);
          
          // Set Sentry user
          Sentry.setUser({
            username: username ?? undefined,
          });
        
        } else {
          Sentry.setUser(null);
        }
        
      
      } catch (error) {
        // Report errors to both Sentry and Firebase Crashlytics
        Sentry.captureException(error);
      }
    };

    initializeTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      {!isInitialized ? (
        <LoaderScreen />
      ) : isAuthenticated ? (
        <AppStackScreen />
      ) : (
        <AuthStackScreen />
      )}
      <SnackBarComponent />
    </NavigationContainer>
  );
};

const Root = () => {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <SnackbarProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SnackbarProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
};

export default Sentry.wrap(Root);
