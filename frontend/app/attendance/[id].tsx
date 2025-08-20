// pantalla para escanear el qr y marcar como asistencia

// Usa expo-camera (CameraView) para leer el QR.

// Debounce para no leer dos veces seguidas.

// Envía POST /api/attendance-lists/:id/scan con { dni }.

// Muestra un resumen present/total si el backend lo devuelve.


// ----------------
// para acceder a esta pantalla se usa
// <Pressable
//   onPress={() => router.navigate({ pathname: '/attendance/[id]', params: { id: String(item.id) } })}
// >

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Platform, Text, View } from 'react-native';

const API_BASE = Platform.select({
  android: 'http://10.0.2.2:8000', // emulador Android
  ios: 'http://localhost:8000',    // simulador iOS
  default: 'http://localhost:8000',
});

export default function TakeAttendance() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [enabled, setEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<{ total?: number; present?: number; absent?: number }>({});

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  async function handleScan({ data }: { data: string }) {
    if (!enabled || busy) return;
    setEnabled(false);
    setBusy(true);
    try {
      const dni = String(data).trim();
    //   const dni = '71596860';
      Alert.alert('OK', `numero recibido ${dni}`);

      if (!/^\d{8}$/.test(dni)) {
        Alert.alert('QR inválido', `No parece un DNI: ${dni}`);
        return;
      }
      return;
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo marcar asistencia');
    } finally {
      setBusy(false);
      setTimeout(() => setEnabled(true), 700); // evita doble lectura
    }
  }

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Button title="Permitir cámara" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'pink', paddingBottom: 60 }}>
      <CameraView
        style={{ flex: 1, }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={enabled ? handleScan : undefined}
      />

      <View style={{ padding: 12, gap: 6 }}>
        <Text>
          Lista número: {id} | {summary.present ?? 0}/{summary.total ?? 0} presentes
        </Text>
        <Button
          title={enabled ? (busy ? 'Procesando…' : 'Pausar escáner') : 'Reanudar escáner'}
          onPress={() => setEnabled((v) => !v)}
        />
      </View>
    </View>
  );
}
