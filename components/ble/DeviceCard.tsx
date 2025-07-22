import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../Themed';
import { Card, Text, View as ThemedView } from '../Themed';
import { Badge } from '../common/Badge';
import { UnitHubDevice } from '../../types/ble';

interface DeviceCardProps {
  device: UnitHubDevice;
  onPress: (device: UnitHubDevice) => void;
  isConnected?: boolean;
}

export function DeviceCard({ device, onPress, isConnected = false }: DeviceCardProps) {
  const { colors } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi >= -50) return { text: 'Excellent', color: colors.success[500] };
    if (rssi >= -60) return { text: 'Good', color: colors.warning[500] };
    if (rssi >= -70) return { text: 'Fair', color: colors.error[500] };
    return { text: 'Poor', color: colors.error[600] };
  };

  const signal = getSignalStrength(device.rssi || -70);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={() => onPress(device)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Card variant='glass' style={styles.deviceCard}>
          <ThemedView style={styles.deviceHeader}>
            <ThemedView style={styles.deviceIcon}>
              <Text size='xl' weight='bold'>
                {device.name?.charAt(0) || 'U'}
              </Text>
            </ThemedView>
            <ThemedView style={styles.deviceInfo}>
              <Text weight='bold' size='lg' style={styles.deviceName}>
                {device.name || 'Unknown Device'}
              </Text>
              <Text variant='secondary' size='sm' style={styles.deviceId}>
                {device.id}
              </Text>
            </ThemedView>
            <ThemedView style={styles.deviceStatus}>
              {isConnected ? (
                <Badge label='Connected' variant='success' />
              ) : (
                <Badge label='Available' variant='primary' />
              )}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.deviceDetails}>
            <ThemedView style={styles.detailRow}>
              <Text variant='secondary' size='sm'>
                Signal Strength
              </Text>
              <Text size='sm' weight='medium' style={{ color: signal.color }}>
                {signal.text} ({device.rssi || 'N/A'} dBm)
              </Text>
            </ThemedView>

            <ThemedView style={styles.detailRow}>
              <Text variant='secondary' size='sm'>
                Device Type
              </Text>
              <Text size='sm' weight='medium'>
                {(device as any).advertising?.manufacturerData ? 'Unit-Hub' : 'Generic BLE'}
              </Text>
            </ThemedView>

            {(device as any).advertising?.manufacturerData && (
              <ThemedView style={styles.detailRow}>
                <Text variant='secondary' size='sm'>
                  Features
                </Text>
                <ThemedView style={styles.features}>
                  <Badge label='Gas Sensor' variant='info' size='sm' />
                  <Badge label='GNSS' variant='info' size='sm' />
                  <Badge label='Alarm' variant='info' size='sm' />
                </ThemedView>
              </ThemedView>
            )}
          </ThemedView>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  deviceCard: {
    marginBottom: 12,
    borderRadius: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    marginBottom: 2,
  },
  deviceId: {
    fontFamily: 'monospace',
  },
  deviceStatus: {
    alignItems: 'flex-end',
  },
  deviceDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  features: {
    flexDirection: 'row',
    gap: 4,
  },
});
