import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDM3sLypxh2aUnjdTT-DjrW3H78n4hjya4",
    authDomain: "predictor-433701.firebaseapp.com",
    projectId: "predictor-433701",
    storageBucket: "predictor-433701.appspot.com",
    messagingSenderId: "582727292554",
    appId: "1:582727292554:web:c22f08505c5544b505ff73"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function getFirebaseToken() {
    try {
        // Replace with valid email and password from your Firebase project
        const userCredential = await signInWithEmailAndPassword(auth, "usuario@ejemplo.com", "contraseña123");
        const user = userCredential.user;
        const token = await user.getIdToken();
        console.log(JSON.stringify({ token: token }));
    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
    }
}

getFirebaseToken();