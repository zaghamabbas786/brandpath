# Logging Integration Examples

## Example 1: HomeScreen with Logging

```javascript
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import useLogger from '../hooks/useLogger';
import CustomHeader from '../components/CustomHeader';
import {getUserStateRequest} from '../actions/global';

const HomeScreen = ({navigation}) => {
  const logger = useLogger();
  const dispatch = useDispatch();
  const {userState, globalLoading} = useSelector(state => state.Global);
  const {user} = useSelector(state => state.Auth);

  // Log screen view on mount
  useEffect(() => {
    logger.screenView('HomeScreen', {
      username: user?.username,
      station: userState?.station,
    });
  }, []);

  // Log when user state changes
  useEffect(() => {
    if (userState) {
      logger.info('User state loaded', {
        station: userState.station,
        partner: userState.partnerKey,
      });
    }
  }, [userState]);

  const handleNavigateToScreen = (screenName) => {
    logger.userAction('navigate_to_screen', {
      from: 'HomeScreen',
      to: screenName,
    });
    navigation.navigate(screenName);
  };

  const handleRefresh = () => {
    logger.userAction('refresh_user_state', {
      username: user?.username,
    });
    dispatch(getUserStateRequest(user?.username));
  };

  return (
    <View>
      <CustomHeader title="Home" />
      <Text>Welcome {user?.username}</Text>
      
      <TouchableOpacity onPress={() => handleNavigateToScreen('Dispatch')}>
        <Text>Go to Dispatch</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleRefresh}>
        <Text>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
```

## Example 2: Barcode Scanner Component with Logging

```javascript
import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import useLogger from '../hooks/useLogger';
import {barCodeAction} from '../actions/global';

const BarCodeReader = ({currentPage}) => {
  const logger = useLogger();
  const dispatch = useDispatch();
  const [barcode, setBarcode] = useState('');
  const {user} = useSelector(state => state.Auth);
  const {globalLoading, error} = useSelector(state => state.Global);

  const handleScan = () => {
    if (!barcode.trim()) {
      logger.warning('Empty barcode scan attempted', {
        currentPage,
        username: user?.username,
      });
      return;
    }

    logger.info('Barcode scan initiated', {
      barcodeLength: barcode.length,
      currentPage,
      username: user?.username,
    });

    dispatch(
      barCodeAction({
        currentPage,
        userName: user?.username,
        barcode: barcode.trim(),
        page: currentPage,
      }),
    );

    setBarcode('');
  };

  // Log errors
  React.useEffect(() => {
    if (error) {
      logger.error('Barcode scan error', new Error(error), {
        currentPage,
        barcode,
        username: user?.username,
      });
    }
  }, [error]);

  return (
    <View>
      <TextInput
        value={barcode}
        onChangeText={setBarcode}
        placeholder="Scan or enter barcode"
      />
      <Button
        title="Scan"
        onPress={handleScan}
        disabled={globalLoading}
      />
    </View>
  );
};

export default BarCodeReader;
```

## Example 3: Login Screen with Comprehensive Logging

```javascript
import React, {useState, useEffect} from 'react';
import {View, TextInput, Button, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import useLogger from '../hooks/useLogger';
import {azureLogin} from '../actions/auth';

const LoginScreen = () => {
  const logger = useLogger();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const {error, isAuthenticated} = useSelector(state => state.Auth);

  // Log screen mount
  useEffect(() => {
    logger.screenView('LoginScreen', {
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Log authentication success
  useEffect(() => {
    if (isAuthenticated) {
      logger.info('User authenticated successfully', {
        authMethod: 'azure',
        email: email,
      });
    }
  }, [isAuthenticated]);

  // Log authentication errors
  useEffect(() => {
    if (error) {
      logger.error('Authentication failed', new Error(error), {
        email: email,
        authMethod: 'azure',
      });
    }
  }, [error]);

  const handleLogin = async () => {
    if (!email.trim()) {
      logger.warning('Login attempted with empty email', {
        timestamp: new Date().toISOString(),
      });
      return;
    }

    logger.userAction('login_initiated', {
      email: email,
      authMethod: 'azure',
    });

    setLoading(true);
    try {
      dispatch(azureLogin(email));
    } catch (error) {
      logger.error('Login dispatch failed', error, {
        email: email,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button
        title="Login with Azure"
        onPress={handleLogin}
        disabled={loading}
      />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
    </View>
  );
};

export default LoginScreen;
```

