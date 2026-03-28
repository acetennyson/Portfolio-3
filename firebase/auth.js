import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./config";

export async function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutAdmin() {
  return signOut(auth);
}
