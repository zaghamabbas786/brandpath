import * as Keychain from 'react-native-keychain';
import {createContext, useEffect, useCallback, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useDispatch} from 'react-redux';
import {initial, sessionExpireRequest} from '../../actions/auth'; // Adjust the import path
import {AppState} from 'react-native';

const AuthContext = createContext();
const AuthProvider = ({children}) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const dispatch = useDispatch();

  const initialize = useCallback(async () => {
    const credentials = await Keychain.getGenericPassword();

    const timeoutValueFromStorage = await AsyncStorage.getItem('timeout');
    const timeout = JSON.parse(timeoutValueFromStorage);

    // Check if credentials exist and set timeout accordingly
    const timeoutValue = credentials ? true : timeout;

    dispatch(initial(timeoutValue));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          const credentials = await Keychain.getGenericPassword();

          if (credentials) {
            dispatch(sessionExpireRequest());
          }
        }
        setAppState(nextAppState);
      },
    );

    return () => {
      subscription.remove(); // Clean up the event listener on unmount
    };
    // eslint-disable-next-line
  }, [appState]);

  useEffect(() => {
    initialize();

    // eslint-disable-next-line
  }, [initialize]);

  return children;
};

export {AuthProvider, AuthContext};
