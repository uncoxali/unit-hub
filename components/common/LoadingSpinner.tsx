import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../Themed';
import { Text } from '../Themed';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export function LoadingSpinner({
  size = 'medium',
  text,
  variant = 'primary',
}: LoadingSpinnerProps) {
  const { colors } = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 0.8,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, [spinValue, pulseValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 24, height: 24, borderWidth: 2 };
      case 'large':
        return { width: 48, height: 48, borderWidth: 4 };
      default:
        return { width: 32, height: 32, borderWidth: 3 };
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.neutral[400];
      case 'success':
        return colors.success[500];
      case 'warning':
        return colors.warning[500];
      case 'error':
        return colors.error[500];
      default:
        return colors.primary[500];
    }
  };

  const sizeStyle = getSize();
  const variantColor = getVariantColor();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: sizeStyle.width,
            height: sizeStyle.height,
            borderWidth: sizeStyle.borderWidth,
            borderColor: variantColor,
            borderTopColor: 'transparent',
            transform: [{ rotate: spin }],
            opacity: pulseValue,
          },
        ]}
      />
      {text && (
        <Text variant='secondary' size='sm' style={[styles.text, { color: variantColor }]}>
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    borderRadius: 50,
  },
  text: {
    marginTop: 8,
    textAlign: 'center',
  },
});
