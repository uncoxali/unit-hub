import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { useBluetooth } from '../../hooks/useBluetooth';
import { useTheme } from '../../components/Themed';
import {
  Card,
  Text,
  View as ThemedView,
  ScrollView as ThemedScrollView,
} from '../../components/Themed';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { DeviceCard } from '../../components/ble/DeviceCard';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { UnitHubDevice } from '../../types/ble';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DeviceScreen() {
  const theme = useTheme();
  const {
    isScanning,
    isConnecting,
    isConnected,
    connectedDevice,
    scannedDevices,
    startScan,
    stopScan,
    connect,
    disconnect,
  } = useBluetooth();
  const [scanDuration, setScanDuration] = useState(0);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [filteredDevices, setFilteredDevices] = useState<UnitHubDevice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'signal' | 'recent'>('signal');

  const handleStartScan = async () => {
    setLastScanTime(new Date());
    setScanDuration(0);
    await startScan();
  };

  const handleStopScan = async () => {
    await stopScan();
  };

  const handleConnect = async (device: UnitHubDevice) => {
    if (isConnected && connectedDevice?.id === device.id) {
      Alert.alert('Disconnect Device', 'Are you sure you want to disconnect?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => disconnect(),
        },
      ]);
    } else {
      await connect(device);
    }
  };

  const filterAndSortDevices = useCallback(() => {
    let filtered = scannedDevices;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (device: UnitHubDevice) =>
          device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          device.id.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort devices
    filtered.sort((a: UnitHubDevice, b: UnitHubDevice) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'signal':
          return (b.rssi || -100) - (a.rssi || -100);
        case 'recent':
          return 0;
        default:
          return 0;
      }
    });

    setFilteredDevices(filtered);
  }, [scannedDevices, searchQuery, sortBy]);

  useEffect(() => {
    filterAndSortDevices();
  }, [filterAndSortDevices]);

  const getSignalStrength = (rssi: number | undefined) => {
    if (!rssi) return 'Unknown';
    if (rssi >= -50) return 'Excellent';
    if (rssi >= -60) return 'Good';
    if (rssi >= -70) return 'Fair';
    if (rssi >= -80) return 'Poor';
    return 'Very Poor';
  };

  const getSignalColor = (rssi: number | undefined) => {
    if (!rssi) return theme.colors.neutral[400];
    if (rssi >= -50) return theme.colors.success[500];
    if (rssi >= -60) return theme.colors.success[400];
    if (rssi >= -70) return theme.colors.warning[500];
    if (rssi >= -80) return theme.colors.warning[400];
    return theme.colors.error[500];
  };

  const formatScanDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor='transparent'
        translucent
      />

      {/* Simple Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.isDark
              ? theme.colors.background.primary
              : theme.colors.surface.primary,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text size='2xl' weight='bold' style={styles.title}>
            Devices
          </Text>
          <Text variant='secondary' size='base' style={styles.subtitle}>
            Discover and manage your smart devices
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ThemedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Scan Controls */}
        <Card variant='elevated' style={styles.scanCard}>
          <View style={styles.scanHeader}>
            <Text weight='bold' size='lg' style={styles.cardTitle}>
              Device Discovery
            </Text>
            {isScanning && <Badge label='Scanning...' variant='warning' />}
          </View>

          {isScanning && (
            <View style={styles.scanInfo}>
              <View style={styles.scanProgress}>
                <LoadingSpinner size='small' />
                <Text variant='secondary' style={{ marginLeft: 8 }}>
                  Scanning... {formatScanDuration(scanDuration)}
                </Text>
              </View>
              <Badge label={`${scannedDevices.length} found`} variant='primary' />
            </View>
          )}

          <View style={styles.scanButtons}>
            {!isScanning ? (
              <Button
                title='Start Scan'
                variant='primary'
                onPress={handleStartScan}
                style={styles.scanBtn}
                icon='search'
                iconPosition='left'
              />
            ) : (
              <Button
                title='Stop Scan'
                variant='outline'
                onPress={handleStopScan}
                style={styles.scanBtn}
                icon='stop'
                iconPosition='left'
              />
            )}

            {scannedDevices.length > 0 && (
              <Button
                title='Clear List'
                variant='secondary'
                onPress={() => setFilteredDevices([])}
                style={styles.clearBtn}
                icon='trash'
                iconPosition='left'
              />
            )}
          </View>

          {lastScanTime && (
            <Text variant='secondary' size='sm' style={styles.lastScanText}>
              Last scan: {lastScanTime.toLocaleTimeString()}
            </Text>
          )}
        </Card>

        {/* Simple Device Statistics */}
        <Card variant='elevated' style={styles.statsCard}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            Scan Statistics
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name='phone-portrait' size={24} color={theme.colors.primary[500]} />
              <View style={styles.statText}>
                <Text weight='bold' size='xl'>
                  {scannedDevices.length}
                </Text>
                <Text variant='secondary' size='sm'>
                  Total Devices
                </Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons name='checkmark-circle' size={24} color={theme.colors.success[500]} />
              <View style={styles.statText}>
                <Text weight='bold' size='xl'>
                  {scannedDevices.filter((d: UnitHubDevice) => d.rssi && d.rssi >= -60).length}
                </Text>
                <Text variant='secondary' size='sm'>
                  Good Signal
                </Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons name='warning' size={24} color={theme.colors.warning[500]} />
              <View style={styles.statText}>
                <Text weight='bold' size='xl'>
                  {scannedDevices.filter((d: UnitHubDevice) => d.rssi && d.rssi < -60).length}
                </Text>
                <Text variant='secondary' size='sm'>
                  Weak Signal
                </Text>
              </View>
            </View>
            <View style={styles.statItem}>
              <Ionicons name='bluetooth' size={24} color={theme.colors.accent[500]} />
              <View style={styles.statText}>
                <Text weight='bold' size='xl'>
                  {isConnected ? 1 : 0}
                </Text>
                <Text variant='secondary' size='sm'>
                  Connected
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Simple Filter and Sort */}
        <Card variant='elevated' style={styles.filterCard}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            Filter & Sort
          </Text>
          <View style={styles.filterRow}>
            <View style={styles.sortContainer}>
              <Text variant='secondary' size='sm' style={styles.filterLabel}>
                Sort by:
              </Text>
              <View style={styles.sortButtons}>
                {[
                  { key: 'signal', label: 'Signal' },
                  { key: 'name', label: 'Name' },
                  { key: 'recent', label: 'Recent' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortButton,
                      sortBy === option.key && {
                        backgroundColor: theme.colors.primary[500],
                      },
                    ]}
                    onPress={() => setSortBy(option.key as any)}
                  >
                    <Text
                      size='sm'
                      style={[styles.sortButtonText, sortBy === option.key && { color: 'white' }]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Card>

        {/* Simple Device List */}
        <Card variant='elevated' style={styles.devicesCard}>
          <View style={styles.devicesHeader}>
            <Text weight='bold' size='lg' style={styles.cardTitle}>
              Available Devices
            </Text>
            <Badge label={`${filteredDevices.length} devices`} variant='primary' />
          </View>

          {filteredDevices.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name='phone-portrait-outline'
                size={48}
                color={theme.colors.text.tertiary}
              />
              <Text variant='secondary' size='lg' style={styles.emptyText}>
                No devices found
              </Text>
              <Text variant='secondary' size='sm' style={styles.emptySubtext}>
                Start scanning to discover nearby devices
              </Text>
            </View>
          ) : (
            <View style={styles.deviceList}>
              {filteredDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  isConnected={isConnected && connectedDevice?.id === device.id}
                  onPress={handleConnect}
                />
              ))}
            </View>
          )}
        </Card>
      </ThemedScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 0,
  },
  scanCard: {
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
  },
  scanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 0,
  },
  scanInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  scanBtn: {
    flex: 1,
  },
  clearBtn: {
    flex: 1,
  },
  lastScanText: {
    marginTop: 12,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: 20,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statText: {
    marginLeft: 12,
    flex: 1,
  },
  filterCard: {
    marginBottom: 20,
    padding: 16,
  },
  filterRow: {
    marginTop: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  sortButtonText: {
    fontWeight: '500',
  },
  devicesCard: {
    marginBottom: 20,
    padding: 16,
  },
  devicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    textAlign: 'center',
  },
  deviceList: {
    gap: 12,
  },
});