## Example 4: Enhanced Error Handler with Logging

```javascript
// utils/errorHandler.js

import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import store from '../store';
import {logError} from '../actions/logging';

const eventEmitter = new EventEmitter();

export const globalErrorHandler = errorMessage => {
  // Log error to backend
  store.dispatch(
    logError('Global error occurred', new Error(errorMessage), {
      source: 'globalErrorHandler',
    }),
  );
  
  eventEmitter.emit('GLOBAL_ERROR', errorMessage);
};

export const onGlobalError = callback => {
  eventEmitter.addListener('GLOBAL_ERROR', callback);
};

export const offGlobalError = callback => {
  eventEmitter.remove('GLOBAL_ERROR', callback);
};

export const formatError = e => {
  if (!e) {
    const error = 'Network error: API not reachable.';
    
    // Log network error
    store.dispatch(
      logError(error, null, {
        errorType: 'network',
        source: 'formatError',
      }),
    );
    
    return [error];
  }
  
  const formattedError = ['Unexpected error occurred', e.message || e];
  
  // Log formatted error
  store.dispatch(
    logError(formattedError[0], e, {
      errorType: 'unexpected',
      source: 'formatError',
    }),
  );
  
  return formattedError;
};
```

## Example 5: Dispatch Screen with Detailed Logging

```javascript
import React, {useEffect, useState} from 'react';
import {View, FlatList, TouchableOpacity, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import useLogger from '../hooks/useLogger';
import {
  getDispatchListRequest,
  getOrderDetailRequest,
  setDispatchRefNumber,
} from '../actions/global';

const DispatchScreen = ({navigation}) => {
  const logger = useLogger();
  const dispatch = useDispatch();
  const {dispatchList, dispatchListLoading, orderDetail} = useSelector(
    state => state.Global,
  );
  const {user} = useSelector(state => state.Auth);

  // Log screen view
  useEffect(() => {
    logger.screenView('DispatchScreen', {
      username: user?.username,
      listCount: dispatchList?.length || 0,
    });
  }, []);

  // Load dispatch list
  useEffect(() => {
    if (user?.username) {
      logger.info('Loading dispatch list', {
        username: user.username,
      });
      
      dispatch(getDispatchListRequest(user.username));
    }
  }, [user]);

  // Log when list loads
  useEffect(() => {
    if (dispatchList && !dispatchListLoading) {
      logger.info('Dispatch list loaded', {
        itemCount: dispatchList.length,
        username: user?.username,
      });
    }
  }, [dispatchList, dispatchListLoading]);

  const handleSelectOrder = item => {
    logger.userAction('dispatch_order_selected', {
      orderRef: item.orderRef,
      customerName: item.customerName,
      username: user?.username,
    });

    dispatch(setDispatchRefNumber(item.orderRef));
    dispatch(getOrderDetailRequest(user.username, item.orderRef));
    navigation.navigate('DispatchDetailScreen');
  };

  const handleRefresh = () => {
    logger.userAction('dispatch_list_refreshed', {
      username: user?.username,
      previousCount: dispatchList?.length || 0,
    });

    dispatch(getDispatchListRequest(user.username));
  };

  return (
    <View>
      <Text>Dispatch List</Text>
      <TouchableOpacity onPress={handleRefresh}>
        <Text>Refresh</Text>
      </TouchableOpacity>
      
      <FlatList
        data={dispatchList}
        keyExtractor={item => item.orderRef}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleSelectOrder(item)}>
            <Text>{item.orderRef} - {item.customerName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DispatchScreen;
```

## Example 6: Stock Move with Error Handling and Logging

