import React from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Text } from '../Themed';
import { useTheme } from '../Themed';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    toggleTheme();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }, { rotate: spin }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            shadowColor: isDark ? '#38bdf8' : '#3b82f6',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isDark ? 0.3 : 0.2,
            shadowRadius: isDark ? 10 : 8,
            elevation: isDark ? 5 : 3,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text
          size='xl'
          style={[
            styles.icon,
            {
              color: isDark ? '#38bdf8' : '#3b82f6',
              textShadowColor: isDark ? '#38bdf8' : '#3b82f6',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: isDark ? 5 : 3,
            },
          ]}
        >
          {isDark ? '🌙' : '☀️'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
});
