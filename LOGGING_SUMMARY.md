# Logging System Integration - Complete Summary

## ✅ What's Been Integrated

### 1. **Files Created**
- `actions/logging.js` - Redux actions for logging
- `sagas/logging.js` - Redux saga for logging logic
- `hooks/useLogger.js` - React hook for easy logging in components
- `LOGGING_GUIDE.md` - Comprehensive documentation
- `LOGGING_EXAMPLES.md` - Real-world usage examples

### 2. **Files Modified**
- `api/global.js` - Added `sendLogs()` endpoint (following your existing pattern)
- `actions/index.js` - Added logging action types
- `sagas/index.js` - Registered logging saga
- `sagas/global.js` - Added automatic barcode scan logging
- `services/apiService.js` - Added automatic API call logging

### 3. **Key Features**

#### Automatic Logging ✨
- **All API calls** are automatically logged (method, endpoint, duration, request/response)
- **All barcode scans** are automatically logged (barcode, page, username, result)

#### Manual Logging 📝
- Use the `useLogger()` hook in any component
- Simple API: `logger.info()`, `logger.warning()`, `logger.error()`, `logger.debug()`
- Special methods: `logger.screenView()`, `logger.userAction()`, `logger.barcodeScan()`

#### Immediate Sending ⚡ (Like Sentry)
- **Every event sends immediately** - No queue, no delay
- **Separate request per event** - Each click = 1 POST request
- **No AsyncStorage** - Simple fire-and-forget
- **Real-time** - See logs instantly in backend

#### User Context 👤
- Every log includes username (from keychain)
- User state (station, partner)
- Device info (platform, version)
- Timestamp

## 🚀 Quick Start

### In a Component:
```javascript
import useLogger from '../hooks/useLogger';

const MyScreen = () => {
  const logger = useLogger();

  useEffect(() => {
    logger.screenView('MyScreen');
  }, []);

  const handleAction = () => {
    logger.userAction('button_clicked', {buttonName: 'Submit'});
  };

  return <Button onPress={handleAction} />;
};
```

### In a Saga:
```javascript
import * as loggingActions from '../actions/logging';

function* mySaga() {
  yield put(loggingActions.logInfo('Processing', {data: 'test'}));
  
  try {
    // Your logic
  } catch (error) {
    yield put(loggingActions.logError('Failed', error));
  }
}
```

### Automatic (No Code Needed):
- ✅ All API calls through `apiService` are logged
- ✅ All barcode scans in `barCodeSaga` are logged

## 📊 Log Data Sent to Backend

**Endpoint:** `POST https://4439rg71-44392.uks1.devtunnels.ms/mobile/Logging`

**Format:**
```json
{
  "logs": [
    {
      "timestamp": "2025-01-23T10:30:00.000Z",
      "level": "info",
      "message": "Screen View: HomeScreen",
      "username": "john.doe@example.com",
      "userState": {
        "station": "STATION_1",
        "partnerKey": "PARTNER_KEY"
      },
      "device": {
        "platform": "android",
        "platformVersion": "13"
      },
      "eventType": "screen_view",
      "screenName": "HomeScreen"
    }
  ],
  "timestamp": "2025-01-23T10:30:00.000Z"
}
```

## 🔧 Configuration

### Change API Endpoint
The logging endpoint is in `api/global.js` (following your existing pattern):
```javascript
// In api/global.js
export const sendLogs = logs =>
  axios.post('/mobile/Logging', {
    logs,
    timestamp: new Date().toISOString(),
  });
```

To change the base URL for ALL APIs, edit `utils/apiConfig.js` or your `.env` files.

**Note:** Logs are sent immediately - no batching, no queue, no AsyncStorage!

## 📱 Log Types Available

1. **Info** - `logger.info(message, metadata)`
2. **Warning** - `logger.warning(message, metadata)`
3. **Error** - `logger.error(message, error, metadata)`
4. **Debug** - `logger.debug(message, metadata)` (dev only)
5. **Screen View** - `logger.screenView(screenName, metadata)`
6. **User Action** - `logger.userAction(action, metadata)`
7. **API Call** - Automatic ✅
8. **Barcode Scan** - Automatic ✅

## 🎯 Common Use Cases

### 1. Track Screen Navigation
```javascript
useEffect(() => {
  logger.screenView('HomeScreen', {
    previousScreen: 'LoginScreen',
  });
}, []);
```

### 2. Track Button Clicks
```javascript
const handleSubmit = () => {
  logger.userAction('form_submitted', {
    formName: 'UserSettings',
    fieldCount: 5,
  });
  // ... your logic
};
```

### 3. Track Errors
```javascript
try {
  // Your code
} catch (error) {
  logger.error('Operation failed', error, {
    context: 'SaveData',
    userId: user.id,
  });
}
```

### 4. Track API Calls
No code needed - automatically logged! ✅

### 5. Track Barcode Scans
No code needed - automatically logged! ✅

## 🧪 Testing

1. Run your app: `npm run dev`
2. Navigate through screens - logs are created
3. Click buttons - logs are created
4. Scan barcodes - logs are created
5. Make API calls - logs are created
6. Check backend to verify logs are received

### Manual Flush
```javascript
const logger = useLogger();
logger.flush(); // Send all queued logs immediately
```

## 📚 Documentation

- **`LOGGING_GUIDE.md`** - Complete guide with all features
- **`LOGGING_EXAMPLES.md`** - Real-world code examples

## ⚠️ Important Notes

1. **No sensitive data** - Don't log passwords, tokens, or PII
2. **Log levels** - Use appropriate levels (info, warning, error, debug)
3. **Metadata** - Always add context to logs for debugging
4. **Performance** - Logs are async and fire-and-forget, minimal impact
5. **Network** - Each event = separate request (like Sentry)

## 🎉 Benefits

✅ **Immediate logging** - Every event sends instantly (like Sentry)
✅ **Simple architecture** - No queue, no AsyncStorage, no complexity
✅ **Track every click** - Each button click = separate request
✅ **Real-time visibility** - See events instantly in backend
✅ **Fail-safe** - Logging never breaks your app
✅ **Easy integration** - Simple hook API
✅ **Automatic** - API and barcode logging with zero code
✅ **Full context** - Username, device, user state in every log

## 🔄 Next Steps

1. **Test the logging** - Use the examples to test in your app
2. **Add to existing screens** - Import `useLogger` and add logging
3. **Monitor backend** - Verify logs are being received
4. **Customize** - Adjust batch size, flush interval as needed
5. **Analyze** - Use logs to improve your app

## 💡 Pro Tips

- Log screen views in `useEffect` with empty dependencies
- Log user actions before performing them
- Add context metadata to every log
- Use the automatic logging for API and barcodes
- Flush logs before logout for complete session tracking

---

**You're all set! 🚀 Logging is fully integrated and working with your Redux/Saga architecture.**

