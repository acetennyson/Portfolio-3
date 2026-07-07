import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, serverTimestamp, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config";

// --- BLOGS ---
const BLOG_AUTHOR_ID = "pnH2DUGqpMSecIihxqWfSv8kbDV2";

export async function getBlogs() {
  try {
    const blogsCol = collection(db, "blogs");
    const q = query(blogsCol, where("authorId", "==", BLOG_AUTHOR_ID), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    // fallback: fetch all and filter in-memory
    try {
      const blogsCol = collection(db, "blogs");
      const q = query(blogsCol, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(b => b.authorId === BLOG_AUTHOR_ID);
    } catch {
      return [];
    }
  }
}

export async function getBlogBySlug(slug) {
  try {
    const blogsCol = collection(db, "blogs");
    const q = query(blogsCol, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return null;
  }
}

export async function createBlog(data) {
  const blogsCol = collection(db, "blogs");
  return addDoc(blogsCol, {
    ...data,
    createdAt: serverTimestamp()
  });
}

// --- PROJECTS ---
/** @param {string | null} [status] */
export async function getProjects(status = null) {
  try {
    const projectsCol = collection(db, "projects");
    let q = query(projectsCol);
    if (status) {
      q = query(projectsCol, where("status", "==", status));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function addProject(data) {
  const projectsCol = collection(db, "projects");
  return addDoc(projectsCol, data);
}

// --- MESSAGES ---
export async function addMessage(data) {
  const messagesCol = collection(db, "messages");
  return addDoc(messagesCol, {
    ...data,
    createdAt: serverTimestamp()
  });
}

// --- CHAT HISTORY (patrolChat) ---
const MAX_HISTORY = 20;

export async function getChatHistory(phone) {
  try {
    const ref = doc(db, "patrolChat", phone);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().messages || [] : [];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

export async function appendChatMessages(phone, userMsg, botMsg) {
  try {
    const ref = doc(db, "patrolChat", phone);
    const snap = await getDoc(ref);
    const existing = snap.exists() ? snap.data().messages || [] : [];

    const updated = [
      ...existing,
      { role: "user", content: userMsg, ts: Date.now() },
      { role: "assistant", content: botMsg, ts: Date.now() },
    ].slice(-MAX_HISTORY);

    await setDoc(ref, { phone, messages: updated }, { merge: true });
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}
