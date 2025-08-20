import { router } from 'expo-router';
import { useState } from 'react';


import {
    ActivityIndicator,
    Alert,
    Button,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
// ======= Ajusta esto a tu entorno =======
const ANDROID_EMULATOR = 'http://10.0.2.2:8000';
const IOS_SIMULATOR = 'http://localhost:8000';
// Si pruebas en dispositivo físico, cambia por tu IP LAN:
// const LAN = 'http://192.168.1.50:8000';

const BASE_URL = Platform.select({
  android: ANDROID_EMULATOR,
  ios: IOS_SIMULATOR,
  default: IOS_SIMULATOR,
});

// Endpoint Laravel (ej: routes/api.php -> POST /api/students)
// const ENDPOINT = `${BASE_URL}/api/students`;
// const ENDPOINT = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = "https://api-attendance-app.deyvisml.com";

// Catálogos
const GRADES = [
  'Primer grado de secundaria',
  'Segundo grado de secundaria',
  'Tercer grado de secundaria',
  'Cuarto grado de secundaria',
  'Quinto grado de secundaria',
] as const;

const SECTIONS = [
  { id: '1', label: 'A' },
  { id: '2', label: 'B' },
  { id: '3', label: 'C' },
  { id: '4', label: 'D' },
  { id: '5', label: 'E' },
] as const;
// Si usas tokens (Sanctum/Passport), colócalo aquí:
// const TOKEN = 'tu_token_aqui';

export default function NewStudent() {
  const insets = useSafeAreaInsets();
  const [f, setF] = useState({
    dni: '',
    name: '',
    mother_last_name: '',
    father_last_name: '',
    grade_name: '',
    section_id: '',
    
    // level: '',
  });
  const [loading, setLoading] = useState(false);

  // function validate() {
  //   if (!f.dni?.trim() || !f.name?.trim()) {
  //     Alert.alert('Faltan datos', 'Completa DNI y Nombre.');
  //     return false;
  //   }
  //   // Valida DNI peruano típico (8 dígitos). Ajusta si necesitas otro formato:
  //   if (!/^\d{8}$/.test(f.dni.trim())) {
  //     Alert.alert('DNI inválido', 'El DNI debe tener 8 dígitos.');
  //     return false;
  //   }
  //   return true;
  // }
   function validate() {
    if (!f.dni?.trim() || !f.name?.trim()) {
      Alert.alert('Faltan datos', 'Completa DNI y Nombre.');
      return false;
    }
    if (!/^\d{8}$/.test(f.dni.trim())) {
      Alert.alert('DNI inválido', 'El DNI debe tener 8 dígitos.');
      return false;
    }
    if (!f.grade_name) {
      Alert.alert('Grado requerido', 'Selecciona un grado.');
      return false;
    }
    if (!f.section_id) {
      Alert.alert('Sección requerida', 'Selecciona una sección.');
      return false;
    }
    return true;
  }

  async function save() {
    
    if (!validate()) return;
    console.log("hola mundo001");
    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINT}/api/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        },
        body: JSON.stringify({
          name: f.name.trim(),
          father_last_name: f.father_last_name.trim(),
          mother_last_name: f.mother_last_name.trim(),
          dni: f.dni.trim(),
          grade_name: f.grade_name.trim(),
          // section_id: f.section_id.trim(),
          section_id: Number(f.section_id),         // ← enviamos número (1..5)
          // education_level: f.level.trim(), // <- si en Laravel lo llamaste 'education_level'
          // Si en Laravel el campo es 'level', cámbialo a 'level'
        }),
      });
      const payload = await res.json().catch(() => null);
      // Manejo de errores estándar de Laravel (422 con { errors })
      let data: any = {}
      if (!res.ok) {
        let msg = `Error ${res.status}`;
        if (res.status === 422 && payload?.errors) {
          const firstKey = Object.keys(payload.errors)[0];
          msg = payload.errors[firstKey]?.[0] ?? payload.message ?? msg;
        } else if (payload?.message) {
          msg = payload.message;
        }
        throw new Error(msg);
      }

      // Opcional: leer respuesta del server
      // const json = await res.json();
      // data.data.user_id
      // const msg =
      // `ID: ${data.data.user_id}\n` +
      // `Año: ${data.data.year}\n`;
      // Alert.alert('Registro creado exitosamente', 'Estudiante registrado');
      // console.log("datos registrados",msg);
      // Alert.alert('Registro creado exitosamente',msg);
      // router.back();
      Alert.alert(
        'Registro creado exitosamente',
        payload ? JSON.stringify(payload, null, 2) : 'OK'
      );
      
    } catch (e: any) {
      Alert.alert('No se pudo guardar', e?.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: "pink" }}>
    
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
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
       {/* <Text style={styles.buttonText}>Ver estudiantes</Text> */}
      {/* <Text>{ENDPOINT}</Text> */}
      <TextInput
        style={s.in}
        placeholder="DNI"
        value={f.dni}
        onChangeText={(v) => setF({ ...f, dni: v })}
        keyboardType="number-pad"
        maxLength={8}
      />
      <TextInput
        style={s.in}
        placeholder="Nombre"
        value={f.name}
        onChangeText={(v) => setF({ ...f, name: v })}
        autoCapitalize="words"
      />
      <TextInput
        style={s.in}
        placeholder="Apellido paterno"
        value={f.father_last_name}
        onChangeText={(v) => setF({ ...f, father_last_name: v })}
        autoCapitalize="words"
      />
      <TextInput
        style={s.in}
        placeholder="Apellido materno"
        value={f.mother_last_name}
        onChangeText={(v) => setF({ ...f, mother_last_name: v })}
        autoCapitalize="words"
      />
      {/* <TextInput
        style={s.in}
        placeholder="Grado"
        value={f.grade_name}
        onChangeText={(v) => setF({ ...f, grade_name: v })}
      /> */}
      <View style={s.select}>
          <Picker
            selectedValue={f.grade_name}
            onValueChange={(v) => setF({ ...f, grade_name: v })}
          >
            <Picker.Item label="Selecciona grado..." value="" />
            {GRADES.map((g) => (
              <Picker.Item key={g} label={g} value={g} />
            ))}
          </Picker>
      </View>
      <View style={s.select}>
          <Picker
            selectedValue={f.section_id}
            onValueChange={(v) => setF({ ...f, section_id: v })}
          >
            <Picker.Item label="Selecciona sección..." value="" />
            {SECTIONS.map((sct) => (
              <Picker.Item key={sct.id} label={sct.label} value={sct.id} />
            ))}
          </Picker>
      </View>
      {/* <TextInput
        style={s.in}
        placeholder="Sección"
        value={f.section_id}
        onChangeText={(v) => setF({ ...f, section_id: v })}
      /> */}
      {/* <TextInput
        style={s.in}
        placeholder="Nivel (Primaria/Secundaria…)"
        value={f.level}
        onChangeText={(v) => setF({ ...f, level: v })}
      /> */}


      {loading ? (
        <ActivityIndicator style={{ marginTop: 8 }} />
      ) : (
        <Button title="Guardar" onPress={save} />
      )}
    </ScrollView>
    // </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: {
    gap: 12,
    padding: 16,
    // backgroundColor: "blue"
  },
  in: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  select: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
