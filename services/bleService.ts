// @ts-nocheck - BLE service with dynamic imports and fallback handling
import { Platform } from 'react-native';
import {
    UnitHubDevice,
    UnitHubDeviceComplete,
    DeviceInformation,
    MeasurementsDuration,
    LoRaWANConfig,
    OTAService,
    SystemControl,
    AlarmService,
    LoggingService,
    UNIT_HUB_SERVICES,
    UNIT_HUB_CHARACTERISTICS,
    BLE_CONNECTION_PARAMS,
    BLE_SECURITY_LEVELS,
} from '../types/ble';

// Fallback BLE Manager for environments where react-native-ble-plx is not available
class FallbackBleManager {
    private scanning = false;

    startDeviceScan(serviceUUIDs: string[], options: any, callback: (error: Error | null, device: any) => void) {
        this.scanning = true;
        console.log('Fallback BLE: BleManager not available in this environment');
        callback(new Error('BLE not available in Expo Go. Please use a development build.'), null);
    }

    stopDeviceScan() {
        this.scanning = false;
        console.log('Fallback BLE: Stopped device scan');
    }

    async connectToDevice(deviceId: string, options: any) {
        throw new Error('BLE not available in Expo Go. Please use a development build.');
    }
}

class UnitHubBLEService {
    private bleManager: any;
    private connectedDevice: any = null;
    private deviceData: UnitHubDeviceComplete | null = null;
    private scanning = false;

    constructor() {
        // Check if we're in Expo Go or if react-native-ble-plx is available
        if (Platform.OS === 'web' || __DEV__) {
            try {
                // Try to import react-native-ble-plx
                const { BleManager } = require('react-native-ble-plx');
                this.bleManager = new BleManager();
                console.log('Real BLE Manager initialized');
            } catch (error) {
                console.warn('react-native-ble-plx not available, using fallback:', error);
                this.bleManager = new FallbackBleManager();
            }
        } else {
            // In production builds, always try to use real BLE
            try {
                const { BleManager } = require('react-native-ble-plx');
                this.bleManager = new BleManager();
                console.log('Real BLE Manager initialized');
            } catch (error) {
                console.error('Failed to initialize BLE Manager:', error);
                this.bleManager = new FallbackBleManager();
            }
        }
        this.initializeBLE();
    }

    private initializeBLE(): void {
        console.log('BLE Manager initialized');
    }

    // Device Discovery
    async scanForDevices(): Promise<UnitHubDevice[]> {
        try {
            const devices: UnitHubDevice[] = [];
            this.scanning = true;

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    this.bleManager.stopDeviceScan();
                    this.scanning = false;
                    resolve(devices);
                }, 10000); // 10 second scan timeout

