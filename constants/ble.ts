// Unit-Hub BLE Device Constants
export const UNIT_HUB_CONFIG = {
    DEVICE_NAME: 'UH_SN1',
    BLE_VERSION: '5.0',
    PREFERRED_MTU_SIZE: 517,
    SCAN_TIMEOUT: 10000, // 10 seconds
    CONNECTION_TIMEOUT: 15000, // 15 seconds
    RECONNECTION_ATTEMPTS: 3,
    RECONNECTION_DELAY: 2000, // 2 seconds
} as const;

// BLE Operation Timeouts
export const BLE_TIMEOUTS = {
    SCAN: 10000,
    CONNECT: 15000,
    READ: 5000,
    WRITE: 5000,
    DISCOVER_SERVICES: 10000,
    MTU_NEGOTIATION: 5000,
} as const;

// Factory Reset Command
export const FACTORY_RESET_COMMAND = 0xA5;

// OTA Packet Size (should be less than MTU)
export const OTA_PACKET_SIZE = 500;

// Permission Types for react-native-permissions
export const REQUIRED_PERMISSIONS = {
    ANDROID: [
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.BLUETOOTH_CONNECT',
        'android.permission.ACCESS_FINE_LOCATION',
    ],
    IOS: [
        'ios.permission.BLUETOOTH_PERIPHERAL',
        'ios.permission.LOCATION_WHEN_IN_USE',
    ],
} as const;

// Error Messages
export const BLE_ERROR_MESSAGES = {
    BLUETOOTH_DISABLED: 'Bluetooth is disabled. Please enable Bluetooth to continue.',
    PERMISSION_DENIED: 'Bluetooth permission denied. Please grant permission to use this feature.',
    DEVICE_NOT_FOUND: 'Unit-Hub device not found. Please make sure the device is powered on and nearby.',
    CONNECTION_FAILED: 'Failed to connect to the device. Please try again.',
    DISCONNECTED: 'Device disconnected unexpectedly.',
    READ_FAILED: 'Failed to read data from the device.',
    WRITE_FAILED: 'Failed to write data to the device.',
    SERVICE_NOT_FOUND: 'Required service not found on the device.',
    CHARACTERISTIC_NOT_FOUND: 'Required characteristic not found.',
    MTU_NEGOTIATION_FAILED: 'Failed to negotiate MTU size with the device.',
    OTA_FAILED: 'Over-the-air update failed.',
} as const;

// Default values
export const DEFAULT_VALUES = {
    MEASUREMENT_DURATION: 0, // 30 minutes
    SEARCH_DURATION: 0, // 30 minutes
    SLEEP_DURATION: 0, // 30 minutes
    OCCUPANCY_DETECT_DELAY: 30, // seconds
    VALID_SEARCH_TIME: {
        entryHour: 8,
        entryMinute: 0,
        exitHour: 18,
        exitMinute: 0,
    },
} as const; 