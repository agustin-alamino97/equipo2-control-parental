import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import { Button } from './Button';
import { Screen } from './Screen';
import { Text, View } from 'react-native';
import { colors } from '../theme';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error no controlado en la interfaz móvil:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Screen scroll={false}>
        <View style={{ flex: 1, justifyContent: 'center', gap: 18 }}>
          <Text style={{ color: colors.ink, fontSize: 25, fontWeight: '800' }}>Algo salió mal</Text>
          <Text style={{ color: colors.muted, fontSize: 16, lineHeight: 24 }}>
            La pantalla encontró un problema. Puedes volver a intentar iniciar la aplicación.
          </Text>
          <Button onPress={() => this.setState({ hasError: false })}>Volver a intentar</Button>
        </View>
      </Screen>
    );
  }
}
