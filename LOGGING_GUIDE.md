# Logging System Integration Guide

## Overview

A comprehensive logging system integrated with your Redux/Saga architecture that automatically logs all app events and sends them to your backend API at `https://4439rg71-44392.uks1.devtunnels.ms/mobile/Logging`.

## Features

✅ **Automatic API Logging** - All API calls are automatically logged with request/response data
✅ **Barcode Scan Logging** - Barcode scans are automatically logged in sagas  
✅ **Offline Queue** - Logs are queued when offline and sent when connection is restored
✅ **Batch Processing** - Logs are sent in batches to optimize network usage
✅ **Redux Integration** - Fully integrated with your Redux/Saga architecture
✅ **Easy-to-use Hook** - Simple `useLogger()` hook for components
✅ **User Context** - Logs include username, device info, and user state
✅ **Error Tracking** - Automatic error logging with stack traces

## File Structure

```
├── actions/
│   └── logging.js          # Logging actions
├── api/
│   └── global.js           # Logging endpoint added here (sendLogs)
├── sagas/
│   └── logging.js          # Logging saga
├── hooks/
│   └── useLogger.js        # Logging hook for components
└── services/
    └── apiService.js       # Enhanced with automatic API logging
```

## Usage

### 1. In Functional Components (Using Hook)

```javascript
import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import useLogger from '../hooks/useLogger';

const MyScreen = () => {
  const logger = useLogger();

  // Log screen view on mount
  useEffect(() => {
    logger.screenView('MyScreen', {
      previousScreen: 'HomeScreen',
    });
  }, []);

  const handleAction = () => {
    try {
      // Your logic here
      logger.userAction('button_clicked', {
        buttonName: 'Submit',
        formData: {/* your data */},
      });
    } catch (error) {
      logger.error('Failed to handle action', error, {
        buttonName: 'Submit',
      });
    }
  };

  return (
    <View>
      <Button title="Submit" onPress={handleAction} />
    </View>
  );
};

export default MyScreen;
```

### 2. In Sagas (Using Actions)

```javascript
import {put, call} from 'redux-saga/effects';
import * as loggingActions from '../actions/logging';

function* mySaga(action) {
  try {
    // Log info
    yield put(
      loggingActions.logInfo('Processing request', {
        actionType: action.type,
        payload: action.payload,
      }),
    );

    const response = yield call(someApi, action.payload);

    // Log success
    yield put(
      loggingActions.logInfo('Request successful', {
        responseData: response.data,
      }),
    );
  } catch (error) {
    // Log error
    yield put(
      loggingActions.logError('Request failed', error, {
        actionType: action.type,
      }),
    );
  }
}
```

### 3. Direct Dispatch (Anywhere with Redux Store)

```javascript
import store from '../store';
import {logInfo, logError} from '../actions/logging';

// In any file where you have access to the store
store.dispatch(logInfo('App initialized', {version: '1.0.0'}));

try {
  // Your code
} catch (error) {
  store.dispatch(logError('Something went wrong', error));
}
```

## Log Types

### 1. Info Logs
```javascript
logger.info('User logged in successfully', {
  userId: '12345',
  loginMethod: 'azure',
});
```

### 2. Warning Logs
```javascript
logger.warning('API response slow', {
  endpoint: '/mobile/Scan',
  duration: 5000,
});
```

### 3. Error Logs
```javascript
try {
  // Your code
} catch (error) {
  logger.error('Failed to save data', error, {
    context: 'SaveForm',
    formData: data,
  });
}
```

### 4. Debug Logs (Development Only)
```javascript
logger.debug('Debug info', {
  state: currentState,
  props: componentProps,
});
```

### 5. Screen View Logs
```javascript
useEffect(() => {
  logger.screenView('HomeScreen', {
    source: 'navigation',
  });
}, []);
```

### 6. User Action Logs
```javascript
const handleSubmit = () => {
  logger.userAction('form_submitted', {
    formName: 'UserSettings',
    fieldCount: 5,
  });
};
```

### 7. Barcode Scan Logs (Automatic in Sagas)
```javascript
// Already integrated in barCodeSaga
// Logs automatically when barcode is scanned
```

### 8. API Call Logs (Automatic)
```javascript
// All API calls through apiService are automatically logged
// No manual logging required
```

## Automatic Logging

### API Calls
All API calls through `services/apiService.js` are automatically logged with:
- Request method and endpoint
- Request/response data
- Status code
- Duration
- Errors (if any)

### Barcode Scans
Barcode scans in `barCodeSaga` are automatically logged with:
- Barcode value
- Current page
- Username
- Success/failure status

## Log Data Structure

Each log entry includes:

