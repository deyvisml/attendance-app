// app/attendance/new.tsx
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View , ScrollView } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ENDPOINT = 'http://10.0.2.2:8000/api/attendance-lists'; 

export default function NewAttendanceList() {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState(`Asistencia (${new Date().toLocaleDateString('es-PE')})`);
    const [grade, setGrade] = useState('');
    const [section, setSection] = useState('');
    const [loading, setLoading] = useState(false); 

    // async function save() {

    //     if (!grade.trim() || !section.trim()) {
    //     Alert.alert('Faltan datos', 'Completa Grado y Sección.');
    //     return;
    //     }

    //     if (loading) return; 
    //     setLoading(true);

    //     try {

    //     const res = await fetch(ENDPOINT, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //         body: JSON.stringify({ name: name.trim(), grade: grade.trim(), section: section.trim() }),
    //     });

    //     const json = await res.json().catch(() => ({}));
    //     if (!res.ok) throw new Error(json?.message || `Error ${res.status}`);

    //     // Navega al escáner de esta lista recién creada
    //     const id = String(json.id);
    //     Alert.alert('OK', 'Lista creada');
    //     router.replace({ pathname: '/attendance/[id]', params: { id } });
    //     } catch (e:any) {
    //     Alert.alert('Error', e?.message ?? 'No se pudo crear la lista');
    //     } finally{
    //         setLoading(false);
    //     }

    // }

    function save(){
        const id = 1;
        Alert.alert('OK', 'Lista creada');
        router.replace({ pathname: '/attendance/[id]', params: { id } });
    }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
          contentContainerStyle={[
            s.wrap,
            {
              // evita que los inputs queden debajo de la status bar (arriba)
              paddingTop: (s.wrap?.padding ?? 16) + insets.top,
              // evita que el botón quede debajo de la barra/tab nativa (abajo)
              paddingBottom: (s.wrap?.padding ?? 16) + insets.bottom,
            },
          ]}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
      >
      <View style={s.c}>
        <TextInput editable={!loading} style={s.in} placeholder="Nombre de la lista" value={name} onChangeText={setName} />
        {/* <TextInput editable={!loading} style={s.in} placeholder="Grado" value={grade} onChangeText={setGrade} />
        <TextInput editable={!loading} style={s.in} placeholder="Sección" value={section} onChangeText={setSection} /> */}

          <View style={{ opacity: loading ? 0.6 : 1 }}>
              <Button title={loading ? 'Creando…' : 'Crear'} onPress={save} disabled={loading} />
          </View>
        {/* <Button title="Crear" onPress={save} /> */}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: {
    gap: 12,
    padding: 16,
  },
  c: { gap: 12, padding: 16 },
  in: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
});
