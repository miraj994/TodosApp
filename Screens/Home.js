// ============================================================
// Screens/Home.js
// Layar utama: menampilkan daftar todo, menambah, dan menghapus
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
// Import koneksi Firebase dari config.js
import { firebase } from '../config';
// Ikon tempat sampah
import { FontAwesome } from '@expo/vector-icons';
// Hook untuk berpindah layar
import { useNavigation } from '@react-navigation/native';
// SafeAreaView agar tampilan tidak tertutup status bar / notch
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  // STATE
  // todos   : daftar todo yang diambil dari Firestore
  // addData : teks yang sedang diketik di kolom input
  const [todos, setTodos] = useState([]);
  const [addData, setAddData] = useState('');

  // Referensi ke collection "todos" di Firestore
  const todoRef = firebase.firestore().collection('todos');
  // Objek untuk berpindah layar
  const navigation = useNavigation();

  // ----------------------------------------------------------
  // READ: mengambil data dari Firestore secara realtime
  // ----------------------------------------------------------
  useEffect(() => {
    // onSnapshot dipanggil setiap kali data di Firestore berubah.
    // orderBy('createdAt', 'desc') -> todo terbaru tampil paling atas
    const unsubscribe = todoRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          const newTodos = [];
          // Loop setiap dokumen hasil query
          querySnapshot.forEach((doc) => {
            // Ambil field "heading" dari dokumen
            const { heading } = doc.data();
            // Simpan id dokumen + heading ke array
            newTodos.push({
              id: doc.id,
              heading,
            });
          });
          // Perbarui state agar daftar di layar ikut berubah
          setTodos(newTodos);
        },
        (error) => {
          // Tampilkan pesan jika gagal membaca data
          alert(error.message);
        }
      );

    // Cleanup: berhenti mendengarkan data saat layar ditutup
    return () => unsubscribe();
  }, []);

  // ----------------------------------------------------------
  // DELETE: menghapus todo dari Firestore
  // ----------------------------------------------------------
  const deleteTodo = (todo) => {
    todoRef
      .doc(todo.id) // pilih dokumen berdasarkan id
      .delete()
      .then(() => {
        alert('Deleted successfully');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // ----------------------------------------------------------
  // CREATE: menambah todo baru ke Firestore
  // ----------------------------------------------------------
  const addTodo = () => {
    // Hanya jalan jika kolom input tidak kosong
    if (addData && addData.length > 0) {
      // Waktu dari server, dipakai untuk mengurutkan todo
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: addData,
        createdAt: timestamp,
      };

      todoRef
        .add(data) // tambahkan dokumen baru
        .then(() => {
          setAddData('');    // kosongkan kolom input
          Keyboard.dismiss(); // tutup keyboard
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  // ----------------------------------------------------------
  // TAMPILAN (UI)
  // ----------------------------------------------------------
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Judul aplikasi */}
      <View style={styles.textHeadingContainer}>
        <Text style={styles.textHeading}>Todos App</Text>
      </View>

      {/* Form tambah todo: kolom input + tombol Add */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo"
          placeholderTextColor="#aaaaaa"
          onChangeText={(heading) => setAddData(heading)}
          value={addData}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Daftar todo */}
      <FlatList
        data={todos}
        numColumns={1}
        keyExtractor={(item) => item.id} // id unik tiap item
        renderItem={({ item }) => (
          <View>
            {/* Menekan item membuka layar Detail untuk mengedit */}
            <TouchableOpacity
              style={styles.container}
              onPress={() => navigation.navigate('Detail', { item })}
            >
              {/* Ikon tempat sampah: menekannya menghapus todo */}
              <FontAwesome
                name="trash-o"
                color="red"
                onPress={() => deleteTodo(item)}
                style={styles.todoIcon}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>{item.heading}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

// ------------------------------------------------------------
// STYLING
// ------------------------------------------------------------
const styles = StyleSheet.create({
  // Kotak untuk satu item todo
  container: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Wadah judul
  textHeadingContainer: {
    paddingVertical: 20,
    alignContent: 'center',
    alignItems: 'center',
  },
  // Teks judul
  textHeading: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  // Wadah teks todo
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: 45,
  },
  // Teks todo
  itemHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 22,
  },
  // Wadah form (input + tombol Add)
  formContainer: {
    flexDirection: 'row',
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 40,
  },
  // Kolom input
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  // Tombol Add
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Teks tombol Add
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  // Ikon tempat sampah
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 14,
  },
});

export default Home;