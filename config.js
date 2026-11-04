// config.js
// Menyimpan konfigurasi Firebase dan menginisialisasinya
import firebase from 'firebase/compat/app';
// Import modul Firestore (database) untuk compat
import 'firebase/compat/firestore';

// Konfigurasi proyek Firebase.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxGRAEb3Eke-xUTlWrr09yvFuoERI8eHo",
  authDomain: "todosapp-40d2b.firebaseapp.com",
  projectId: "todosapp-40d2b",
  storageBucket: "todosapp-40d2b.firebasestorage.app",
  messagingSenderId: "535609259615",
  appId: "1:535609259615:web:76490231dbc7a847d68dea",
  measurementId: "G-RXB7YC772Y"
};
// Inisialisasi Firebase hanya jika belum pernah diinisialisasi,
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Ekspor firebase agar bisa dipakai di Home.js dan Detail.js
export { firebase };