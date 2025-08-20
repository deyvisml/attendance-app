import { useEffect, useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Pressable,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import * as Linking from "expo-linking";
import * as FileSystem from "expo-file-system";
// const ENDPOINT = process.env.EXPO_PUBLIC_API_URL; // ej. https://api-attendance-app.deyvisml.com
const ENDPOINT = "https://api-attendance-app.deyvisml.com"; // ej. https://api-attendance-app.deyvisml.com

type ApiItem = {
  datetime: string;
  user_grade: {
    user: {
      id: number;
      dni: string;
      name: string;
      father_last_name: string;
      mother_last_name: string;
    };
    grade: {
      id: number;
      name: string;
      section: {
        id: number;
        name: string; // "A", "B", etc.
      };
    };
  };
};

type ApiResponse = {
  status: boolean;
  message: string;
  data: ApiItem[];
};

type Row = {
  key: string; // único por fila
  userId: number;
  dni: string;
  fullName: string; // "Nombre Apellido Apellido"
  grade: string; // "Primer Grado Primaria"
  section: string; // "A"
  datetime: string; // string original del backend
};

const DEBUG = false;
const SCAN_COOLDOWN_MS = 700; // pausa mínima entre lecturas
const DEDUPE_WINDOW_MS = 5000; // ignora el mismo QR por 5s

function alertJson(title: string, payload: any, max = 1200) {
  if (!DEBUG) return;
  let msg: string;
  if (typeof payload === "string") {
    msg = payload;
  } else {
    try {
      msg = JSON.stringify(payload, null, 2);
    } catch {
      msg = String(payload);
    }
  }
  if (msg.length > max) msg = msg.slice(0, max) + "… [truncado]";
  Alert.alert(title, msg);
}

export default function RegisteredStudents() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const title = typeof name === "string" && name ? name : `Lista ${id}`;
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const [scanOpen, setScanOpen] = useState(false);
  const lastScanAtRef = useRef(0);
  const lastCodeRef = useRef<string | null>(null);
  const lastSameCodeAtRef = useRef(0);
  //   const [hasCamPermission, setHasCamPermission] = useState<boolean | null>(null);
  //   const [scanLock, setScanLock] = useState(false); // evita lecturas duplicadas
  //   const [marking, setMarking] = useState(false);   // spinner al hacer POST

  const [permission, requestPermission] = useCameraPermissions();
  const [enabled, setEnabled] = useState(true); // pausar/reanudar lectura
  const [busy, setBusy] = useState(false); // mientras posteamos al backend
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  async function load() {
    if (!ENDPOINT) {
      Alert.alert("Config", "Falta EXPO_PUBLIC_API_URL");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${ENDPOINT}/api/attendance-lists/${id}/registered-students`,
        {
          headers: { Accept: "application/json" },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();

      const mapped: Row[] = (json?.data ?? []).map((it, idx) => {
        const u = it.user_grade.user;
        const g = it.user_grade.grade;
        const sec = g.section?.name ?? "";
        const fullName = `${u.father_last_name} ${u.mother_last_name}, ${u.name}`;
        return {
          key: `${u.id}-${it.datetime}-${idx}`,
          userId: u.id,
          dni: u.dni,
          fullName,
          grade: g.name,
          section: sec,
          datetime: it.datetime,
        };
      });

      setItems(mapped);
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.message ?? "No se pudo cargar los estudiantes registrados."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function markAttendance(codeRaw: string) {
    if (!ENDPOINT) {
      Alert.alert("Config", "Falta EXPO_PUBLIC_API_URL");
      return;
    }

    const listIdNum = Number(id);
    if (!Number.isFinite(listIdNum)) {
      Alert.alert("Error", "ID de lista inválido.");
      return;
    }

    const trimmed = String(codeRaw).trim();
    if (!/^\d+$/.test(trimmed)) {
      Alert.alert("QR inválido", `Debe contener solo números: ${trimmed}`);
      return;
    }
    const code = Number(trimmed);

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);

    try {
      setBusy(true);

      const res = await fetch(`${ENDPOINT}/api/attendances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ attendance_list_id: listIdNum, code }),
        signal: controller.signal,
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 422 && payload?.errors) {
          const firstKey = Object.keys(payload.errors)[0];
          const msg =
            payload.errors[firstKey]?.[0] ??
            payload.message ??
            "Error de validación.";
          throw new Error(msg);
        }
        if (res.status === 409 && payload?.message) {
          throw new Error(payload.message); // p.ej. “Asistencia ya registrada”
        }
        if (payload?.message) throw new Error(payload.message);
        throw new Error(`HTTP ${res.status}`);
      }

      await load();

      // 2) Construye el mensaje bonito con los datos del alumno
      const u = payload?.data?.user;
      const g = payload?.data?.grade;
      const s = g?.section;
      const fullName = [u?.name, u?.father_last_name, u?.mother_last_name]
        .filter(Boolean)
        .join(" ");
      const info =
        `${fullName || "—"}\n` +
        `DNI: ${u?.dni ?? "—"}\n` +
        `Grado: ${g?.name ?? "—"}\n` +
        `Sección: ${s?.name ?? "—"}`;

      setScanOpen(false); // ← oculta la cámara ANTES de alertar
      setEnabled(false); // ← por si acaso, asegúrate de que queda en pausa
      setSuccessInfo(info); // ← disparamos el Alert vía useEffect (ver abajo)
    } catch (e: any) {
      const msg =
        e?.name === "AbortError"
          ? "La solicitud tardó demasiado (timeout)."
          : e?.message?.includes("Network request failed")
          ? "Sin conexión a internet."
          : e?.message ?? "No se pudo registrar la asistencia.";
      Alert.alert("Error", msg);
    } finally {
      clearTimeout(t);
      setBusy(false);
    }
  }

  function handleScan({ data }: { data: string }) {
    if (!enabled || busy) return;
    const now = Date.now();
    if (now - lastScanAtRef.current < SCAN_COOLDOWN_MS) return;
    if (
      data === lastCodeRef.current &&
      now - lastSameCodeAtRef.current < DEDUPE_WINDOW_MS
    )
      return;

    lastScanAtRef.current = now;
    lastCodeRef.current = data;
    lastSameCodeAtRef.current = now;
    setEnabled(false); // ← pausar
    markAttendance(data); // ← se re-habilita en finally
  }

  async function downloadExcel() {
    const listIdNum = Number(id);
    if (!Number.isFinite(listIdNum)) {
      Alert.alert("Error", "ID de lista inválido.");
      return;
    }
    try {
      const url = `${ENDPOINT}/api/attendance-lists/${listIdNum}/export`;
      const can = await Linking.canOpenURL(url);
      if (!can) throw new Error("No se pudo abrir el enlace");
      await Linking.openURL(url);
    } catch (e: any) {
      Alert.alert("Descarga", e?.message ?? "No se pudo iniciar la descarga.");
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (!scanOpen) return;
    if (permission?.granted !== true) requestPermission();
    setEnabled(true);
  }, [scanOpen, permission?.granted]);

  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [id])
  );

  useEffect(() => {
    if (!successInfo) return;
    Alert.alert(
      "Asistencia registrada",
      successInfo,
      [
        {
          text: "OK",
          onPress: () => {
            // reseteos anti-duplicado
            lastCodeRef.current = null;
            lastSameCodeAtRef.current = 0;
            lastScanAtRef.current = 0;

            setSuccessInfo(null); // limpia mensaje
            setEnabled(true); // reanuda lectura
            setScanOpen(true); // ← la cámara SOLO vuelve a aparecer aquí
          },
        },
      ],
      { cancelable: false }
    );
  }, [successInfo]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading) {
    return (
      <SafeAreaView style={s.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  const isResumeState = !enabled && !busy;

  const rightBtnLabel = busy ? "Procesando…" : enabled ? "Pausar" : "Reanudar";
  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 50 }}>
      {/* <View style={{ padding: 16 }}> */}
      <Text
        style={{
          paddingTop: 16,
          fontSize: 20,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <FlatList
        data={items}
        keyExtractor={(it) => it.key}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Text>Aún no hay estudiantes registrados.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{item.fullName}</Text>
              <Text style={s.meta}>DNI: {item.dni || "—"}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>
                  {item.grade} — Sección {item.section || "—"}
                </Text>
                <Text style={s.time}>
                  {new Date(item.datetime).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 6, display: "flex", flexDirection: "column", gap: 8 }}
      />
      {/* FAB izquierdo: escanear QR */}
      <Pressable
        onPress={() => setScanOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Escanear QR"
        style={[s.fabBase, s.fabLeft, { bottom: 16 + insets.bottom }]}
      >
        <Ionicons name="qr-code-outline" size={24} color="#fff" />
      </Pressable>

      {/* FAB derecho: placeholder para el segundo botón (lo definimos luego) */}
      { items.length > 0 && (
      <Pressable
        onPress={() => downloadExcel()}
        accessibilityRole="button"
        accessibilityLabel="Acción secundaria"
        style={[s.fabBase, s.fabRight, { bottom: 16 + insets.bottom }]}
      >
        <Ionicons name="download-outline" size={24} color="#fff" />
      </Pressable>
      )}

      {/* Modal del escáner */}
      <Modal
        visible={scanOpen}
        animationType="slide"
        transparent
        onRequestClose={() => !busy && setScanOpen(false)}
      >
        <View style={s.scanBackdrop}>
          <View style={s.scanCard}>
            <Text style={s.scanTitle}>Escanear DNI (QR)</Text>

            {!permission?.granted ? (
              <View style={s.noPerms}>
                <Text style={{ marginBottom: 8, textAlign: "center" }}>
                  Necesitamos permiso de cámara para escanear.
                </Text>
                <Pressable
                  onPress={requestPermission}
                  style={[s.scanBtn, s.primary]}
                >
                  <Text style={s.btnText}>Permitir cámara</Text>
                </Pressable>
              </View>
            ) : (
              <View style={s.cameraWrap}>
                <CameraView
                  style={StyleSheet.absoluteFillObject}
                  facing="back"
                  barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                  onBarcodeScanned={enabled ? handleScan : undefined}
                />
              </View>
            )}

            <View style={s.scanRow}>
              <Pressable
                style={[s.scanBtn, s.secondary]}
                onPress={() => setScanOpen(false)}
                disabled={busy}
              >
                <Text style={[s.btnText, s.secondaryText]}>Cerrar</Text>
              </Pressable>

              {/* <Pressable
                        style={[s.scanBtn, s.primary, busy && { opacity: 0.7 }]}
                        onPress={() => setEnabled((v) => !v)}
                        disabled={busy}
                    >
                        <Text style={s.btnText}>{enabled ? (busy ? 'Procesando…' : 'Pausar') : 'Reanudar'}</Text>
                    </Pressable> */}

              <Pressable
                style={[
                  s.scanBtn,
                  isResumeState ? s.danger : s.primary, // ← rojo si "Reanudar"
                  busy && { opacity: 0.7 },
                ]}
                onPress={() => setEnabled((v) => !v)}
                disabled={busy}
              >
                <Text style={[s.btnText, isResumeState ? s.dangerText : null]}>
                  {rightBtnLabel}
                </Text>
              </Pressable>
            </View>
          </View>
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { padding: 0, alignItems: "center", marginTop: 16 },
  row: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f8f8f8ff",
    borderRadius: 4,
  },
  name: { fontWeight: "500", fontSize: 16, textTransform: "capitalize" },
  meta: { color: "#4b5563", marginTop: 4 },
  time: { color: "#6b7280", marginTop: 2, fontSize: 12, textAlign: "right" },
  sep: { height: 0 },
  fabBase: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    ...Platform.select({
      android: { elevation: 6 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      default: {},
    }),
  },
  fabLeft: { left: 16 },
  fabRight: { right: 16 },
  scanBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 16,
    justifyContent: "center",
  },
  scanCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  scanTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  cameraWrap: {
    width: "100%",
    aspectRatio: 3 / 4, // alto típico para escanear cómodo
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  scanRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  scanBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  noPerms: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
  },

  btnText: { color: "#fff", fontWeight: "600" },

  secondaryText: { color: "#2563eb", fontWeight: "600" },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2563eb",
  },

  primary: { backgroundColor: "#2563eb" },

  danger: { backgroundColor: "#dc2626" }, // rojo (tailwind red-600)
  dangerText: { color: "#fff" },
});
