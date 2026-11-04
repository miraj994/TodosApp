// ============================================================
// App.js
// File utama: mengatur navigasi antar layar (Home dan Detail)
// ============================================================

// Wajib berada di baris paling atas agar navigasi Stack berjalan benar
import 'react-native-gesture-handler';

// NavigationContainer membungkus seluruh sistem navigasi aplikasi
import { NavigationContainer } from '@react-navigation/native';
// createStackNavigator membuat navigasi bertumpuk (layar baru muncul di atas layar lama)
import { createStackNavigator } from '@react-navigation/stack';

// Import dua layar yang akan kita buat
import Home from './Screens/Home';
import Detail from './Screens/Detail';

// Membuat objek Stack yang berisi Navigator dan Screen
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* headerShown: false menyembunyikan judul bawaan di bagian atas layar */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Layar pertama: daftar todo (Home) */}
        <Stack.Screen name="Home" component={Home} />
        {/* Layar kedua: edit todo (Detail) */}
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}