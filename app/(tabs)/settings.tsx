import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useTheme } from '../../components/Themed';
import {
  Card,
  Text,
  View as ThemedView,
  ScrollView as ThemedScrollView,
} from '../../components/Themed';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const theme = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoScan, setAutoScan] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [appVersion] = useState('1.0.0');
  const [buildNumber] = useState('2024.01.15');

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'This will clear all cached data. This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Success', 'Cache cleared successfully');
        },
      },
    ]);
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to default values. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setNotifications(true);
            setAutoScan(false);
            setLocationServices(true);
            setDataSync(true);
            Alert.alert('Success', 'Settings reset to default');
          },
        },
      ],
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Data export started. You will receive a notification when complete.',
    );
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Please select a file to import your data.');
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
            Settings
          </Text>
          <Text variant='secondary' size='base' style={styles.subtitle}>
            Customize your Unit-Hub experience
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ThemedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Preferences */}
        <Card variant='elevated' style={styles.sectionCard}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            App Preferences
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text weight='medium' size='base'>
                Notifications
              </Text>
              <Text variant='secondary' size='sm'>
                Receive alerts and updates
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: theme.isDark ? theme.colors.neutral[300] : theme.colors.neutral[200],
                true: theme.colors.primary[500],
              }}
              thumbColor={
                notifications
                  ? theme.colors.text.inverse
                  : theme.isDark
                  ? theme.colors.neutral[400]
                  : theme.colors.neutral[300]
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text weight='medium' size='base'>
                Auto Scan
              </Text>
              <Text variant='secondary' size='sm'>
                Automatically scan for devices
              </Text>
            </View>
            <Switch
              value={autoScan}
              onValueChange={setAutoScan}
              trackColor={{
                false: theme.isDark ? theme.colors.neutral[300] : theme.colors.neutral[200],
                true: theme.colors.primary[500],
              }}
              thumbColor={
                autoScan
                  ? theme.colors.text.inverse
                  : theme.isDark
                  ? theme.colors.neutral[400]
                  : theme.colors.neutral[300]
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text weight='medium' size='base'>
                Location Services
              </Text>
              <Text variant='secondary' size='sm'>
                Allow location access for scanning
              </Text>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{
                false: theme.isDark ? theme.colors.neutral[300] : theme.colors.neutral[200],
                true: theme.colors.primary[500],
              }}
              thumbColor={
                locationServices
                  ? theme.colors.text.inverse
                  : theme.isDark
                  ? theme.colors.neutral[400]
                  : theme.colors.neutral[300]
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text weight='medium' size='base'>
                Data Sync
              </Text>
              <Text variant='secondary' size='sm'>
                Sync data across devices
              </Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{
                false: theme.isDark ? theme.colors.neutral[300] : theme.colors.neutral[200],
                true: theme.colors.primary[500],
              }}
              thumbColor={
                dataSync
                  ? theme.colors.text.inverse
                  : theme.isDark
                  ? theme.colors.neutral[400]
                  : theme.colors.neutral[300]
              }
            />
          </View>
        </Card>

        {/* Data Management */}
        <Card variant='elevated' style={styles.sectionCard}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            Data Management
          </Text>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
              <Ionicons name='download' size={24} color={theme.colors.primary[500]} />
              <Text weight='medium' size='base' style={styles.actionTitle}>
                Export Data
              </Text>
              <Text variant='secondary' size='sm' style={styles.actionDesc}>
                Export your data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleImportData}>
              <Ionicons name='cloud-upload' size={24} color={theme.colors.success[500]} />
              <Text weight='medium' size='base' style={styles.actionTitle}>
                Import Data
              </Text>
              <Text variant='secondary' size='sm' style={styles.actionDesc}>
                Import your data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleClearCache}>
              <Ionicons name='trash' size={24} color={theme.colors.warning[500]} />
              <Text weight='medium' size='base' style={styles.actionTitle}>
                Clear Cache
              </Text>
              <Text variant='secondary' size='sm' style={styles.actionDesc}>
                Clear cached data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleResetSettings}>
              <Ionicons name='refresh' size={24} color={theme.colors.error[500]} />
              <Text weight='medium' size='base' style={styles.actionTitle}>
                Reset Settings
              </Text>
              <Text variant='secondary' size='sm' style={styles.actionDesc}>
                Reset to default
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* App Information */}
        <Card variant='elevated' style={styles.sectionCard}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            App Information
          </Text>

          <View style={styles.infoItem}>
            <Text variant='secondary' size='sm'>
              Version
            </Text>
            <Text weight='medium' size='base'>
              {appVersion}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text variant='secondary' size='sm'>
              Build
            </Text>
            <Text weight='medium' size='base'>
              {buildNumber}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text variant='secondary' size='sm'>
              Platform
            </Text>
            <Text weight='medium' size='base'>
              React Native
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text variant='secondary' size='sm'>
              Framework
            </Text>
            <Text weight='medium' size='base'>
              Expo
            </Text>
          </View>
        </Card>

        {/* Support */}
        <Card variant='elevated' style={styles.sectionCard}>
          <Text weight='bold' size='lg' style={styles.cardTitle}>
            Support
          </Text>

          <View style={styles.supportGrid}>
            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name='help-circle' size={24} color={theme.colors.primary[500]} />
              <Text weight='medium' size='base' style={styles.supportTitle}>
                Help Center
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name='mail' size={24} color={theme.colors.success[500]} />
              <Text weight='medium' size='base' style={styles.supportTitle}>
                Contact Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name='document-text' size={24} color={theme.colors.warning[500]} />
              <Text weight='medium' size='base' style={styles.supportTitle}>
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportItem}>
              <Ionicons name='document' size={24} color={theme.colors.accent[500]} />
              <Text weight='medium' size='base' style={styles.supportTitle}>
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
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
  sectionCard: {
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingInfo: {
    flex: 1,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    alignItems: 'center',
  },
  actionTitle: {
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDesc: {
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  supportItem: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    alignItems: 'center',
  },
  supportTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
});