```javascript
import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import useLogger from '../hooks/useLogger';
import {
  startStockMoveRequest,
  cancelStockMoveRequest,
} from '../actions/inventory';

const StockMoveScreen = () => {
  const logger = useLogger();
  const dispatch = useDispatch();
  const {stockMoveDetail, loading, error} = useSelector(
    state => state.Inventory,
  );
  const {user} = useSelector(state => state.Auth);

  useEffect(() => {
    logger.screenView('StockMoveScreen', {
      username: user?.username,
    });
  }, []);

  const handleStartMove = () => {
    try {
      logger.userAction('stock_move_started', {
        username: user?.username,
        timestamp: new Date().toISOString(),
      });

      dispatch(startStockMoveRequest(user?.username));
    } catch (error) {
      logger.error('Failed to start stock move', error, {
        username: user?.username,
      });
    }
  };

  const handleCancelMove = () => {
    logger.userAction('stock_move_cancelled', {
      username: user?.username,
      moveDetail: stockMoveDetail,
    });

    dispatch(cancelStockMoveRequest(user?.username));
  };

  // Log stock move completion
  useEffect(() => {
    if (stockMoveDetail?.completed) {
      logger.info('Stock move completed', {
        moveId: stockMoveDetail.id,
        from: stockMoveDetail.fromLocation,
        to: stockMoveDetail.toLocation,
        quantity: stockMoveDetail.quantity,
        username: user?.username,
      });
    }
  }, [stockMoveDetail]);

  // Log errors
  useEffect(() => {
    if (error) {
      logger.error('Stock move error', new Error(error), {
        username: user?.username,
        moveDetail: stockMoveDetail,
      });
    }
  }, [error]);

  return (
    <View>
      <Text>Stock Move</Text>
      <Button title="Start Move" onPress={handleStartMove} />
      <Button title="Cancel" onPress={handleCancelMove} />
    </View>
  );
};

export default StockMoveScreen;
```

## Example 7: App.tsx with Global Logging

```javascript
// App.tsx
import React, {useEffect} from 'react';
import {AppState} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import useLogger from './hooks/useLogger';
import * as Sentry from '@sentry/react-native';

const App = () => {
  const logger = useLogger();
  const {isAuthenticated, user} = useSelector(state => state.Auth);

  // Log app initialization
  useEffect(() => {
    logger.info('App initialized', {
      version: '3.7.0',
      buildNumber: 34,
    });
  }, []);

  // Log authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      logger.info('User session active', {
        username: user?.username,
      });
    } else {
      logger.info('User session inactive');
    }
  }, [isAuthenticated]);

  // Log app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      logger.info('App state changed', {
        newState: nextAppState,
        username: user?.username,
      });
    });

    return () => subscription.remove();
  }, []);

  // Log unhandled errors
  useEffect(() => {
    const errorHandler = (error, isFatal) => {
      logger.error('Unhandled error', error, {
        isFatal,
        username: user?.username,
      });
      Sentry.captureException(error);
    };

    // Note: You'd need to set up global error handling
    return () => {
      // Cleanup
    };
  }, []);

  return (
    // Your app content
  );
};

export default App;
```

## Key Takeaways

1. **Always log screen views** - Helps track user navigation
2. **Log user actions** - Button clicks, form submissions, etc.
3. **Log errors with context** - Include relevant data for debugging
4. **Don't log sensitive data** - Passwords, tokens, etc.
5. **Use appropriate log levels** - info, warning, error, debug
6. **Add metadata** - Username, page, action details
7. **Log state changes** - Especially important ones
8. **Leverage automatic logging** - API calls and barcode scans are logged automatically

## Testing Your Logging

Create a test screen:

```javascript
import React from 'react';
import {View, Button, ScrollView, Text} from 'react-native';
import useLogger from '../hooks/useLogger';

const LoggingTestScreen = () => {
  const logger = useLogger();

  return (
    <ScrollView>
      <Text>Logging Test Screen</Text>
      
      <Button
        title="Test Info Log"
        onPress={() => logger.info('Test info message', {test: true})}
      />
      
      <Button
        title="Test Warning Log"
        onPress={() => logger.warning('Test warning', {level: 'warn'})}
      />
      
      <Button
        title="Test Error Log"
        onPress={() =>
          logger.error('Test error', new Error('Test'), {context: 'test'})
        }
      />
      
      <Button
        title="Test User Action"
        onPress={() => logger.userAction('test_button_clicked')}
      />
      
      <Button
        title="Test Screen View"
        onPress={() => logger.screenView('TestScreen')}
      />
      
      <Button
        title="Flush Logs"
        onPress={() => logger.flush()}
      />
    </ScrollView>
  );
};

export default LoggingTestScreen;
```

