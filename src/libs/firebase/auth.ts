import {
  type User,
  onAuthStateChanged as _onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

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
  const result = await signInWithEmailAndPassword(firebaseAuth, email, password).catch((error) => {
    console.log("Error signing in", error);
  });

  if (!result || !result.user) {
    throw new Error("Sign in failed");
  }

  return result.user.uid;
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
