# Click Event Logging - Simple & Immediate (Like Sentry)

## Overview

Every event now sends **immediately** to your backend - no queue, no AsyncStorage, just like Sentry!

## How It Works

1. **User clicks button** → Dispatch log action
2. **Saga receives action** → Create log entry
3. **Send immediately** → POST to `/mobile/Logging`
4. **Done!** → Each click = 1 separate request

## Usage Examples

### Example 1: Log Button Clicks

```javascript
import React from 'react';
import {Button, TouchableOpacity, Text} from 'react-native';
import useLogger from '../hooks/useLogger';

const MyScreen = () => {
  const logger = useLogger();

  const handleSubmit = () => {
    // Log the click
    logger.userAction('submit_button_clicked', {
      screen: 'MyScreen',
      formData: {/* your data */},
    });

    // Your actual logic
    submitForm();
  };

  const handleCancel = () => {
    logger.userAction('cancel_button_clicked', {
      screen: 'MyScreen',
    });
    
    goBack();
  };

  return (
    <>
      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Cancel" onPress={handleCancel} />
    </>
  );
};
```

### Example 2: Log Every TouchableOpacity

```javascript
import {TouchableOpacity, Text} from 'react-native';
import useLogger from '../hooks/useLogger';

const LoggedButton = ({title, onPress, metadata = {}}) => {
  const logger = useLogger();

  const handlePress = () => {
    // Log every click
    logger.userAction(`${title}_clicked`, metadata);
    
    // Execute original onPress
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

// Usage:
<LoggedButton
  title="Delete"
  onPress={() => deleteItem()}
  metadata={{itemId: item.id, screen: 'ItemList'}}
/>
```

### Example 3: Create Reusable Logged Components

```javascript
// components/LoggedButton.js
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import useLogger from '../hooks/useLogger';

const LoggedButton = ({title, onPress, screen, metadata = {}, ...props}) => {
  const logger = useLogger();

  const handlePress = () => {
    // Auto-log with button title and screen
    logger.userAction('button_clicked', {
      buttonTitle: title,
      screen: screen,
      ...metadata,
    });
    
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default LoggedButton;
```

Then use everywhere:
```javascript
import LoggedButton from '../components/LoggedButton';

<LoggedButton
  title="Save Changes"
  screen="Settings"
  onPress={() => saveSettings()}
  metadata={{settingsCount: 5}}
/>
```

### Example 4: Higher Order Component for Auto-Logging

```javascript
// hoc/withClickLogging.js
import React from 'react';
import {useDispatch} from 'react-redux';
import {logUserAction} from '../actions/logging';

export const withClickLogging = (Component, componentName) => {
  return props => {
    const dispatch = useDispatch();

    const loggedOnPress = () => {
      // Log the click
      dispatch(
        logUserAction(`${componentName}_clicked`, {
          screen: props.screen,
          ...props.logMetadata,
        }),
      );

      // Execute original onPress
      if (props.onPress) {
        props.onPress();
      }
    };

    return <Component {...props} onPress={loggedOnPress} />;
  };
};

// Usage:
import {Button} from 'react-native';
import {withClickLogging} from '../hoc/withClickLogging';

const LoggedButton = withClickLogging(Button, 'SubmitButton');

<LoggedButton
  title="Submit"
  screen="FormScreen"
  logMetadata={{formId: '123'}}
  onPress={() => submitForm()}
/>
```

### Example 5: Navigation Events

```javascript
import {useNavigation} from '@react-navigation/native';
import useLogger from '../hooks/useLogger';

const MyScreen = () => {
  const logger = useLogger();
  const navigation = useNavigation();

  const navigateToDetail = (item) => {
    // Log navigation click
    logger.userAction('navigate_to_detail', {
      from: 'HomeScreen',
      to: 'DetailScreen',
      itemId: item.id,
    });

    navigation.navigate('DetailScreen', {item});
  };

  return (
    <TouchableOpacity onPress={() => navigateToDetail(item)}>
      <Text>View Details</Text>
    </TouchableOpacity>
  );
};
```

