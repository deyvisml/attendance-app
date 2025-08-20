import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, Pressable, StyleSheet, Text, View, Platform, ScrollView, KeyboardAvoidingView, Modal, TextInput   } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
const BASE_URL = 'http://10.0.2.2:8000'; // ← ajusta según tu entorno
// const ENDPOINT = `${BASE_URL}/api/attendance-lists`;
// const ENDPOINT = process.env.EXPO_PUBLIC_API_URL;
const ENDPOINT = "https://api-attendance-app.deyvisml.com";
type AttendanceList = {
  id: number;
  name: string;
  date: string;
  grade: string;
  section: string;
};
type ApiResponse = {
  data: { id:number; name:string; created_at:string }[];
  links: { next: string | null };
  meta: { current_page: number; per_page: number };
};

export default function Lists() {
  const [items, setItems] = useState<AttendanceList[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets()

  const [showCreate, setShowCreate] = useState(false);
  const [formName, setFormName] = useState(getDefaultListName());
  const [creating, setCreating] = useState(false);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // async function load() {
  //   try {
  //     const res = await fetch(`${ENDPOINT}/api/attendance-lists`, { headers: { Accept: 'application/json' } });
  //     const json = await res.json();
  //     // Soporta respuesta como array o como { data: [...] }
  //     json.data
  //     setItems(Array.isArray(json) ? json : json?.data ?? []);
  //   } catch {
  //     Alert.alert('Error', 'No se pudo cargar la lista.');
  //   } finally {
  //     setLoading(false);
  //   }
  // }
   function getDefaultListName() {
     const d = new Date();
     const yyyy = d.getFullYear();
     const mm = String(d.getMonth() + 1).padStart(2, '0');
     const dd = String(d.getDate()).padStart(2, '0');
     return `mi lista ${yyyy}-${mm}-${dd}`;
   }

  async function loadPage(targetPage = 1, { append = false } = {}) {
    // cuando es la primera página, controla 'loading'; si no, 'loadingMore'
    targetPage === 1 ? setLoading(true) : setLoadingMore(true);
    try {
      const url = `${ENDPOINT}/api/attendance-lists?page=${targetPage}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json: ApiResponse = await res.json();

      // Normaliza a tu tipo local (puedes mapear created_at -> date si lo quieres mostrar)
      const pageItems: AttendanceList[] = (json?.data ?? []).map((x) => ({
        id: x.id,
        name: x.name,
        date: x.created_at,  // <- si prefieres, formatea luego
        grade: '',           // <- si el backend no lo envía aquí, déjalo vacío o remueve la columna
        section: '',
      }));

      setHasNextPage(Boolean(json?.links?.next));
      setPage(json?.meta?.current_page ?? targetPage);

      setItems((prev) => (append ? [...prev, ...pageItems] : pageItems));
    } catch (e) {
      Alert.alert('Error', 'No se pudo cargar la lista.');
    } finally {
      targetPage === 1 ? setLoading(false) : setLoadingMore(false);
      if (refreshing) setRefreshing(false);
    }
  }

  async function createList() {
    try {
      setCreating(true);
      const name = formName.trim() || getDefaultListName();
      const res = await fetch(`${ENDPOINT}/api/attendance-lists`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const msg = `HTTP ${res.status}`;
        throw new Error(msg);
      }
      const created = await res.json(); // asume que devuelve { id, name, created_at, ... }
           // Opción A: insertar al inicio (rápido)

      setItems(prev => [
        {
          id: created.id,
          name: created.name,
          date: created.created_at ?? new Date().toISOString(),
          grade: '',
          section: '',
        },
        ...prev,
      ]);
    // Refresca coherente con la paginación: vuelve a la página 1
      await loadPage(1, { append: false }); // ← recarga la primera página
           // Opción B (alternativa): recargar desde el backend
      // await load(); // si prefieres coherencia con la paginación/filtros
      setShowCreate(false);
      setFormName('');
      Alert.alert('OK', 'Lista creada.');
    } catch (e:any) {
      Alert.alert('Error', e?.message ?? 'No se pudo crear la lista.');
    } finally {
      setCreating(false);
    }
  }

  async function openPdf(id: number) {
      const url = `${BASE_URL}/api/attendance-lists/${id}/report.pdf`; // ajusta a tu endpoint real
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert('Aviso', 'No se pudo abrir el enlace del PDF.');
        return;
      }
      Linking.openURL(url);
  }

  const FAKE_LISTS = [
    { id: 1, name: 'Asistencia (16/08/2025)', date: '2025-08-16', grade: '5', section: 'A' },
    { id: 2, name: 'Asistencia (15/08/2025)', date: '2025-08-15', grade: '5', section: 'B' },
    { id: 3, name: 'Asistencia (14/08/2025)', date: '2025-08-14', grade: '4', section: 'C' },
    { id: 47, name: 'Asistencia (01/07/2025)', date: '2025-07-01', grade: '5', section: 'B' },
    { id: 48, name: 'Asistencia (30/06/2025)', date: '2025-06-30', grade: '5', section: 'C' },
  ];

  // async function load() {
  //   setLoading(true);
  //     try {
  //         // Simula latencia de red (opcional)
  //         await new Promise((r) => setTimeout(r, 300));
  //         setItems(FAKE_LISTS);
  //     } finally {
  //         setLoading(false);
  //     }
  // }


  // useEffect(() => { load(); }, []);
  useEffect(() => { loadPage(1, { append: false }); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Reinicia a la primera página
    loadPage(1, { append: false });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 0 }}>
      <Text style={{ paddingTop: 16, fontSize: 20, fontWeight: '700', textAlign: "center" }}>Listas de asistencia</Text>
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ paddingBottom: 96 }}
        ListEmptyComponent={<View style={s.empty}><Text>No hay listas.</Text></View>}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!loadingMore && hasNextPage) {
            // siguiente página
            loadPage(page + 1, { append: true });
          }
        }}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            // onPress={() => router.navigate({ pathname: '/attendance/[id]', params: { id: String(item.id) } })}
            onPress={() => router.navigate({ pathname: '/attendance/[id]/registered', params: { id: String(item.id), name: item.name } })}
          >
            <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ fontSize: 16 }}>{item.id} : {item.name}</Text>
              <Text style={{ color: '#666'  , textAlign: 'right', marginTop: 8, fontSize: 12 }}>{new Date(item.date).toLocaleString([], { 
                  dateStyle: 'short', 
                  timeStyle: 'short' 
                })}
              </Text>
            </View>
          </Pressable>
        )}
      />
      
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Crear lista"
        // onPress={() => router.navigate('/attendance/new')}
        onPress={() => setShowCreate(true)}
        style={[
          s.fab,
          {
            right: 16,
            bottom: 16 + (insets?.bottom ?? 0), // si no usas safe-area, reemplaza por 16
          },
        ]}
      >
        {/* Opción 1: solo ícono “+” */}
        <Ionicons name="add" size={28} color="#fff" />
        {/* Opción 2 (en lugar del icono): <Text style={{ color:'#fff', fontSize:24, lineHeight:24 }}>+</Text> */}
      </Pressable>

       <Modal
         visible={showCreate}
         animationType="slide"
         transparent
         onRequestClose={() => !creating && setShowCreate(false)}
       >
         <View style={s.modalBackdrop}>
           <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={s.modalCard}>
             <Text style={s.modalTitle}>Nueva lista</Text>

             <TextInput
               placeholder="Nombre de la lista"
               value={formName}
               onChangeText={setFormName}
               style={s.input}
               editable={!creating}
               returnKeyType="done"
               onSubmitEditing={() => !creating && createList()}
             />

             <View style={s.modalRow}>
               <Pressable
                 style={[s.modalBtn, s.secondary]}
                 onPress={() => setShowCreate(false)}
                 disabled={creating}
               >
                 <Text style={[s.btnText, s.secondaryText]}>Cancelar</Text>
               </Pressable>

               <Pressable
                 style={[s.modalBtn, s.primary, creating && { opacity: 0.7 }]}
                 onPress={createList}
                 disabled={creating}
               >
                 {creating ? <ActivityIndicator /> : <Text style={s.btnText}>Crear</Text>}
               </Pressable>
             </View>
           </KeyboardAvoidingView>
         </View>
       </Modal>
  
    </SafeAreaView>
  );
}


const s = StyleSheet.create({
  wrap: {
    gap: 12,
    padding: 16,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: 16 },
  item: { padding: 12, backgroundColor: '#fff' },
  title: { fontWeight: '600', marginBottom: 4 },
  meta: { color: '#666', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: '#2563eb' },
  secondary: {
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  btnText: { color: '#fff', fontWeight: '600' },
  secondaryText: { color: '#1e40af' },
  sep: { height: 1, backgroundColor: '#eee' },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    ...Platform.select({
      android: { elevation: 6 },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
      default: {},
    }),
  },
   modalBackdrop: {
     flex: 1,
     backgroundColor: 'rgba(0,0,0,0.35)',
     padding: 16,
     justifyContent: 'center',
   },
   modalCard: {
     backgroundColor: '#fff',
     borderRadius: 16,
     padding: 16,
   },
   modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
   modalHint: { color: '#555', marginBottom: 12 },
   input: {
     borderWidth: 1,
     borderColor: '#ddd',
     borderRadius: 10,
     paddingHorizontal: 12,
     paddingVertical: 10,
     marginBottom: 12,
     marginTop: 10,
   },
   modalRow: { flexDirection: 'row', gap: 8 },
   modalBtn: {
     flex: 1,
     paddingVertical: 12,
     borderRadius: 10,
     alignItems: 'center',
     justifyContent: 'center',
   },
});