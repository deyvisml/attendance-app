// app/_layout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#111111',
    border: '#E5E7EB',
    primary: '#2563EB',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={LightTheme}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#111111',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      />
    </ThemeProvider>
  );
}
