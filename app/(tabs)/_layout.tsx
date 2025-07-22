import React, { useRef, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';

export default function TabLayout() {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.isDark
              ? theme.colors.surface.primary
              : theme.colors.surface.primary,
            borderTopWidth: 1,
            borderTopColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            paddingTop: 8,
            paddingBottom: 20,
            paddingHorizontal: 16,
            height: 88,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarActiveTintColor: theme.colors.primary[500],
          tabBarInactiveTintColor: theme.colors.text.secondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: focused ? 1.2 : 1,
                    },
                  ],
                }}
              >
                <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name='devices'
          options={{
            title: 'Devices',
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: focused ? 1.2 : 1,
                    },
                  ],
                }}
              >
                <Ionicons
                  name={focused ? 'bluetooth' : 'bluetooth-outline'}
                  size={size}
                  color={color}
                />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name='device'
          options={{
            title: 'Details',
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: focused ? 1.2 : 1,
                    },
                  ],
                }}
              >
                <Ionicons
                  name={focused ? 'analytics' : 'analytics-outline'}
                  size={size}
                  color={color}
                />
              </Animated.View>
            ),
          }}
        />
        <Tabs.Screen
          name='settings'
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size, focused }) => (
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: focused ? 1.2 : 1,
                    },
                  ],
                }}
              >
                <Ionicons
                  name={focused ? 'settings' : 'settings-outline'}
                  size={size}
                  color={color}
                />
              </Animated.View>
            ),
          }}
        />
      </Tabs>
    </Animated.View>
  );
}
