const firebase = require('firebase/app');
require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyDM3sLypxh2aUnjdTT-DjrW3H78n4hjya4",
    authDomain: "predictor-433701.firebaseapp.com",
    projectId: "predictor-433701",
    storageBucket: "predictor-433701.appspot.com",
    messagingSenderId: "582727292554",
    appId: "1:582727292554:web:c22f08505c5544b505ff73"
  };
firebase.initializeApp(firebaseConfig);

async function getFirebaseToken() {
  try {
    // Esto creará un nuevo usuario cada vez. 
    // Para pruebas repetidas, podrías querer usar signInWithEmailAndPassword en su lugar.
    const userCredential = await firebase.auth().createUserWithEmailAndPassword('test@example.com', 'password123');
    const token = await userCredential.user.getIdToken();
    console.log('Firebase Token:', token);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    firebase.app().delete(); // Limpieza
  }
}

getFirebaseToken();