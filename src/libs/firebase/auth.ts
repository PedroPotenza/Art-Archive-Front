import {
  type User,
  onAuthStateChanged as _onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import axiosInstance from "../axios/axios";
import { firebaseAuth } from "./config";

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return _onAuthStateChanged(firebaseAuth, callback);
}

export async function signUpEmailAndPassword(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(firebaseAuth, email, password).catch((error) => {
    console.log("Error signing up", error);
  });

  if (!result || !result.user) {
    throw new Error("Sign up failed");
  }

  return result.user.uid;
}

export async function signInEmailAndPassword(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password).catch((error) => {
      console.log("Error signing up", error);
    });

    const token = await result?.user.getIdToken();

    const response = await axiosInstance.post("/api/login", {
      token
    });

    return response.data.uid; // Você ainda precisa de um idToken para retornar o UID no backend
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Error signing in");
    }
  }
}

export async function signInGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(firebaseAuth, provider);

    if (!result || !result.user) {
      throw new Error("Google sign in failed");
    }
    return result.user.uid;
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    await firebaseAuth.signOut();
  } catch (error) {
    console.error("Error signing out", error);
  }
}