```javascript
{
  timestamp: "2025-01-23T10:30:00.000Z",
  level: "info" | "warning" | "error" | "debug",
  message: "User Action: button_clicked",
  username: "john.doe@example.com",
  userState: {
    station: "STATION_1",
    partnerKey: "PARTNER_KEY"
  },
  device: {
    platform: "android",
    platformVersion: "13",
    isTablet: false
  },
  eventType: "user_action",  // Optional
  action: "button_clicked",   // Optional
  // ... other metadata
}
```

## Batch Processing & Offline Support

- Logs are queued locally using AsyncStorage
- Sent in batches of 10 logs every 30 seconds
- If offline, logs are queued and sent when connection is restored
- Maximum queue size: 100 logs (older logs are discarded)
- Errors and large batches trigger immediate flush

## Manual Flush

Force all queued logs to be sent immediately:

```javascript
const logger = useLogger();

// Flush all logs
logger.flush();

// Or using Redux action
import {flushLogsRequest} from '../actions/logging';
dispatch(flushLogsRequest());
```

## Configuration

### Change API Endpoint

The logging endpoint follows your existing pattern in `api/global.js`:
```javascript
// In api/global.js
export const sendLogs = logs =>
  axios.post('/mobile/Logging', {
    logs,
    timestamp: new Date().toISOString(),
  });
```

The endpoint uses the same `apiService` as all your other endpoints, so it uses the base URL from your environment config (`utils/apiConfig.js` or `.env` files).

### Change Batch Size

Edit `sagas/logging.js`:
```javascript
const BATCH_SIZE = 20; // Change from 10 to 20
```

### Change Flush Interval

Edit `sagas/logging.js`:
```javascript
const FLUSH_INTERVAL = 60000; // Change from 30s to 60s
```

## Best Practices

1. **Don't Log Sensitive Data**
   ```javascript
   // ❌ Bad
   logger.info('User data', {password: '12345'});
   
   // ✅ Good
   logger.info('User data', {userId: user.id, email: user.email});
   ```

2. **Use Appropriate Log Levels**
   - `info`: Normal operations, user actions
   - `warning`: Unexpected but non-breaking issues
   - `error`: Errors that need attention
   - `debug`: Development debugging (not sent in production)

3. **Add Context to Logs**
   ```javascript
   logger.error('API call failed', error, {
     endpoint: '/mobile/Scan',
     attempt: 3,
     userId: currentUser.id,
   });
   ```

4. **Log Screen Views**
   ```javascript
   useEffect(() => {
     logger.screenView('ProductDetail', {
       productId: route.params.id,
       source: route.params.source,
     });
   }, []);
   ```

5. **Log Important User Actions**
   ```javascript
   const handleCheckout = () => {
     logger.userAction('checkout_initiated', {
       itemCount: cart.items.length,
       totalAmount: cart.total,
     });
   };
   ```

## Testing

Test logging in development:

```javascript
import useLogger from '../hooks/useLogger';

const TestLogging = () => {
  const logger = useLogger();

  const testLogs = () => {
    logger.info('Test info log');
    logger.warning('Test warning log');
    logger.error('Test error log', new Error('Test error'));
    logger.userAction('test_action');
    logger.screenView('TestScreen');
    logger.flush(); // Force send
  };

  return <Button title="Test Logging" onPress={testLogs} />;
};
```

## Troubleshooting

### Logs Not Being Sent

1. Check internet connection
2. Check API endpoint URL
3. Check authorization headers
4. Verify queue status:
   ```javascript
   // Check AsyncStorage
   AsyncStorage.getItem('@log_queue').then(logs => {
     console.log('Queued logs:', JSON.parse(logs));
   });
   ```

### Too Many Logs

1. Reduce log verbosity
2. Use debug logs only in development
3. Increase batch size or flush interval
4. Add filters in saga to exclude certain logs

### Performance Issues

1. Increase batch size to reduce network calls
2. Increase flush interval
3. Use async operations (already implemented)
4. Monitor queue size

## API Response Expected Format

Your backend at `/mobile/Logging` should accept:

```json
{
  "logs": [
    {
      "timestamp": "2025-01-23T10:30:00.000Z",
      "level": "info",
      "message": "User logged in",
      "username": "john.doe",
      "device": {
        "platform": "android",
        "platformVersion": "13"
      },
      "eventType": "user_action"
    }
  ],
  "timestamp": "2025-01-23T10:30:00.000Z"
}
```

And respond with:
```json
{
  "status": 200,
  "message": "Logs received successfully"
}
```

## Support

For issues or questions, refer to:
- Redux documentation
- Redux Saga documentation
- Project README.md

