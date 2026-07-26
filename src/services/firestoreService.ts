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
    const q = query(
      collection(db, "assets"), 
      where("userId", "==", currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    const assets: Asset[] = querySnapshot.docs.map(docSnap => ({ 
      id: docSnap.id, 
      ...(docSnap.data() as Omit<Asset, 'id'>) 
    }));
    
    return assets;
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
    const docRef = await addDoc(collection(db, "assets"), {
      ...assetData,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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
