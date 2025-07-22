import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import {
    UnitHubDevice,
    UnitHubDeviceComplete,
    MeasurementsDuration,
    LoRaWANConfig,
    SystemControl,
    UNIT_HUB_SERVICES,
    UNIT_HUB_CHARACTERISTICS,
} from '../types/ble';
import { unitHubBLEService } from '../services/bleService';

interface ConnectionState {
    isConnected: boolean;
    isConnecting: boolean;
    isScanning: boolean;
    connectedDevice: UnitHubDevice | null;
    scannedDevices: UnitHubDevice[];
    error: string | null;
}

interface BLEOperationResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export function useBluetooth() {
    const [connectionState, setConnectionState] = useState<ConnectionState>({
        isConnected: false,
        isConnecting: false,
        isScanning: false,
        connectedDevice: null,
        scannedDevices: [],
        error: null,
    });

    const updateConnectionState = useCallback((updates: Partial<ConnectionState>) => {
        setConnectionState(prev => ({ ...prev, ...updates }));
    }, []);

    const startScan = useCallback(async () => {
        try {
            updateConnectionState({ isScanning: true, error: null });

            const devices = await unitHubBLEService.scanForDevices();

            updateConnectionState({
                isScanning: false,
                scannedDevices: devices,
            });
        } catch (error) {
            updateConnectionState({
                isScanning: false,
                error: error instanceof Error ? error.message : 'Scan failed',
            });
        }
    }, [updateConnectionState]);

    const stopScan = useCallback(async () => {
        try {
            await unitHubBLEService.stopScan();
            updateConnectionState({ isScanning: false });
        } catch (error) {
            console.error('Failed to stop scan:', error);
        }
    }, [updateConnectionState]);

    const connect = useCallback(async (device: UnitHubDevice) => {
        try {
            updateConnectionState({ isConnecting: true, error: null });

            const success = await unitHubBLEService.connectToDevice(device);

            if (success) {
                updateConnectionState({
                    isConnected: true,
                    isConnecting: false,
                    connectedDevice: device,
                });
            } else {
                updateConnectionState({
                    isConnected: false,
                    isConnecting: false,
                    error: 'Connection failed',
                });
            }
        } catch (error) {
            updateConnectionState({
                isConnected: false,
                isConnecting: false,
                error: error instanceof Error ? error.message : 'Connection failed',
            });
        }
    }, [updateConnectionState]);

    const disconnect = useCallback(async () => {
        try {
            await unitHubBLEService.disconnect();
            updateConnectionState({
                isConnected: false,
                isConnecting: false,
                connectedDevice: null,
            });
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    }, [updateConnectionState]);

    // Device Information Service
    const readDeviceInformation = useCallback(async (): Promise<BLEOperationResult<any>> => {
        try {
            const deviceInfo = await unitHubBLEService.readDeviceInformation();
            return { success: true, data: deviceInfo };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to read device info' };
        }
    }, []);

    // Measurements Duration Service
    const readMeasurementsDuration = useCallback(async (): Promise<BLEOperationResult<MeasurementsDuration>> => {
        try {
            const measurements = await unitHubBLEService.readMeasurementsDuration();
            return { success: true, data: measurements || undefined };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to read measurements' };
        }
    }, []);

    const writeMeasurementsDuration = useCallback(async (measurements: MeasurementsDuration): Promise<BLEOperationResult<void>> => {
        try {
            const success = await unitHubBLEService.writeMeasurementsDuration(measurements);
            return { success };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to write measurements' };
        }
    }, []);

    // LoRaWAN Configuration Service
    const readLoRaWANConfig = useCallback(async (): Promise<BLEOperationResult<LoRaWANConfig>> => {
        try {
            const config = await unitHubBLEService.readLoRaWANConfig();
            return { success: true, data: config || undefined };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to read LoRaWAN config' };
        }
    }, []);

    const writeLoRaWANConfig = useCallback(async (config: LoRaWANConfig): Promise<BLEOperationResult<void>> => {
        try {
            const success = await unitHubBLEService.writeLoRaWANConfig(config);
            return { success };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to write LoRaWAN config' };
        }
    }, []);

    // System Control Service
    const readSystemControl = useCallback(async (): Promise<BLEOperationResult<SystemControl>> => {
        try {
            const systemControl = await unitHubBLEService.readSystemControl();
            return { success: true, data: systemControl || undefined };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to read system control' };
        }
    }, []);

    const writeSystemControl = useCallback(async (control: Partial<SystemControl>): Promise<BLEOperationResult<void>> => {
        try {
            const success = await unitHubBLEService.writeSystemControl(control);
            return { success };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to write system control' };
        }
    }, []);

    // OTA Service
    const startOTAUpdate = useCallback(async (): Promise<BLEOperationResult<void>> => {
        try {
            const success = await unitHubBLEService.startOTAUpdate();
            return { success };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to start OTA update' };
        }
    }, []);

    // Alarm Service
    const readAlarmService = useCallback(async (): Promise<BLEOperationResult<any>> => {
        try {
            const alarmService = await unitHubBLEService.readAlarmService();
            return { success: true, data: alarmService };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to read alarm service' };
        }
    }, []);

    // Logging Service
    const readLoggingService = useCallback(async (): Promise<BLEOperationResult<any>> => {
        try {
            const loggingService = await unitHubBLEService.readLoggingService();
            return { success: true, data: loggingService };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Failed to read logging service' };
        }
    }, []);

    // Get complete device data
    const getDeviceData = useCallback((): UnitHubDeviceComplete | null => {
        return unitHubBLEService.getDeviceData();
    }, []);

    // Check connection status
    const checkConnectionStatus = useCallback((): boolean => {
        return unitHubBLEService.isConnected();
    }, []);

    return {
        // Connection state
        isConnected: connectionState.isConnected,
        isConnecting: connectionState.isConnecting,
        isScanning: connectionState.isScanning,
        connectedDevice: connectionState.connectedDevice,
        scannedDevices: connectionState.scannedDevices,
        error: connectionState.error,

        // Connection methods
        startScan,
        stopScan,
        connect,
        disconnect,

        // Service methods
        readDeviceInformation,
        readMeasurementsDuration,
        writeMeasurementsDuration,
        readLoRaWANConfig,
        writeLoRaWANConfig,
        readSystemControl,
        writeSystemControl,
        startOTAUpdate,
        readAlarmService,
        readLoggingService,

        // Utility methods
        getDeviceData,
        checkConnectionStatus,
    };
} 