                this.bleManager.startDeviceScan(
                    [UNIT_HUB_SERVICES.DEVICE_INFORMATION],
                    { allowDuplicates: false },
                    (error, device) => {
                        if (error) {
                            console.error('Scan error:', error);
                            clearTimeout(timeout);
                            this.bleManager.stopDeviceScan();
                            this.scanning = false;
                            reject(error);
                            return;
                        }

                        if (device) {
                            // Only add devices that have the Unit-Hub service
                            if (device.serviceUUIDs &&
                                device.serviceUUIDs.includes(UNIT_HUB_SERVICES.DEVICE_INFORMATION)) {

                                const unitHubDevice: UnitHubDevice = {
                                    id: device.id,
                                    name: device.name || 'Unit-Hub Device',
                                    rssi: device.rssi || undefined,
                                    advertising: {
                                        manufacturerData: device.manufacturerData,
                                        serviceUUIDs: device.serviceUUIDs,
                                    },
                                    lastSeen: new Date(),
                                };

                                // Check if device already exists
                                const existingIndex = devices.findIndex(d => d.id === device.id);
                                if (existingIndex >= 0) {
                                    devices[existingIndex] = unitHubDevice;
                                } else {
                                    devices.push(unitHubDevice);
                                }
                            }
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Failed to start scan:', error);
            this.scanning = false;
            return [];
        }
    }

    async stopScan(): Promise<void> {
        if (this.scanning) {
            this.bleManager.stopDeviceScan();
            this.scanning = false;
            console.log('BLE scan stopped');
        }
    }

    // Connection Management
    async connectToDevice(device: UnitHubDevice): Promise<boolean> {
        try {
            console.log('Connecting to device:', device.id);

            const bleDevice = await this.bleManager.connectToDevice(device.id, {
                requestMTU: BLE_CONNECTION_PARAMS.MTU_SIZE,
                timeout: 10000, // 10 second timeout
            });

            console.log('Connected to device, discovering services...');
            await bleDevice.discoverAllServicesAndCharacteristics();

            this.connectedDevice = bleDevice;

            // Initialize device data
            this.deviceData = {
                ...device,
                connectionStatus: 'connected',
                lastSync: new Date(),
            };

            console.log('Device connected successfully');
            return true;
        } catch (error) {
            console.error('Connection failed:', error);
            this.connectedDevice = null;
            this.deviceData = null;
            return false;
        }
    }

    async disconnect(): Promise<void> {
        if (this.connectedDevice) {
            try {
                await this.connectedDevice.cancelConnection();
                console.log('Device disconnected');
            } catch (error) {
                console.error('Error disconnecting:', error);
            } finally {
                this.connectedDevice = null;
                this.deviceData = null;
            }
        }
    }

    // Device Information Service (180A)
    async readDeviceInformation(): Promise<DeviceInformation | null> {
        if (!this.connectedDevice) {
            console.warn('No device connected');
            return null;
        }

        try {
            const services = await this.connectedDevice.services();
            const deviceInfoService = services.find(s => s.uuid === UNIT_HUB_SERVICES.DEVICE_INFORMATION);

            if (!deviceInfoService) {
                console.warn('Device Information service not found');
                return null;
            }

            const characteristics = await deviceInfoService.characteristics();
            const deviceInfo: DeviceInformation = {};

            for (const char of characteristics) {
                if (char.isReadable) {
                    try {
                        const value = await char.read();
                        const data = value.value;

                        if (data) {
                            switch (char.uuid) {
                                case UNIT_HUB_CHARACTERISTICS.MANUFACTURER_NAME:
                                    deviceInfo.manufacturerName = this.decodeString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.MODEL_NUMBER:
                                    deviceInfo.modelNumber = this.decodeString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.SERIAL_NUMBER:
                                    deviceInfo.serialNumber = this.decodeString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.HARDWARE_REVISION:
                                    deviceInfo.hardwareRevision = this.decodeString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.FIRMWARE_REVISION:
                                    deviceInfo.firmwareRevision = this.decodeString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.SOFTWARE_REVISION:
                                    deviceInfo.softwareRevision = this.decodeString(data);
                                    break;
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to read characteristic ${char.uuid}:`, error);
                    }
                }
            }

            if (this.deviceData) {
                this.deviceData.deviceInfo = deviceInfo;
            }

            return deviceInfo;
        } catch (error) {
            console.error('Failed to read device information:', error);
            return null;
        }
    }

    // Measurements Duration Service
    async readMeasurementsDuration(): Promise<MeasurementsDuration | null> {
        if (!this.connectedDevice) return null;

        try {
            const services = await this.connectedDevice.services();
            const measurementsService = services.find(s => s.uuid === UNIT_HUB_SERVICES.MEASUREMENTS_DURATION);

            if (!measurementsService) return null;

            const characteristics = await measurementsService.characteristics();
            const measurements: MeasurementsDuration = {
                gasDuration: 30,
                gnssDuration: 30,
                powerConsumptionDuration: 30,
            };

            for (const char of characteristics) {
                if (char.isReadable) {
                    try {
                        const value = await char.read();
                        const data = value.value;

                        if (data) {
                            switch (char.uuid) {
                                case UNIT_HUB_CHARACTERISTICS.GAS_DURATION:
                                    measurements.gasDuration = this.decodeUint16(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.GNSS_DURATION:
                                    measurements.gnssDuration = this.decodeUint16(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.POWER_DURATION:
                                    measurements.powerConsumptionDuration = this.decodeUint16(data);
                                    break;
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to read characteristic ${char.uuid}:`, error);
                    }
                }
            }

            if (this.deviceData) {
                this.deviceData.measurementsDuration = measurements;
            }

            return measurements;
        } catch (error) {
            console.error('Failed to read measurements duration:', error);
            return null;
        }
    }

    async writeMeasurementsDuration(measurements: MeasurementsDuration): Promise<boolean> {
        if (!this.connectedDevice) return false;

        try {
            const services = await this.connectedDevice.services();
            const measurementsService = services.find(s => s.uuid === UNIT_HUB_SERVICES.MEASUREMENTS_DURATION);

            if (!measurementsService) return false;

            const characteristics = await measurementsService.characteristics();
            let success = true;

            for (const char of characteristics) {
                if (char.isWritableWithResponse || char.isWritableWithoutResponse) {
                    try {
                        switch (char.uuid) {
                            case UNIT_HUB_CHARACTERISTICS.GAS_DURATION:
                                await char.writeWithResponse(this.encodeUint16(measurements.gasDuration));
                                break;
                            case UNIT_HUB_CHARACTERISTICS.GNSS_DURATION:
                                await char.writeWithResponse(this.encodeUint16(measurements.gnssDuration));
                                break;
                            case UNIT_HUB_CHARACTERISTICS.POWER_DURATION:
                                await char.writeWithResponse(this.encodeUint16(measurements.powerConsumptionDuration));
                                break;
                        }
                    } catch (error) {
                        console.warn(`Failed to write characteristic ${char.uuid}:`, error);
                        success = false;
                    }
                }
            }

            return success;
        } catch (error) {
            console.error('Failed to write measurements duration:', error);
            return false;
        }
    }

    // LoRaWAN Configuration Service
    async readLoRaWANConfig(): Promise<LoRaWANConfig | null> {
        if (!this.connectedDevice) return null;

        try {
            const services = await this.connectedDevice.services();
            const loraService = services.find(s => s.uuid === UNIT_HUB_SERVICES.LORAWAN_CONFIG);

            if (!loraService) return null;

            const characteristics = await loraService.characteristics();
            const config: LoRaWANConfig = {
                appEUI: '',
                devEUI: '',
                appKey: '',
                searchDuration: 0,
                validSearchTimes: {
                    startHour: 0,
                    startMinute: 0,
                    endHour: 0,
                    endMinute: 0,
                },
                sleepDuration: 0,
                networkStatus: 'disconnected',
            };

            for (const char of characteristics) {
                if (char.isReadable) {
                    try {
                        const value = await char.read();
                        const data = value.value;

                        if (data) {
                            switch (char.uuid) {
                                case UNIT_HUB_CHARACTERISTICS.APP_EUI:
                                    config.appEUI = this.decodeHexString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.DEV_EUI:
                                    config.devEUI = this.decodeHexString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.APP_KEY:
                                    config.appKey = this.decodeHexString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.SEARCH_DURATION:
                                    config.searchDuration = this.decodeUint16(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.VALID_SEARCH_TIMES:
                                    const searchTimes = this.decodeUint32(data);
                                    config.validSearchTimes = {
                                        startHour: (searchTimes >> 24) & 0xFF,
                                        startMinute: (searchTimes >> 16) & 0xFF,
                                        endHour: (searchTimes >> 8) & 0xFF,
                                        endMinute: searchTimes & 0xFF,
                                    };
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.SLEEP_DURATION:
                                    config.sleepDuration = this.decodeUint16(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.NETWORK_STATUS:
                                    const status = this.decodeUint8(data);
                                    config.networkStatus = status === 0 ? 'disconnected' :
                                        status === 1 ? 'searching' : 'connected';
                                    break;
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to read characteristic ${char.uuid}:`, error);
                    }
                }
            }

            if (this.deviceData) {
                this.deviceData.loraWANConfig = config;
            }

            return config;
        } catch (error) {
            console.error('Failed to read LoRaWAN config:', error);
            return null;
        }
    }

    async writeLoRaWANConfig(config: LoRaWANConfig): Promise<boolean> {
        if (!this.connectedDevice) return false;

        try {
            const services = await this.connectedDevice.services();
            const loraService = services.find(s => s.uuid === UNIT_HUB_SERVICES.LORAWAN_CONFIG);

            if (!loraService) return false;

            const characteristics = await loraService.characteristics();
            let success = true;

            for (const char of characteristics) {
                if (char.isWritableWithResponse || char.isWritableWithoutResponse) {
                    try {
                        switch (char.uuid) {
                            case UNIT_HUB_CHARACTERISTICS.APP_EUI:
                                await char.writeWithResponse(this.encodeHexString(config.appEUI));
                                break;
                            case UNIT_HUB_CHARACTERISTICS.DEV_EUI:
                                await char.writeWithResponse(this.encodeHexString(config.devEUI));
                                break;
                            case UNIT_HUB_CHARACTERISTICS.APP_KEY:
                                await char.writeWithResponse(this.encodeHexString(config.appKey));
                                break;
                            case UNIT_HUB_CHARACTERISTICS.SEARCH_DURATION:
                                await char.writeWithResponse(this.encodeUint16(config.searchDuration));
                                break;
                            case UNIT_HUB_CHARACTERISTICS.VALID_SEARCH_TIMES:
                                const searchTimes = (config.validSearchTimes.startHour << 24) |
                                    (config.validSearchTimes.startMinute << 16) |
                                    (config.validSearchTimes.endHour << 8) |
                                    config.validSearchTimes.endMinute;
                                await char.writeWithResponse(this.encodeUint32(searchTimes));
                                break;
                            case UNIT_HUB_CHARACTERISTICS.SLEEP_DURATION:
                                await char.writeWithResponse(this.encodeUint16(config.sleepDuration));
                                break;
                        }
                    } catch (error) {
                        console.warn(`Failed to write characteristic ${char.uuid}:`, error);
                        success = false;
                    }
                }
            }

            return success;
        } catch (error) {
            console.error('Failed to write LoRaWAN config:', error);
            return false;
        }
    }

    // OTA Service
    async readOTAService(): Promise<OTAService | null> {
        if (!this.connectedDevice) return null;

        try {
            const services = await this.connectedDevice.services();
            const otaService = services.find(s => s.uuid === UNIT_HUB_SERVICES.OTA_SERVICE);

            if (!otaService) return null;

            const characteristics = await otaService.characteristics();
            const otaInfo: OTAService = {
                currentVersion: '',
                updateStatus: 'idle',
                progress: 0,
            };

            for (const char of characteristics) {
                if (char.isReadable) {
                    try {
                        const value = await char.read();
                        const data = value.value;

                        if (data) {
                            switch (char.uuid) {
                                case UNIT_HUB_CHARACTERISTICS.OTA_VERSION:
                                    otaInfo.currentVersion = this.decodeString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.OTA_STATUS:
                                    const status = this.decodeUint8(data);
                                    otaInfo.updateStatus = ['idle', 'requesting', 'transferring', 'completing', 'completed', 'failed'][status] as any;
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.OTA_PROGRESS:
                                    otaInfo.progress = this.decodeUint8(data);
                                    break;
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to read characteristic ${char.uuid}:`, error);
                    }
                }
            }

            if (this.deviceData) {
                this.deviceData.otaService = otaInfo;
            }

            return otaInfo;
        } catch (error) {
            console.error('Failed to read OTA service:', error);
            return null;
        }
    }

    async startOTAUpdate(): Promise<boolean> {
        if (!this.connectedDevice) return false;

        try {
            const services = await this.connectedDevice.services();
            const otaService = services.find(s => s.uuid === UNIT_HUB_SERVICES.OTA_SERVICE);

            if (!otaService) return false;

            const characteristics = await otaService.characteristics();
            const otaDataChar = characteristics.find(c => c.uuid === UNIT_HUB_CHARACTERISTICS.OTA_DATA);

            if (otaDataChar && otaDataChar.isWritableWithResponse) {
                // Send OTA request command
                await otaDataChar.writeWithResponse(this.encodeUint8(0xA0));
                return true;
            }

            return false;
        } catch (error) {
            console.error('Failed to start OTA update:', error);
            return false;
        }
    }

    // System Control Service
    async readSystemControl(): Promise<SystemControl | null> {
        if (!this.connectedDevice) return null;

        try {
            const services = await this.connectedDevice.services();
            const systemService = services.find(s => s.uuid === UNIT_HUB_SERVICES.SYSTEM_CONTROL);

            if (!systemService) return null;

            const characteristics = await systemService.characteristics();
            const systemControl: SystemControl = {
                bleName: 'UH_SN1',
                occupancyDetection: false,
                instantSendTest: false,
                factoryReset: false,
            };

            for (const char of characteristics) {
                if (char.isReadable) {
                    try {
                        const value = await char.read();
                        const data = value.value;

                        if (data) {
                            switch (char.uuid) {
                                case UNIT_HUB_CHARACTERISTICS.BLE_NAME:
                                    systemControl.bleName = this.decodeString(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.OCCUPANCY_DETECTION:
                                    systemControl.occupancyDetection = this.decodeBoolean(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.INSTANT_SEND_TEST:
                                    systemControl.instantSendTest = this.decodeBoolean(data);
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.FACTORY_RESET:
                                    systemControl.factoryReset = this.decodeBoolean(data);
                                    break;
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to read characteristic ${char.uuid}:`, error);
                    }
                }
            }

            if (this.deviceData) {
                this.deviceData.systemControl = systemControl;
            }

            return systemControl;
        } catch (error) {
            console.error('Failed to read system control:', error);
            return null;
        }
    }

    async writeSystemControl(control: Partial<SystemControl>): Promise<boolean> {
        if (!this.connectedDevice) return false;

        try {
            const services = await this.connectedDevice.services();
            const systemService = services.find(s => s.uuid === UNIT_HUB_SERVICES.SYSTEM_CONTROL);

            if (!systemService) return false;

            const characteristics = await systemService.characteristics();
            let success = true;

            for (const char of characteristics) {
                if (char.isWritableWithResponse || char.isWritableWithoutResponse) {
                    try {
                        switch (char.uuid) {
                            case UNIT_HUB_CHARACTERISTICS.BLE_NAME:
                                if (control.bleName) {
                                    await char.writeWithResponse(this.encodeString(control.bleName));
                                }
                                break;
                            case UNIT_HUB_CHARACTERISTICS.OCCUPANCY_DETECTION:
                                if (control.occupancyDetection !== undefined) {
                                    await char.writeWithResponse(this.encodeBoolean(control.occupancyDetection));
                                }
                                break;
                            case UNIT_HUB_CHARACTERISTICS.INSTANT_SEND_TEST:
                                if (control.instantSendTest) {
                                    await char.writeWithResponse(this.encodeBoolean(true));
                                }
                                break;
                            case UNIT_HUB_CHARACTERISTICS.FACTORY_RESET:
                                if (control.factoryReset) {
                                    await char.writeWithResponse(this.encodeBoolean(true));
                                }
                                break;
                        }
                    } catch (error) {
                        console.warn(`Failed to write characteristic ${char.uuid}:`, error);
                        success = false;
                    }
                }
            }

            return success;
        } catch (error) {
            console.error('Failed to write system control:', error);
            return false;
        }
    }

    // Alarm Service
    async readAlarmService(): Promise<AlarmService | null> {
        if (!this.connectedDevice) return null;

        try {
            const services = await this.connectedDevice.services();
            const alarmService = services.find(s => s.uuid === UNIT_HUB_SERVICES.ALARM_SERVICE);

            if (!alarmService) return null;

            const characteristics = await alarmService.characteristics();
            const alarmInfo: AlarmService = {
                gasAlarm: false,
                gnssAlarm: false,
                powerAlarm: false,
                systemAlarm: false,
                alarmHistory: [],
            };

            for (const char of characteristics) {
                if (char.isReadable) {
                    try {
                        const value = await char.read();
                        const data = value.value;

                        if (data) {
                            switch (char.uuid) {
                                case UNIT_HUB_CHARACTERISTICS.ALARM_STATUS:
                                    const status = this.decodeUint8(data);
                                    alarmInfo.gasAlarm = (status & 0x01) !== 0;
                                    alarmInfo.gnssAlarm = (status & 0x02) !== 0;
                                    alarmInfo.powerAlarm = (status & 0x04) !== 0;
                                    alarmInfo.systemAlarm = (status & 0x08) !== 0;
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.ALARM_HISTORY:
                                    alarmInfo.alarmHistory = this.parseLogs(this.decodeString(data));
                                    break;
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to read characteristic ${char.uuid}:`, error);
                    }
                }
            }

            if (this.deviceData) {
                this.deviceData.alarmService = alarmInfo;
            }

            return alarmInfo;
        } catch (error) {
            console.error('Failed to read alarm service:', error);
            return null;
        }
    }

    // Logging Service
    async readLoggingService(): Promise<LoggingService | null> {
        if (!this.connectedDevice) return null;

        try {
            const services = await this.connectedDevice.services();
            const loggingService = services.find(s => s.uuid === UNIT_HUB_SERVICES.LOGGING_SERVICE);

            if (!loggingService) return null;

            const characteristics = await loggingService.characteristics();
            const loggingInfo: LoggingService = {
                currentLogs: [],
                availableLogFiles: [],
                downloadStatus: 'idle',
                downloadProgress: 0,
            };

            for (const char of characteristics) {
                if (char.isReadable) {
                    try {
                        const value = await char.read();
                        const data = value.value;

                        if (data) {
                            switch (char.uuid) {
                                case UNIT_HUB_CHARACTERISTICS.CURRENT_LOGS:
                                    loggingInfo.currentLogs = this.parseLogs(this.decodeString(data));
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.LOG_FILES:
                                    loggingInfo.availableLogFiles = this.parseLogFiles(this.decodeString(data));
                                    break;
                                case UNIT_HUB_CHARACTERISTICS.LOG_DOWNLOAD:
                                    const downloadStatus = this.decodeUint8(data);
                                    loggingInfo.downloadStatus = ['idle', 'downloading', 'completed', 'failed'][downloadStatus] as any;
                                    break;
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to read characteristic ${char.uuid}:`, error);
                    }
                }
            }

            if (this.deviceData) {
                this.deviceData.loggingService = loggingInfo;
            }

            return loggingInfo;
        } catch (error) {
            console.error('Failed to read logging service:', error);
            return null;
        }
    }

    // Utility methods
    private decodeString(base64: string): string {
        try {
            return Buffer.from(base64, 'base64').toString('utf-8');
        } catch (error) {
            console.warn('Failed to decode string:', error);
            return '';
        }
    }

    private encodeString(str: string): string {
        return Buffer.from(str, 'utf-8').toString('base64');
    }

    private decodeUint8(base64: string): number {
        try {
            const buffer = Buffer.from(base64, 'base64');
            return buffer.readUInt8(0);
        } catch (error) {
            console.warn('Failed to decode uint8:', error);
            return 0;
        }
    }

    private encodeUint8(value: number): string {
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(value, 0);
        return buffer.toString('base64');
    }

    private decodeUint16(base64: string): number {
        try {
            const buffer = Buffer.from(base64, 'base64');
            return buffer.readUInt16LE(0);
        } catch (error) {
            console.warn('Failed to decode uint16:', error);
            return 0;
        }
    }

    private encodeUint16(value: number): string {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt16LE(value, 0);
        return buffer.toString('base64');
    }

    private decodeUint32(base64: string): number {
        try {
            const buffer = Buffer.from(base64, 'base64');
            return buffer.readUInt32LE(0);
        } catch (error) {
            console.warn('Failed to decode uint32:', error);
            return 0;
        }
    }

    private encodeUint32(value: number): string {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32LE(value, 0);
        return buffer.toString('base64');
    }

    private decodeBoolean(base64: string): boolean {
        try {
            const buffer = Buffer.from(base64, 'base64');
            return buffer.readUInt8(0) !== 0;
        } catch (error) {
            console.warn('Failed to decode boolean:', error);
            return false;
        }
    }

    private encodeBoolean(value: boolean): string {
        const buffer = Buffer.alloc(1);
        buffer.writeUInt8(value ? 1 : 0, 0);
        return buffer.toString('base64');
    }

    private decodeHexString(base64: string): string {
        try {
            const buffer = Buffer.from(base64, 'base64');
            return buffer.toString('hex').toUpperCase();
        } catch (error) {
            console.warn('Failed to decode hex string:', error);
            return '';
        }
    }

    private encodeHexString(hex: string): string {
        const buffer = Buffer.from(hex.replace(/:/g, ''), 'hex');
        return buffer.toString('base64');
    }

    private parseLogs(data: string): any[] {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.warn('Failed to parse logs:', error);
            return [];
        }
    }

    private parseLogFiles(data: string): any[] {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.warn('Failed to parse log files:', error);
            return [];
        }
    }

    // Public getters
    getDeviceData(): UnitHubDeviceComplete | null {
        return this.deviceData;
    }

    isConnected(): boolean {
        return this.connectedDevice !== null;
    }

    getConnectedDevice(): Device | null {
        return this.connectedDevice;
    }

    isScanning(): boolean {
        return this.scanning;
    }
}

// Export singleton instance
export const unitHubBLEService = new UnitHubBLEService(); 