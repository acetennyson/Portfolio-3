import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, serverTimestamp, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config";

// --- BLOGS ---
export async function getBlogs() {
  try {
    const blogsCol = collection(db, "blogs");
    const q = query(blogsCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
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
