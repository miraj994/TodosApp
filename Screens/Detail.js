// ============================================================
// Screens/Detail.js
// Layar edit: mengubah teks todo lalu menyimpannya ke Firestore
// ============================================================

import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
// Import koneksi Firebase dari config.js
import { firebase } from '../config';
// Hook untuk berpindah layar
import { useNavigation } from '@react-navigation/native';

// "route" berisi data kiriman dari layar Home (route.params.item)
const Detail = ({ route }) => {
  // Referensi ke collection "todos" di Firestore
  const todoRef = firebase.firestore().collection('todos');

  // State teks todo; nilai awalnya diambil dari data kiriman Home
  const [textHeading, onChangeHeadingText] = useState(
    route.params.item.heading
  );

  const navigation = useNavigation();

  // ----------------------------------------------------------
  // UPDATE: menyimpan perubahan teks todo ke Firestore
  // ----------------------------------------------------------
  const updateTodo = () => {
    // Hanya jalan jika teks tidak kosong
    if (textHeading && textHeading.length > 0) {
      todoRef
        .doc(route.params.item.id) // pilih dokumen berdasarkan id
        .update({
          heading: textHeading,    // ubah field heading
        })
        .then(() => {
          // Setelah berhasil, kembali ke layar Home
          navigation.navigate('Home');
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
    <View style={styles.container}>
      {/* Kolom input berisi teks todo yang bisa diedit */}
      <TextInput
        style={styles.textfield}
        onChangeText={onChangeHeadingText}
        value={textHeading}
        placeholder="Update Todo"
      />

      {/* Tombol untuk menyimpan perubahan */}
      <TouchableOpacity
        style={styles.buttonUpdate}
        onPress={() => {
          updateTodo();
        }}
      >
        <Text>UPDATE</Text>
      </TouchableOpacity>
    </View>
  );
};

// ------------------------------------------------------------
// STYLING
// ------------------------------------------------------------
const styles = StyleSheet.create({
  // Wadah utama layar
  container: {
    marginTop: 80,
    marginLeft: 15,
    marginRight: 15,
  },
  // Kolom input
  textfield: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  // Tombol UPDATE
  buttonUpdate: {
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: '#0de065',
  },
});

export default Detail;