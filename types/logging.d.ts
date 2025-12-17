/**
 * Logging Types and Interfaces
 * Defines all types used in the logging system
 */

/**
 * Device information
 */
export interface DeviceInfo {
  platform: string;
  platformVersion: string;
  deviceName: string;
  deviceModel: string;
  deviceBrand: string;
}

/**
 * User state information
 * Contains user's current working context
 * Note: Backend returns lowercase field names
 */
export interface UserState {
  // Location information (backend: stationid)
  stationid?: string;

  // Partner information (backend: partnerkey, partnerName)
  partnerkey?: string;
  partnerName?: string;

  // Additional context (optional)
  shippingType?: string;  // Selected shipping type
  orderRef?: string | null;  // Current order reference
}

/**
 * Log event types
 */
export type LogEventType =
  | 'api_call'
  | 'user_action'
  | 'barcode_scan'
  | 'auth'
  | 'screen_view'
  | 'api_error'
  | null;

/**
 * Log levels
 */
export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

/**
 * Auth methods
 */
export type AuthMethod = 'azure' | 'azure_without_pin' | 'pin' | null;

/**
 * Base fields that can be passed as metadata or included in log entry
 */
interface BaseLogFields {
  // Event information
  eventType: LogEventType;
  screenName: string | null;
  url: string | null;
  menuItem: string | null;

  // Auth information
  authMethod: AuthMethod;

  // Barcode/page information
  barcode: string | null;
  page: string | null;

  // API response information
  statusCode: number | null;
  response: any;

  // Error information
  errorMessage: string | null;
  errorName: string | null;
  errorStack: string | null;
  errorDetails: any;
}

/**
 * Log metadata - additional information passed when creating a log
 * All fields are optional and can override session context
 */
export interface LogMetadata extends Partial<BaseLogFields> {
  // Optional overrides
  username?: string;
  userState?: UserState;
}


export interface LogEntry extends BaseLogFields {
  username: string;
  device: DeviceInfo;
  userState: UserState | null;
  information: LogLevel;
  message: string;

  response: any;
}


export interface SessionContext {
  username: string;
  userState: UserState | null;
  device: DeviceInfo;
  screenName?: string | null;
}

/**
 * API logging callback data
 */
export interface ApiLogData {
  type: 'success' | 'error';
  method: string;
  url: string;
  status: number;
  duration: number;
  response?: any;
  error?: Error;
  errorMessage?: string;
  errorDetails?: any;
}

/**
 * Logger hook return type
 */
export interface Logger {
  info: (message: string, metadata?: LogMetadata) => void;
  warning: (message: string, metadata?: LogMetadata) => void;
  error: (message: string, error?: Error | null, metadata?: LogMetadata) => void;
  debug: (message: string, metadata?: LogMetadata) => void;
  screenView: (screenName: string, metadata?: LogMetadata) => void;
  userAction: (action: string, metadata?: LogMetadata) => void;
  apiCall: (
    method: string,
    endpoint: string,
    status: number,
    metadata?: LogMetadata
  ) => void;
  barcodeScan: (
    barcode: string,
    page: string,
    result: boolean,
    metadata?: LogMetadata
  ) => void;
}

/**
 * Redux action types for logging
 */
export interface LogEventRequestAction {
  type: 'LOG_EVENT_REQUEST';
  payload: {
    level: LogLevel;
    message: string;
    metadata: LogMetadata;
  };
}

export interface LogEventSuccessAction {
  type: 'LOG_EVENT_SUCCESS';
}

export interface LogEventErrorAction {
  type: 'LOG_EVENT_ERROR';
  payload: {
    error: string;
  };
}

export type LoggingAction =
  | LogEventRequestAction
  | LogEventSuccessAction
  | LogEventErrorAction;

