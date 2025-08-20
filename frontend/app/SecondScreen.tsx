import { useRouter } from "expo-router"
import { Button, ScrollView, Text } from "react-native"
export default function SecondScreen(){
    const router = useRouter()
    return(
        <ScrollView>
            <Text>Second screen</Text>
            <Button title="go to the second screen" onPress={()=>{router.back()}}>
                
            </Button>
        </ScrollView>
    )
}