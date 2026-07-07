import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";

export async function getSeenTimestamp(messageId) {
  const ref = doc(db, "seenMessages", messageId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().ts : null;
}

export async function markSeen(messageId, ts) {
  const ref = doc(db, "seenMessages", messageId);
  await setDoc(ref, { ts }, { merge: true });
}
