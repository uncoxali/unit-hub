import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Easing,
  TextInput,
} from 'react-native';
import { useBluetooth } from '../../hooks/useBluetooth';
import { useTheme } from '../../components/Themed';
import { Text } from '../../components/Themed';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { UnitHubDevice } from '../../types/ble';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function DevicesScreen() {
  const theme = useTheme();
  const {
    isScanning,
    isConnected,
    connectedDevice,
    scannedDevices,
    connect,
    disconnect,
    startScan,
  } = useBluetooth();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDevices, setFilteredDevices] = useState<UnitHubDevice[]>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for scanning
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  useEffect(() => {
    // Filter devices based on search query
    const filtered = scannedDevices.filter(
      (device) =>
        device.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredDevices(filtered);
  }, [scannedDevices, searchQuery]);

  const handleScan = async () => {
    await startScan();
  };

  const handleConnect = async (device: UnitHubDevice) => {
    await connect(device);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const renderEmptyState = () => (
    <Animated.View
      style={[styles.emptyState, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <View style={styles.emptyIcon}>
          <Ionicons name='bluetooth-outline' size={64} color={theme.colors.primary[300]} />
        </View>
        <Text size='xl' weight='bold' style={styles.emptyTitle}>
          No Devices Found
        </Text>
        <Text size='sm' variant='secondary' style={styles.emptySubtitle}>
          Tap "Scan" to discover nearby Unit-Hub devices
        </Text>
        <Button
          title={isScanning ? 'Scanning...' : 'Start Scan'}
          variant='primary'
          onPress={handleScan}
          disabled={isScanning}
          style={styles.scanButton}
          icon={isScanning ? undefined : 'search'}
          iconPosition='left'
          size='lg'
        />
      </Animated.View>
    </Animated.View>
  );

  const renderDeviceCard = (device: UnitHubDevice, index: number) => {
    const isConnectedDevice = connectedDevice?.id === device.id;
    const delay = index * 100;

    return (
      <Animated.View
        key={device.id}
        style={[
          styles.deviceCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Card variant='elevated' style={styles.deviceCardInner}>
          <TouchableOpacity
            style={styles.deviceButton}
            onPress={() => (isConnectedDevice ? handleDisconnect() : handleConnect(device))}
          >
            <LinearGradient
              colors={
                isConnectedDevice
                  ? [theme.colors.success[500], theme.colors.success[600]]
                  : [theme.colors.surface.primary, theme.colors.surface.secondary]
              }
              style={styles.deviceGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.deviceContent}>
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceIcon}>
                    <Ionicons
                      name={isConnectedDevice ? 'bluetooth' : 'bluetooth-outline'}
                      size={24}
                      color={isConnectedDevice ? 'white' : theme.colors.primary[500]}
                    />
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text weight='semibold' size='lg' style={styles.deviceName}>
                      {device.name || 'Unknown Device'}
                    </Text>
                    <Text size='sm' variant='secondary' style={styles.deviceId}>
                      {device.id}
                    </Text>
                  </View>
                  <View style={styles.deviceStatus}>
                    <Badge
                      label={isConnectedDevice ? 'Connected' : 'Available'}
                      variant={isConnectedDevice ? 'success' : 'secondary'}
                      animated
                    />
                  </View>
                </View>

                <View style={styles.deviceActions}>
                  <Button
                    title={isConnectedDevice ? 'Disconnect' : 'Connect'}
                    variant={isConnectedDevice ? 'outline' : 'primary'}
                    onPress={() => (isConnectedDevice ? handleDisconnect() : handleConnect(device))}
                    style={styles.connectButton}
                    icon={isConnectedDevice ? 'close-circle' : 'bluetooth'}
                    iconPosition='left'
                    size='md'
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Card>
      </Animated.View>
    );
  };

  const renderStats = () => (
    <Animated.View
      style={[styles.statsContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.statsRow}>
        <Card variant='default' style={styles.statCard}>
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
        </Card>
        <Card variant='default' style={styles.statCard}>
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
        </Card>
      </View>
    </Animated.View>
  );

  const header = {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    borderBottomWidth: 1,
    borderBottomColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    backgroundColor: theme.colors.background.primary,
  };

  const searchBar = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.isDark ? theme.colors.neutral[400] : theme.colors.neutral[200],
  };

  const searchInput = {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: theme.colors.text.primary,
  };

  const scanButtonHeader = {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor='transparent'
        translucent
      />

      {/* Header */}
      <Animated.View
        style={[header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.headerContent}>
          <Text size='2xl' weight='bold' style={styles.title}>
            Devices
          </Text>
          <Text variant='secondary' size='base' style={styles.subtitle}>
            Discover and connect to Unit-Hub devices
          </Text>
        </View>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={[
              scanButtonHeader,
              {
                backgroundColor: isScanning ? theme.colors.warning[500] : theme.colors.primary[500],
              },
            ]}
            onPress={handleScan}
            disabled={isScanning}
          >
            <Ionicons name={isScanning ? 'stop' : 'search'} size={20} color='white' />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Search Bar */}
      {scannedDevices.length > 0 && (
        <Animated.View
          style={[
            styles.searchContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={searchBar}>
            <Ionicons name='search' size={20} color={theme.colors.text.secondary} />
            <TextInput
              style={searchInput}
              placeholder='Search devices...'
              placeholderTextColor={theme.colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name='close-circle' size={20} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}

      {/* Stats */}
      {scannedDevices.length > 0 && renderStats()}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {scannedDevices.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.deviceList}>
            {filteredDevices.map((device, index) => renderDeviceCard(device, index))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
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
  scanButtonHeader: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#000',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statText: {
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  scanButton: {
    minWidth: 200,
  },
  deviceList: {
    gap: 16,
  },
  deviceCard: {
    marginBottom: 16,
  },
  deviceCardInner: {
    padding: 0,
    overflow: 'hidden',
  },
  deviceButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  deviceGradient: {
    borderRadius: 20,
  },
  deviceContent: {
    padding: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    marginBottom: 4,
  },
  deviceId: {
    fontFamily: 'monospace',
  },
  deviceStatus: {
    marginLeft: 16,
  },
  deviceActions: {
    alignItems: 'stretch',
  },
  connectButton: {
    borderRadius: 12,
  },
});
