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
  dsn: 'https://94b7ee2504367ab346b16e3fbcbbdfce@o4509763158802432.ingest.de.sentry.io/4509763161227344',

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
  const {isAuthenticated, isInitialized, user} = useSelector(
    state => state.Auth,
  );

  useEffect(() => {
    if (Platform.OS === 'android') SplashScreen.hide();
  }, []);

  useEffect(() => {
    const setSentryUser = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const username = decodeJwt(credentials.password);
          Sentry.setUser({
            username: username ?? undefined,
          });
        } else {
          Sentry.setUser(null); // clear user if nothing found
        }
      } catch (error) {
        // Optional: report keychain errors too
        Sentry.captureException(error);
      }
    };

    setSentryUser();
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
