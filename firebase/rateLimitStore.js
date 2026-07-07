import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";

/**
 * Reads the last-known bucket state for a phone number.
 * A fresh, full bucket is returned when none exists yet.
 */
export async function getBucketState(phone, capacity) {
  const ref = doc(db, "rateLimits", phone);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return { tokens: capacity, lastRefill: Date.now() };
  }
  const data = snap.data();
  return { tokens: data.tokens, lastRefill: data.lastRefill };
}

export async function saveBucketState(phone, state) {
  const ref = doc(db, "rateLimits", phone);
  await setDoc(ref, { phone, ...state }, { merge: true });
}
