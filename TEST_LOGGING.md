# Testing Logging Integration

## Quick Test

The logging system is now fully integrated! Here's how to test it:

### 1. Login Flow - Now Includes Logging

When you login, you'll see logs for:

**Azure Login:**
- ✅ "Azure login initiated" - When Azure login starts
- ✅ "Azure login successful" or "Azure login failed" - When complete
- ✅ API call to `/mobile/Login` - Automatic API logging

**Login Without PIN:**
- ✅ "Login without PIN initiated" - When starting
- ✅ "Login without PIN successful" or "Login without PIN failed" - Result
- ✅ API call to `/mobile/Login` - Automatic API logging

**Login With PIN:**
- ✅ "Login with PIN initiated" - When starting
- ✅ "Login with PIN successful" or "Login with PIN failed" - Result
- ✅ API call to `/mobile/LoginPin` - Automatic API logging

### 2. Check Logs in AsyncStorage

Add this code temporarily to any screen to see queued logs:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from 'react-native';

// Add this button to your screen
<Button
  title="Check Logs"
  onPress={async () => {
    const logs = await AsyncStorage.getItem('@log_queue');
    console.log('Queued logs:', JSON.parse(logs));
  }}
/>
```

### 3. Check Backend Logs

Your backend should receive logs at:
```
POST https://YOUR_BASE_URL/mobile/Logging
```

With format:
```json
{
  "logs": [
    {
      "timestamp": "2025-01-23T10:30:00.000Z",
      "level": "info",
      "message": "Azure login initiated",
      "username": "john.doe@example.com",
      "userState": {
        "station": "STATION_1",
        "partnerKey": "PARTNER_KEY"
      },
      "device": {
        "platform": "android",
        "platformVersion": "13"
      },
      "eventType": "user_action",
      "action": "azure_login_started"
    }
  ],
  "timestamp": "2025-01-23T10:30:00.000Z"
}
```

### 4. Manual Flush Test

Add this to any screen:

```javascript
import {useDispatch} from 'react-redux';
import {flushLogsRequest} from './actions/logging';
import {Button} from 'react-native';

const TestScreen = () => {
  const dispatch = useDispatch();

  return (
    <Button
      title="Flush Logs Now"
      onPress={() => dispatch(flushLogsRequest())}
    />
  );
};
```

### 5. Check Console

When logs are sent, you'll see in console:
```
Sending logs to backend [Array]
```

## What Gets Logged Automatically

### On Login:
1. **Login initiated** (manual log from saga)
2. **API call to /mobile/Login** (automatic from apiService)
3. **Login successful/failed** (manual log from saga)
4. **API call to /mobile/GetUserState** (automatic)
5. **API call to /mobile/LocationList** (automatic)
6. **API call to /mobile/PartnerList** (automatic)

### On Barcode Scan:
1. **Barcode scan initiated** (automatic from saga)
2. **API call to /mobile/Scan** (automatic from apiService)
3. **Scan result** (automatic from saga)

### On Any API Call:
- **Method, endpoint, status code, duration**
- **Request and response data**
- **Errors with stack traces**

## Troubleshooting

### Logs Not Appearing?

1. **Check if saga is running:**
   ```javascript
   // In sagas/logging.js, add console.log
   function* logEventSaga(action) {
     console.log('LOG EVENT SAGA CALLED:', action.payload);
     // ... rest of code
   }
   ```

2. **Check if callback is set:**
   ```javascript
   // In services/apiService.js, add console.log
   apiClient.interceptors.response.use(
     response => {
       console.log('API CALLBACK:', loggingCallback ? 'SET' : 'NOT SET');
       // ... rest of code
     }
   );
   ```

3. **Check AsyncStorage:**
   ```javascript
   AsyncStorage.getItem('@log_queue').then(logs => {
     console.log('Logs in queue:', JSON.parse(logs)?.length || 0);
   });
   ```

4. **Check network:**
   - Make sure your device can reach the backend
   - Check if base URL is correct in `.env` files

### Still Not Working?

1. Clear app data and reinstall
2. Check Redux DevTools (if installed)
3. Add console.logs in saga to trace flow
4. Verify store.js imported logging actions correctly

## Expected Behavior

After successful login, you should have:
- **~6-8 logs** in queue (login + API calls + user state)
- Logs automatically sent after **30 seconds** or when **10 logs** accumulated
- **Error logs** sent immediately
- Logs persist across app restarts (stored in AsyncStorage)

## Success Indicators

✅ No "Require cycle" warning
✅ Logs appear in AsyncStorage
✅ Backend receives logs at `/mobile/Logging`
✅ Console shows "Sending logs to backend"
✅ Login events logged with username
✅ API calls logged with method/endpoint/status

---

**Your logging is now live!** Every action in your app is being tracked and sent to your backend. 🎉

