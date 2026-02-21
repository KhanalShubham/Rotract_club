import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ============================================
// APP USERS (role management)
// ============================================

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

export interface AppUser {
  uid: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt?: Timestamp;
  createdBy?: string; // uid of creator
}

export async function getUserByUid(uid: string): Promise<AppUser | null> {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as AppUser;
}

export async function getUsers(role?: UserRole): Promise<AppUser[]> {
  let q;
  if (role) {
    q = query(collection(db, "users"), where("role", "==", role), orderBy("createdAt", "desc"));
  } else {
    q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ uid: d.id, ...d.data() } as AppUser));
}

export async function createUserRecord(uid: string, data: Omit<AppUser, "uid" | "createdAt">) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function updateUserRecord(uid: string, data: Partial<Omit<AppUser, "uid" | "createdAt">>) {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, data);
}

export async function deleteUserRecord(uid: string) {
  await deleteDoc(doc(db, "users", uid));
}

export async function superAdminExists(): Promise<boolean> {
  const q = query(collection(db, "users"), where("role", "==", "SUPER_ADMIN"));
  const snap = await getDocs(q);
  return !snap.empty;
}

// ============================================
// PROJECTS
// ============================================

export interface Project {
  id?: string;
  title: string;
  category: string;
  image: string;
  year: string;
  summary: string;
  createdAt?: Timestamp;
}

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Project));
}

export async function addProject(project: Omit<Project, "id" | "createdAt">) {
  return await addDoc(collection(db, "projects"), {
    ...project,
    createdAt: Timestamp.now(),
  });
}

export async function updateProject(id: string, project: Partial<Project>) {
  const docRef = doc(db, "projects", id);
  await updateDoc(docRef, project);
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, "projects", id));
}

// ============================================
// EVENTS
// ============================================

export interface Event {
  id?: string;
  title: string;
  date: string;
  image: string;
  location: string;
  description: string;
  createdAt?: Timestamp;
}

export async function getEvents(): Promise<Event[]> {
  const q = query(collection(db, "events"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event));
}

export async function addEvent(event: Omit<Event, "id" | "createdAt">) {
  return await addDoc(collection(db, "events"), {
    ...event,
    createdAt: Timestamp.now(),
  });
}

export async function updateEvent(id: string, event: Partial<Event>) {
  const docRef = doc(db, "events", id);
  await updateDoc(docRef, event);
}

export async function deleteEvent(id: string) {
  await deleteDoc(doc(db, "events", id));
}

// ============================================
// TESTIMONIALS
// ============================================

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  createdAt?: Timestamp;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Testimonial));
}

export async function addTestimonial(testimonial: Omit<Testimonial, "id" | "createdAt">) {
  return await addDoc(collection(db, "testimonials"), {
    ...testimonial,
    createdAt: Timestamp.now(),
  });
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>) {
  const docRef = doc(db, "testimonials", id);
  await updateDoc(docRef, testimonial);
}

export async function deleteTestimonial(id: string) {
  await deleteDoc(doc(db, "testimonials", id));
}

// ============================================
// BLOG POSTS
// ============================================

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt?: Timestamp;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BlogPost));
}

export async function addBlogPost(post: Omit<BlogPost, "id" | "createdAt">) {
  return await addDoc(collection(db, "blogPosts"), {
    ...post,
    createdAt: Timestamp.now(),
  });
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const docRef = doc(db, "blogPosts", id);
  await updateDoc(docRef, post);
}

export async function deleteBlogPost(id: string) {
  await deleteDoc(doc(db, "blogPosts", id));
}

// ============================================
// GALLERY IMAGES
// ============================================

export interface GalleryImage {
  id?: string;
  url: string;
  caption: string;
  category: string;
  createdAt?: Timestamp;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GalleryImage));
}

export async function addGalleryImage(image: Omit<GalleryImage, "id" | "createdAt">) {
  return await addDoc(collection(db, "gallery"), {
    ...image,
    createdAt: Timestamp.now(),
  });
}

export async function updateGalleryImage(id: string, image: Partial<GalleryImage>) {
  const docRef = doc(db, "gallery", id);
  await updateDoc(docRef, image);
}

export async function deleteGalleryImage(id: string) {
  await deleteDoc(doc(db, "gallery", id));
}

// ============================================
// SITE SETTINGS (Leadership & About Us)
// ============================================

export interface SiteSettings {
  id?: string;
  presidentName: string;
  presidentImage: string;
  presidentTitle: string;
  presidentBio?: string;
  presidentFacebook?: string;
  presidentEmail?: string;
  vicePresidentName: string;
  vicePresidentImage: string;
  vicePresidentTitle: string;
  vicePresidentBio?: string;
  vicePresidentFacebook?: string;
  vicePresidentEmail?: string;
  aboutUsTitle: string;
  aboutUsContent: string;
  updatedAt?: Timestamp;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const snapshot = await getDocs(collection(db, "siteSettings"));
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as SiteSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
  const snapshot = await getDocs(collection(db, "siteSettings"));
  
  if (snapshot.empty) {
    // Create new settings document
    await addDoc(collection(db, "siteSettings"), {
      ...settings,
      updatedAt: Timestamp.now(),
    });
  } else {
    // Update existing settings
    const docRef = doc(db, "siteSettings", snapshot.docs[0].id);
    await updateDoc(docRef, {
      ...settings,
      updatedAt: Timestamp.now(),
    });
  }
}

