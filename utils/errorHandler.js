import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

// Create an instance of EventEmitter
const eventEmitter = new EventEmitter();

export const globalErrorHandler = errorMessage => {
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
    return ['Network error: API not reachable.'];
  }
  return ['Unexpected error occurred', e.message || e];
};
