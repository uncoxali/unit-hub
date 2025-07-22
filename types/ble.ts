// Unit-Hub BLE Device Types
export interface UnitHubDevice {
    id: string;
    name: string;
    rssi?: number;
    advertising?: {
        manufacturerData?: any;
        serviceUUIDs?: string[];
    };
    lastSeen?: Date;
}

// Device Information Service (180A)
export interface DeviceInformation {
    manufacturerName?: string;
    modelNumber?: string;
    serialNumber?: string;
    hardwareRevision?: string;
    firmwareRevision?: string;
    softwareRevision?: string;
    systemId?: string;
    ieee11073CertData?: string;
    pnpId?: string;
}

// Measurements Duration Service
export interface MeasurementsDuration {
    gasDuration: number; // minutes (30-1440)
    gnssDuration: number; // minutes (30-1440)
    powerConsumptionDuration: number; // minutes (30-1440)
}

// LoRaWAN Configuration Service
export interface LoRaWANConfig {
    appEUI: string; // 16 hex characters
    devEUI: string; // 16 hex characters
    appKey: string; // 32 hex characters
    searchDuration: number; // seconds
    validSearchTimes: {
        startHour: number;
        startMinute: number;
        endHour: number;
        endMinute: number;
    };
    sleepDuration: number; // seconds after successful transmission
    networkStatus: 'disconnected' | 'searching' | 'connected';
}

// OTA Service
export interface OTAService {
    currentVersion: string;
    availableVersion?: string;
    updateStatus: 'idle' | 'requesting' | 'transferring' | 'completing' | 'completed' | 'failed';
    progress: number; // 0-100
    errorMessage?: string;
}

// System Control Service
export interface SystemControl {
    bleName: string; // UH_SN1 or custom
    occupancyDetection: boolean;
    instantSendTest: boolean;
    factoryReset: boolean;
}

// Alarm Service
export interface AlarmService {
    gasAlarm: boolean;
    gnssAlarm: boolean;
    powerAlarm: boolean;
    systemAlarm: boolean;
    alarmHistory: AlarmEvent[];
}

export interface AlarmEvent {
    id: string;
    type: 'gas' | 'gnss' | 'power' | 'system';
    timestamp: Date;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    resolved: boolean;
}

// Logging Service
export interface LoggingService {
    currentLogs: LogEntry[];
    availableLogFiles: LogFile[];
    downloadStatus: 'idle' | 'downloading' | 'completed' | 'failed';
    downloadProgress: number; // 0-100
}

export interface LogEntry {
    id: string;
    timestamp: Date;
    level: 'debug' | 'info' | 'warning' | 'error';
    category: 'system' | 'gas' | 'gnss' | 'power' | 'lora' | 'ble';
    message: string;
    data?: any;
}

export interface LogFile {
    id: string;
    name: string;
    size: number; // bytes
    createdAt: Date;
    type: 'system' | 'gas' | 'gnss' | 'power' | 'lora' | 'ble';
}

// Complete Unit-Hub Device with all services
export interface UnitHubDeviceComplete extends UnitHubDevice {
    deviceInfo?: DeviceInformation;
    measurementsDuration?: MeasurementsDuration;
    loraWANConfig?: LoRaWANConfig;
    otaService?: OTAService;
    systemControl?: SystemControl;
    alarmService?: AlarmService;
    loggingService?: LoggingService;
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'failed';
    lastSync?: Date;
}

// BLE Service UUIDs for Unit-Hub
export const UNIT_HUB_SERVICES = {
    DEVICE_INFORMATION: '180A',
    MEASUREMENTS_DURATION: '1810', // Custom UUID
    LORAWAN_CONFIG: '1811', // Custom UUID
    OTA_SERVICE: '1812', // Custom UUID
    SYSTEM_CONTROL: '1813', // Custom UUID
    ALARM_SERVICE: '1814', // Custom UUID
    LOGGING_SERVICE: '1815', // Custom UUID
} as const;

// BLE Characteristic UUIDs
export const UNIT_HUB_CHARACTERISTICS = {
    // Device Information Service
    MANUFACTURER_NAME: '2A29',
    MODEL_NUMBER: '2A24',
    SERIAL_NUMBER: '2A25',
    HARDWARE_REVISION: '2A27',
    FIRMWARE_REVISION: '2A26',
    SOFTWARE_REVISION: '2A28',
    SYSTEM_ID: '2A23',
    IEEE_CERT_DATA: '2A2A',
    PNP_ID: '2A50',

    // Measurements Duration Service
    GAS_DURATION: '2A56', // Custom UUID
    GNSS_DURATION: '2A57', // Custom UUID
    POWER_DURATION: '2A58', // Custom UUID

    // LoRaWAN Configuration Service
    APP_EUI: '2A59', // Custom UUID
    DEV_EUI: '2A5A', // Custom UUID
    APP_KEY: '2A5B', // Custom UUID
    SEARCH_DURATION: '2A5C', // Custom UUID
    VALID_SEARCH_TIMES: '2A5D', // Custom UUID
    SLEEP_DURATION: '2A5E', // Custom UUID
    NETWORK_STATUS: '2A5F', // Custom UUID

    // OTA Service
    OTA_VERSION: '2A60', // Custom UUID
    OTA_STATUS: '2A61', // Custom UUID
    OTA_PROGRESS: '2A62', // Custom UUID
    OTA_DATA: '2A63', // Custom UUID

    // System Control Service
    BLE_NAME: '2A64', // Custom UUID
    OCCUPANCY_DETECTION: '2A65', // Custom UUID
    INSTANT_SEND_TEST: '2A66', // Custom UUID
    FACTORY_RESET: '2A67', // Custom UUID

    // Alarm Service
    ALARM_STATUS: '2A68', // Custom UUID
    ALARM_HISTORY: '2A69', // Custom UUID

    // Logging Service
    CURRENT_LOGS: '2A6A', // Custom UUID
    LOG_FILES: '2A6B', // Custom UUID
    LOG_DOWNLOAD: '2A6C', // Custom UUID
} as const;

// BLE Connection Parameters
export const BLE_CONNECTION_PARAMS = {
    MIN_CONNECTION_INTERVAL: 1.25, // ms
    MAX_CONNECTION_INTERVAL: 3.75, // ms
    SLAVE_LATENCY: 0,
    SUPERVISION_TIMEOUT: 4000, // ms
    MTU_SIZE: 517, // bytes
} as const;

// BLE Security Levels
export const BLE_SECURITY_LEVELS = {
    NO_SECURITY: 1,
    UNAUTHENTICATED_PAIRING: 2,
    AUTHENTICATED_PAIRING: 3,
    AUTHENTICATED_PAIRING_WITH_MITM: 4,
    AUTHENTICATED_PAIRING_WITH_LESC: 5,
} as const; 