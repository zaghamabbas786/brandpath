# ESLint Console Rules

## 🚫 Console Logging Rules

This project enforces strict console logging rules to maintain clean production code.

## ❌ NOT Allowed

The following console methods are **NOT allowed** and will cause ESLint errors:

```javascript
console.log('Some message');     // ❌ ERROR
console.table(data);              // ❌ ERROR
console.dir(object);              // ❌ ERROR
console.group('Group');           // ❌ ERROR
console.groupEnd();               // ❌ ERROR
console.time('timer');            // ❌ ERROR
console.timeEnd('timer');         // ❌ ERROR
```

## ✅ Allowed (Error/Debug Cases)

The following console methods **ARE allowed** for error handling and debugging:

```javascript
console.error('Error occurred:', error);   // ✅ OK
console.warn('Warning message');           // ✅ OK
console.info('Informational message');     // ✅ OK
console.debug('Debug information');        // ✅ OK
console.trace('Stack trace');              // ✅ OK
```

## 📋 Configuration

The rule is configured in `.eslintrc.js`:

```javascript
'no-console': [
  'error',
  {
    allow: ['warn', 'error', 'info', 'debug', 'trace'],
  },
],
```

## 🔧 How to Fix Violations

### Option 1: Use Allowed Console Methods

Replace `console.log` with appropriate alternatives:

```javascript
// Before
console.log('User logged in:', username);

// After - Choose based on severity
console.info('User logged in:', username);   // For general info
console.debug('User logged in:', username);  // For debugging
console.error('Login failed:', error);       // For errors
console.warn('Deprecated API used');         // For warnings
```

### Option 2: Remove Console Statements

If the log is not needed in production, remove it entirely:

```javascript
// Before
console.log('Debug: processing data');

// After
// Remove entirely
```

### Option 3: Use Conditional Logging (Development Only)

For development-only logs:

```javascript
if (__DEV__) {
  console.info('Development mode:', data);
}
```

### Option 4: Use the Logging System

For important events that need to be tracked, use the logging system instead:

```javascript
import {useLogger} from '../hooks/useLogger';

const logger = useLogger();

// Instead of console.log
logger.info('User action completed', {userId, action});
logger.error('Operation failed', error, {context});
logger.debug('Debug information', {data});
```

## 🎯 Best Practices

### 1. **Error Handling**
```javascript
try {
  await apiCall();
} catch (error) {
  console.error('[API] Request failed:', error);  // ✅ Good
  logger.error('API request failed', error, {
    endpoint: '/api/users',
  });
}
```

### 2. **Warnings**
```javascript
if (deprecatedFeature) {
  console.warn('[Deprecated] This feature will be removed in v2.0');  // ✅ Good
}
```

### 3. **Development Debugging**
```javascript
if (__DEV__) {
  console.debug('[Debug] Current state:', state);  // ✅ Good
}
```

### 4. **Production-Ready Logging**
```javascript
// Use the logging system for production logs
logger.info('Payment processed', {
  orderId: order.id,
  amount: order.total,
});
```

## 🔍 Running ESLint

Check your code for console violations:

```bash
# Check all files
npm run lint

# Check specific file
npx eslint path/to/file.js

# Auto-fix other issues (won't fix console.log)
npm run lint -- --fix
```

## 📊 Why These Rules?

1. **`console.log` in Production**
   - Clutters browser console
   - Can expose sensitive information
   - Impacts performance
   - Not useful for production debugging

2. **Allowed Methods Are Appropriate**
   - `console.error` - For error tracking
   - `console.warn` - For deprecation notices
   - `console.info` - For important information
   - `console.debug` - For debugging (can be filtered)
   - `console.trace` - For stack traces

3. **Logging System Is Better**
   - Centralized log management
   - Structured data
   - Backend storage
   - Analytics and monitoring
   - No performance impact in production

## 🚀 Migration Guide

If you have existing `console.log` statements:

1. **Identify the purpose** - Is it debug, info, error, or can it be removed?
2. **Replace with appropriate method** - Use `console.error`, `console.warn`, etc.
3. **Use logging system for tracking** - Important events go to the backend
4. **Remove unnecessary logs** - Development-only logs can be deleted

## ❓ FAQ

**Q: What if I need to temporarily debug something?**
A: Use `console.debug()` or `console.info()` - they're allowed!

**Q: Can I disable this rule for a specific line?**
A: Yes, but discouraged:
```javascript
// eslint-disable-next-line no-console
console.log('Temporary debug');
```

**Q: What about third-party libraries that use console.log?**
A: The rule only applies to your code, not node_modules.

**Q: How do I see logs in production?**
A: Use the logging system - it sends logs to the backend for analysis.

## 📚 Related Documentation

- [Logging System Guide](./LOGGING_GUIDE.md)
- [Logging Examples](./LOGGING_EXAMPLES.md)
- [ESLint no-console rule](https://eslint.org/docs/rules/no-console)

