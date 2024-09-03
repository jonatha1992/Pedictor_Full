// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM3sLypxh2aUnjdTT-DjrW3H78n4hjya4",
  authDomain: "predictor-433701.firebaseapp.com",
  projectId: "predictor-433701",
  storageBucket: "predictor-433701.appspot.com",
  messagingSenderId: "582727292554",
  appId: "1:582727292554:web:c22f08505c5544b505ff73",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Exportación por defecto
export default app;

// Exportación adicional si la necesitas en otros lugares
export { auth };
