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
import { useTheme } from '../../components/Themed';
import { Text } from '../../components/Themed';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { unitHubBLEService } from '../../services/bleService';
import { UnitHubDeviceComplete } from '../../types/ble';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const theme = useTheme();
  const [deviceData, setDeviceData] = useState<UnitHubDeviceComplete | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
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

    // Pulse animation for connection status
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    // Check connection status periodically
    const interval = setInterval(() => {
      const connected = unitHubBLEService.isConnected();
      setIsConnected(connected);

      if (connected) {
        const data = unitHubBLEService.getDeviceData();
        setDeviceData(data);
      } else {
        setDeviceData(null);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      pulseAnimation.stop();
    };
  }, []);

  const handleConnect = async () => {
    // This would typically open the device selection screen
    console.log('Connect to device');
  };

  const handleDisconnect = async () => {
    await unitHubBLEService.disconnect();
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    const tabIndex = tab === 'overview' ? 0 : 1;
    Animated.spring(tabIndicatorAnim, {
      toValue: tabIndex,
      useNativeDriver: false,
    }).start();
  };

  const getConnectionStatusColor = () => {
    if (!isConnected) return theme.colors.error[500];
    return theme.colors.success[500];
  };

  const getConnectionStatusText = () => {
    if (!isConnected) return 'Disconnected';
    return 'Connected';
  };

  const renderOverviewTab = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {/* Hero Section */}
      <Animated.View style={[styles.heroSection, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={
            isConnected
              ? [theme.colors.success[500], theme.colors.success[600]]
              : [theme.colors.primary[500], theme.colors.primary[600]]
          }
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.heroIcon}>
                <Ionicons
                  name={isConnected ? 'bluetooth' : 'bluetooth-outline'}
                  size={32}
                  color='white'
                />
              </View>
            </Animated.View>
            <View style={styles.heroInfo}>
              <Text size='2xl' weight='bold' style={styles.heroTitle}>
                {deviceData?.name || 'Unit-Hub Device'}
              </Text>
              <Text size='base' style={styles.heroSubtitle}>
                {getConnectionStatusText()}
              </Text>
            </View>
            <Badge
              label={isConnected ? 'Online' : 'Offline'}
              variant={isConnected ? 'success' : 'error'}
              animated
            />
          </View>
        </LinearGradient>

        {isConnected && deviceData && (
          <View style={styles.deviceDetails}>
            <View style={styles.detailRow}>
              <Text variant='secondary' size='sm'>
                Device ID
              </Text>
              <Text size='sm' weight='medium' style={styles.detailValue}>
                {deviceData.id}
              </Text>
            </View>
            {deviceData.deviceInfo?.modelNumber && (
              <View style={styles.detailRow}>
                <Text variant='secondary' size='sm'>
                  Model
                </Text>
                <Text size='sm' weight='medium' style={styles.detailValue}>
                  {deviceData.deviceInfo.modelNumber}
                </Text>
              </View>
            )}
            {deviceData.deviceInfo?.firmwareRevision && (
              <View style={styles.detailRow}>
                <Text variant='secondary' size='sm'>
                  Firmware
                </Text>
                <Text size='sm' weight='medium' style={styles.detailValue}>
                  {deviceData.deviceInfo.firmwareRevision}
                </Text>
              </View>
            )}
            {deviceData.lastSync && (
              <View style={styles.detailRow}>
                <Text variant='secondary' size='sm'>
                  Last Sync
                </Text>
                <Text size='sm' weight='medium' style={styles.detailValue}>
                  {deviceData.lastSync.toLocaleTimeString()}
                </Text>
              </View>
            )}
          </View>
        )}
      </Animated.View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text weight='bold' size='lg' style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          {[
            { icon: 'settings', label: 'Settings', color: theme.colors.primary[500] },
            { icon: 'refresh', label: 'Sync Data', color: theme.colors.success[500] },
            { icon: 'download', label: 'Download Logs', color: theme.colors.warning[500] },
            { icon: 'cloud-upload', label: 'OTA Update', color: theme.colors.accent[500] },
          ].map((action, index) => (
            <Animated.View
              key={action.label}
              style={[
                styles.actionCard,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                },
              ]}
            >
              <Card variant='elevated' style={styles.actionCardInner}>
                <TouchableOpacity style={styles.actionButton}>
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text weight='medium' size='sm' style={styles.actionLabel}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              </Card>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* System Status */}
      <View style={styles.statusSection}>
        <Text weight='bold' size='lg' style={styles.sectionTitle}>
          System Status
        </Text>
        <View style={styles.statusGrid}>
          {[
            {
              icon: 'cellular',
              label: 'LoRaWAN',
              status: deviceData?.loraWANConfig?.networkStatus || 'Unknown',
              color: theme.colors.primary[500],
            },
            {
              icon: 'thermometer',
              label: 'Gas Sensor',
              status: deviceData?.alarmService?.gasAlarm ? 'Alarm' : 'Normal',
              color: theme.colors.warning[500],
              isAlarm: deviceData?.alarmService?.gasAlarm,
            },
            {
              icon: 'location',
              label: 'GNSS',
              status: deviceData?.alarmService?.gnssAlarm ? 'Alarm' : 'Normal',
              color: theme.colors.success[500],
              isAlarm: deviceData?.alarmService?.gnssAlarm,
            },
            {
              icon: 'battery-charging',
              label: 'Power',
              status: deviceData?.alarmService?.powerAlarm ? 'Alarm' : 'Normal',
              color: theme.colors.accent[500],
              isAlarm: deviceData?.alarmService?.powerAlarm,
            },
          ].map((item, index) => (
            <Animated.View
              key={item.label}
              style={[
                styles.statusCard,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                },
              ]}
            >
              <Card variant='default' style={styles.statusCardInner}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusIconSmall, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={styles.statusText}>
                    <Text weight='medium' size='sm' style={styles.statusLabel}>
                      {item.label}
                    </Text>
                    <Badge
                      label={item.status}
                      variant={item.isAlarm ? 'error' : 'success'}
                      size='sm'
                    />
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderServicesTab = () => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, { opacity: searchAnim }]}>
        <View style={searchBar}>
          <Ionicons name='search' size={20} color={theme.colors.text.secondary} />
          <TextInput
            style={searchInput}
            placeholder='Search services...'
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

      {/* Device Information Service */}
      <Animated.View style={[styles.serviceCard, { transform: [{ scale: scaleAnim }] }]}>
        <Card variant='elevated' style={styles.serviceCardInner}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            Device Information
          </Text>
          {deviceData?.deviceInfo ? (
            <View style={styles.serviceDetails}>
              {deviceData.deviceInfo.manufacturerName && (
                <View style={styles.detailRow}>
                  <Text variant='secondary' size='sm'>
                    Manufacturer
                  </Text>
                  <Text size='sm' weight='medium' style={styles.detailValue}>
                    {deviceData.deviceInfo.manufacturerName}
                  </Text>
                </View>
              )}
              {deviceData.deviceInfo.serialNumber && (
                <View style={styles.detailRow}>
                  <Text variant='secondary' size='sm'>
                    Serial Number
                  </Text>
                  <Text size='sm' weight='medium' style={styles.detailValue}>
                    {deviceData.deviceInfo.serialNumber}
                  </Text>
                </View>
              )}
              {deviceData.deviceInfo.hardwareRevision && (
                <View style={styles.detailRow}>
                  <Text variant='secondary' size='sm'>
                    Hardware
                  </Text>
                  <Text size='sm' weight='medium' style={styles.detailValue}>
                    {deviceData.deviceInfo.hardwareRevision}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text variant='secondary' size='sm'>
              No device information available
            </Text>
          )}
        </Card>
      </Animated.View>

      {/* Measurements Duration Service */}
      <Animated.View style={[styles.serviceCard, { transform: [{ scale: scaleAnim }] }]}>
        <Card variant='elevated' style={styles.serviceCardInner}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            Measurement Durations
          </Text>
          {deviceData?.measurementsDuration ? (
            <View style={styles.serviceDetails}>
              <View style={styles.detailRow}>
                <Text variant='secondary' size='sm'>
                  Gas Sensor
                </Text>
                <Text size='sm' weight='medium' style={styles.detailValue}>
                  {deviceData.measurementsDuration.gasDuration} min
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant='secondary' size='sm'>
                  GNSS
                </Text>
                <Text size='sm' weight='medium' style={styles.detailValue}>
                  {deviceData.measurementsDuration.gnssDuration} min
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant='secondary' size='sm'>
                  Power Consumption
                </Text>
                <Text size='sm' weight='medium' style={styles.detailValue}>
                  {deviceData.measurementsDuration.powerConsumptionDuration} min
                </Text>
              </View>
            </View>
          ) : (
            <Text variant='secondary' size='sm'>
              No measurement data available
            </Text>
          )}
        </Card>
      </Animated.View>

      {/* LoRaWAN Configuration */}
      <Animated.View style={[styles.serviceCard, { transform: [{ scale: scaleAnim }] }]}>
        <Card variant='elevated' style={styles.serviceCardInner}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            LoRaWAN Configuration
          </Text>
          {deviceData?.loraWANConfig ? (
            <View style={styles.serviceDetails}>
              <View style={styles.detailRow}>
                <Text variant='secondary' size='sm'>
                  Network Status
                </Text>
                <Badge label={deviceData.loraWANConfig.networkStatus} variant='primary' size='sm' />
              </View>
              {deviceData.loraWANConfig.appEUI && (
                <View style={styles.detailRow}>
                  <Text variant='secondary' size='sm'>
                    App EUI
                  </Text>
                  <Text size='sm' weight='medium' style={[styles.detailValue, styles.hexText]}>
                    {deviceData.loraWANConfig.appEUI}
                  </Text>
                </View>
              )}
              {deviceData.loraWANConfig.devEUI && (
                <View style={styles.detailRow}>
                  <Text variant='secondary' size='sm'>
                    Dev EUI
                  </Text>
                  <Text size='sm' weight='medium' style={[styles.detailValue, styles.hexText]}>
                    {deviceData.loraWANConfig.devEUI}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text variant='secondary' size='sm'>
              No LoRaWAN configuration available
            </Text>
          )}
        </Card>
      </Animated.View>
    </Animated.View>
  );

  const modernHeader = {
    paddingTop: 60,
    paddingBottom: 24,
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

  const tabBackground = {
    position: 'absolute' as const,
    top: 16,
    left: 16,
    right: 16,
    height: 40,
    backgroundColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
  };

  const tabIndicator = {
    position: 'absolute' as const,
    top: 4,
    left: 4,
    width: (width - 64) / 2,
    height: 32,
    backgroundColor: theme.colors.surface.primary,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  };

  const tabText = {
    fontWeight: '500' as const,
    color: theme.isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  };

  const activeTabText = {
    color: theme.colors.text.primary,
    fontWeight: '600' as const,
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor='transparent'
        translucent
      />

      {/* Modern Header */}
      <Animated.View
        style={[modernHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.headerContent}>
          <Text size='3xl' weight='bold' style={styles.title}>
            Unit-Hub
          </Text>
          <Text variant='secondary' size='base' style={styles.subtitle}>
            IoT Device Management
          </Text>
        </View>
        <ThemeToggle />
      </Animated.View>

      {/* Connection Button */}
      {!isConnected && (
        <Animated.View
          style={[
            styles.connectSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Button
            title='Connect to Device'
            variant='primary'
            onPress={handleConnect}
            icon='bluetooth'
            iconPosition='left'
            style={styles.connectButton}
            size='lg'
          />
        </Animated.View>
      )}

      {/* Modern Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={tabBackground}>
          <Animated.View
            style={[
              tabIndicator,
              {
                transform: [
                  {
                    translateX: tabIndicatorAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, width / 2 - 16],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('overview')}>
          <Text
            size='sm'
            weight='medium'
            style={[tabText, activeTab === 'overview' && activeTabText]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('services')}>
          <Text
            size='sm'
            weight='medium'
            style={[tabText, activeTab === 'services' && activeTabText]}
          >
            Services
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'overview' ? renderOverviewTab() : renderServicesTab()}
      </ScrollView>

      {/* Disconnect Button */}
      {isConnected && (
        <Animated.View
          style={[
            styles.disconnectSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Button
            title='Disconnect'
            variant='outline'
            onPress={handleDisconnect}
            icon='close-circle'
            iconPosition='left'
            style={styles.disconnectButton}
            size='lg'
          />
        </Animated.View>
      )}
    </View>
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
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  modernHeader: {
    paddingTop: 60,
    paddingBottom: 24,
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
  connectSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  connectButton: {
    width: '100%',
  },
  tabContainer: {
    position: 'relative',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tabBackground: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
  },
  tabIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: (width - 64) / 2,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  heroSection: {
    marginBottom: 24,
  },
  heroGradient: {
    borderRadius: 20,
    marginBottom: 16,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroInfo: {
    flex: 1,
  },
  heroTitle: {
    color: 'white',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  deviceDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  detailValue: {
    fontFamily: 'monospace',
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    marginBottom: 12,
  },
  actionCardInner: {
    padding: 0,
  },
  actionButton: {
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    textAlign: 'center',
  },
  statusSection: {
    marginBottom: 24,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusCard: {
    width: '48%',
    marginBottom: 12,
  },
  statusCardInner: {
    padding: 0,
  },
  statusItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    marginBottom: 4,
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
  serviceCard: {
    marginBottom: 16,
  },
  serviceCardInner: {
    padding: 20,
  },
  serviceDetails: {
    gap: 12,
  },
  cardTitle: {
    marginBottom: 16,
  },
  hexText: {
    fontFamily: 'monospace',
  },
  disconnectSection: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  disconnectButton: {
    width: '100%',
  },
});
