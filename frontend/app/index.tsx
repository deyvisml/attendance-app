import { useRouter } from "expo-router";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
// import bgImage from "../assets/images/bg.jpg"; // ajusta la ruta según dónde esté tu archivo
// import bgImage from "../assets/background/images/mariategui.jpeg"; // ajusta la ruta según dónde esté tu archivo
import bgImage from "../assets/background/mariategui.jpeg";

export default function FirstScreen() {
  const router = useRouter();
  const background = { uri: "https://wpengine.com/wp-content/uploads/2021/05/optimize-images-768x511.jpg" };
  return (
    // <ImageBackground source={background} style={styles.container}>
    <ImageBackground source={bgImage} style={styles.container} blurRadius={12} >
    <View style={styles.overlay}></View>
      <Text style={styles.title}>Menú Principal</Text>
      
      <Pressable style={styles.button} onPress={() => router.navigate('/students/new')}>
        <Text style={styles.buttonText}>Registrar Estudiante</Text>
      </Pressable>

      {/* <Pressable style={styles.button} onPress={() => router.navigate('/students')}>
        <Text style={styles.buttonText}>Ver estudiantes</Text>
      </Pressable> */}

      {/* <Pressable style={styles.button} onPress={() => router.navigate('/attendance/new')}>
        <Text style={styles.buttonText}>Crear lista de asistencia</Text>
      </Pressable> */}

      <Pressable style={styles.button} onPress={() => router.navigate('/attendance')}>
        <Text style={styles.buttonText}>Ver Listas de Asistencias</Text>
      </Pressable>
    
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // oscurece la imagen para mejor contraste
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    // marginBottom: 30,
    color: "#fff",
  },
  button: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    // marginVertical: 8,

    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#222",
    fontSize: 16,
    fontWeight: "600",
  },
});
