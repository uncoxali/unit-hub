import React from 'react';
import { View, Text, ScrollView, Alert, Linking, ViewStyle, TextStyle } from 'react-native';
import { Button } from '../components/common/Button';
import { UNIT_HUB_CONFIG, BLE_ERROR_MESSAGES } from '../constants/ble';

interface SettingsScreenProps {
  onBackPress?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBackPress }) => {
  const handleAbout = () => {
    Alert.alert(
      'About Unit-Hub App',
      `Version: 1.0.0\n\nThis app is designed to communicate with Unit-Hub BLE devices using Bluetooth Low Energy technology.\n\nTarget Device: ${UNIT_HUB_CONFIG.DEVICE_NAME}\nBLE Version: ${UNIT_HUB_CONFIG.BLE_VERSION}\nPreferred MTU: ${UNIT_HUB_CONFIG.PREFERRED_MTU_SIZE} bytes`,
      [{ text: 'OK' }],
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'Features:\n\n• Device Scanning and Connection\n• Real-time Device Monitoring\n• Configuration Management\n• Measurement Duration Settings\n• System Control Functions\n• Over-the-Air Updates\n• Factory Reset\n\nMake sure your Unit-Hub device is powered on and within range for optimal connectivity.',
      [{ text: 'OK' }],
    );
  };

  const handleBLEInfo = () => {
    Alert.alert(
      'Bluetooth Information',
      `Required Permissions:\n• Bluetooth Access\n• Location Services\n• Nearby Device Scanning\n\nSupported Features:\n• BLE 5.0 Communication\n• Secure Connections\n• MTU Negotiation\n• Characteristic Notifications\n\nConnection Range: ~10 meters\nRecommended Distance: 1-5 meters`,
      [{ text: 'OK' }],
    );
  };

  const handleTroubleshooting = () => {
    Alert.alert(
      'Troubleshooting',
      'Common Issues:\n\n• Device not found: Ensure device is powered on and nearby\n• Connection failed: Check Bluetooth is enabled and permissions are granted\n• Slow performance: Move closer to device\n• Frequent disconnections: Check device battery level\n\nFor persistent issues, try restarting both the app and the device.',
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Configuration & Information</Text>
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Version:</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Target Device:</Text>
            <Text style={styles.value}>{UNIT_HUB_CONFIG.DEVICE_NAME}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>BLE Version:</Text>
            <Text style={styles.value}>{UNIT_HUB_CONFIG.BLE_VERSION}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>MTU Size:</Text>
            <Text style={styles.value}>{UNIT_HUB_CONFIG.PREFERRED_MTU_SIZE} bytes</Text>
          </View>

          <Button
            title='About This App'
            onPress={handleAbout}
            variant='secondary'
            size='md'
            style={styles.buttonSpacing}
          />
        </View>

        {/* Bluetooth Configuration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bluetooth Configuration</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Scan Timeout:</Text>
            <Text style={styles.value}>{UNIT_HUB_CONFIG.SCAN_TIMEOUT / 1000}s</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Connection Timeout:</Text>
            <Text style={styles.value}>{UNIT_HUB_CONFIG.CONNECTION_TIMEOUT / 1000}s</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Reconnection Attempts:</Text>
            <Text style={styles.value}>{UNIT_HUB_CONFIG.RECONNECTION_ATTEMPTS}</Text>
          </View>

          <Button
            title='Bluetooth Information'
            onPress={handleBLEInfo}
            variant='primary'
            size='md'
            style={styles.buttonSpacing}
          />
        </View>

        {/* Device Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Features</Text>

          <Text style={styles.featureText}>✓ Device Information Reading</Text>
          <Text style={styles.featureText}>✓ Measurement Duration Configuration</Text>
          <Text style={styles.featureText}>✓ LoRaWAN Configuration</Text>
          <Text style={styles.featureText}>✓ System Control Functions</Text>
          <Text style={styles.featureText}>✓ Alarm Status Monitoring</Text>
          <Text style={styles.featureText}>✓ Log Management</Text>
          <Text style={styles.featureText}>✓ Over-the-Air Updates</Text>
          <Text style={styles.featureText}>✓ Factory Reset</Text>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>

          <Button
            title='How to Use'
            onPress={handleHelp}
            variant='primary'
            size='md'
            style={styles.buttonSpacing}
          />

          <Button
            title='Troubleshooting'
            onPress={handleTroubleshooting}
            variant='secondary'
            size='md'
            style={styles.buttonSpacing}
          />
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Text style={styles.legalText}>
            This application is designed for use with Unit-Hub devices only. Ensure you have proper
            authorization before connecting to any Bluetooth device.
          </Text>
          <Text style={styles.legalText}>
            The app requires Bluetooth and location permissions to function correctly. These
            permissions are used solely for device connectivity and are not used for tracking or
            data collection purposes.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  } as ViewStyle,

  scrollView: {
    flex: 1,
  } as ViewStyle,

  scrollContent: {
    paddingBottom: 20,
  } as ViewStyle,

  header: {
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  } as ViewStyle,

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  } as TextStyle,

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  } as TextStyle,

  section: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  } as ViewStyle,

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  } as TextStyle,

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  } as ViewStyle,

  label: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  } as TextStyle,

  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  } as TextStyle,

  featureText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  } as TextStyle,

  legalText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  } as TextStyle,

  buttonSpacing: {
    marginTop: 12,
  } as ViewStyle,
};
