import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Asset } from "../types";

/**
 * Fetch all assets owned by the currently authenticated user UID
 */
export async function fetchUserAssets(): Promise<Asset[]> {
  const currentUser = auth.currentUser;
  if (!currentUser) return [];

  try {
    // 1. Query root /assets collection matching userId == uid
    const qRoot = query(
      collection(db, "assets"), 
      where("userId", "==", currentUser.uid)
    );

    const rootSnap = await getDocs(qRoot);
    const rootAssets: Asset[] = rootSnap.docs.map(docSnap => ({ 
      id: docSnap.id, 
      ...(docSnap.data() as Omit<Asset, 'id'>) 
    }));

    // 2. Query nested /users/{uid}/assets subcollection
    const userSubSnap = await getDocs(collection(db, "users", currentUser.uid, "assets"));
    const subAssets: Asset[] = userSubSnap.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Asset, 'id'>)
    }));

    // Deduplicate merged assets by ID
    const assetMap = new Map<string, Asset>();
    [...rootAssets, ...subAssets].forEach((a) => assetMap.set(a.id, a));

    return Array.from(assetMap.values());
  } catch (err) {
    console.error("Firestore fetchUserAssets Error:", err);
    return [];
  }
}

/**
 * Save a new asset associated with current user UID
 */
export async function saveUserAsset(assetData: Omit<Asset, 'id'>): Promise<string | null> {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    const payload = {
      ...assetData,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save to root /assets collection
    const docRef = await addDoc(collection(db, "assets"), payload);

    // Save to nested /users/{uid}/assets subcollection
    addDoc(collection(db, "users", currentUser.uid, "assets"), payload).catch(console.warn);

    return docRef.id;
  } catch (err) {
    console.error("Firestore saveUserAsset Error:", err);
    return null;
  }
}

/**
 * Delete an asset document from Firestore
 */
export async function deleteUserAsset(assetId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "assets", assetId));
    return true;
  } catch (err) {
    console.error("Firestore deleteUserAsset Error:", err);
    return false;
  }
}

export default {
  fetchUserAssets,
  saveUserAsset,
  deleteUserAsset,
};