### Example 6: List Item Clicks

```javascript
import {FlatList, TouchableOpacity, Text} from 'react-native';
import useLogger from '../hooks/useLogger';

const ItemList = ({items}) => {
  const logger = useLogger();

  const handleItemClick = (item, index) => {
    // Log which item was clicked
    logger.userAction('list_item_clicked', {
      screen: 'ItemList',
      itemId: item.id,
      itemIndex: index,
      itemName: item.name,
    });

    // Navigate or do something
    navigateToDetail(item);
  };

  return (
    <FlatList
      data={items}
      renderItem={({item, index}) => (
        <TouchableOpacity onPress={() => handleItemClick(item, index)}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};
```

## What Each Log Contains

Every log sent includes:

```json
{
  "timestamp": "2025-01-23T10:30:00.000Z",
  "level": "info",
  "message": "User Action: submit_button_clicked",
  "username": "john.doe@example.com",
  "userState": {
    "station": "STATION_1",
    "partnerKey": "PARTNER_KEY"
  },
  "device": {
    "platform": "android",
    "platformVersion": "13",
    "isTablet": false
  },
  "eventType": "user_action",
  "action": "submit_button_clicked",
  "screen": "MyScreen",
  "formData": {...}
}
```

## Network Requests

Each click sends **ONE separate POST request**:

```
POST https://YOUR_BASE_URL/mobile/Logging

Body:
{
  "logs": [
    {
      // Single log entry
    }
  ],
  "timestamp": "2025-01-23T10:30:00.000Z"
}
```

**No batching**, **no queue**, **no AsyncStorage** - Just immediate logging! ⚡

## Log Types for Different Events

```javascript
const logger = useLogger();

// Button clicks
logger.userAction('button_clicked', {buttonName: 'Submit'});

// Screen views (on mount)
logger.screenView('HomeScreen', {source: 'navigation'});

// Form submissions
logger.userAction('form_submitted', {formName: 'Settings'});

// Item selections
logger.userAction('item_selected', {itemId: '123'});

// Errors
logger.error('Form validation failed', error, {formData: data});

// Info
logger.info('Data loaded', {recordCount: 10});

// Warnings
logger.warning('Slow response', {duration: 5000});
```

## Best Practices

1. **Be Specific**: Use descriptive action names
   ```javascript
   ✅ logger.userAction('save_settings_clicked')
   ❌ logger.userAction('clicked')
   ```

2. **Add Context**: Include relevant metadata
   ```javascript
   ✅ logger.userAction('delete_item', {itemId: '123', itemName: 'Product'})
   ❌ logger.userAction('delete_item')
   ```

3. **Screen Name**: Always include which screen
   ```javascript
   ✅ {screen: 'HomeScreen', action: 'submit'}
   ❌ {action: 'submit'}
   ```

4. **Don't Log Sensitive Data**
   ```javascript
   ❌ {password: '12345', creditCard: '1234-5678'}
   ✅ {hasPassword: true, paymentMethod: 'card'}
   ```

## Performance

- **Non-blocking**: Logs are sent asynchronously
- **Fire-and-forget**: Doesn't wait for response
- **Fail-safe**: If log fails, app continues normally
- **Parallel**: Multiple clicks = multiple parallel requests

## Advantages

✅ **Simple** - No queue management
✅ **Immediate** - See logs instantly in backend
✅ **Reliable** - Each event is independent
✅ **Sentry-like** - Similar to how Sentry works
✅ **No storage** - No AsyncStorage needed
✅ **No batching complexity** - One event = one request

## Monitoring

On your backend, you'll see:
- One request per click
- Real-time events as they happen
- Each request with full context
- Immediate visibility into user actions

---

**Your logging is now live and sends every click immediately!** 🎉⚡

