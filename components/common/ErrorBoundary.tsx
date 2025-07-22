import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We encountered an unexpected error. Please try again.
            </Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>{this.state.error.message}</Text>
              </View>
            )}
            <Button title='Try Again' onPress={this.handleReset} variant='primary' size='md' />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  } as ViewStyle,

  content: {
    alignItems: 'center',
    maxWidth: 300,
  } as ViewStyle,

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  } as TextStyle,

  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  } as TextStyle,

  errorDetails: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    width: '100%',
  } as ViewStyle,

  errorText: {
    fontSize: 12,
    color: '#991B1B',
    fontFamily: 'monospace',
  } as TextStyle,
};
