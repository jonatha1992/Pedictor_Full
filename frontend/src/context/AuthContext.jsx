import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => signOut(auth);

  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);

  const getUserToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(/* forceRefresh */ true);
    }
    throw new Error("No authenticated user found");
  };

  // Configurar interceptor para siempre incluir el token en las solicitudes
  useEffect(() => {
    const setupAxiosInterceptor = async () => {
      axios.interceptors.request.use(
        async (config) => {
          if (auth.currentUser) {
            const token = await auth.currentUser.getIdToken();
            config.headers["Authorization"] = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptor();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log({ currentUser });
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        logout,
        loading,
        loginWithGoogle,
        resetPassword,
        onAuthStateChanged,
        getUserToken,
        isAuthenticated,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
