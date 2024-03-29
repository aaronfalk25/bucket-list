import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import * as config from 'config.json';
const firebaseConfig = config.firebaseConfig

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


// Generic write to firestore
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
const db = getFirestore(app);
export async function writeToCloudFireStore(collection_name: string, contents: any, doc_id: string = uuidv4()) {
    try {
        const docRef = doc(collection(db, collection_name), doc_id);
        await setDoc(docRef, contents);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Generic update id in firestore that may or may not exist
import { updateDoc } from "firebase/firestore";
export async function updateIdInCloudFireStore(collection_name: string, contents: any, doc_id: string) {
    try {
        const docRef = doc(collection(db, collection_name), doc_id);
        await updateDoc(docRef, contents);
    } catch (e) {
        console.error("Error updating document: ", e);
    }
}

// Generic read entire collection
import { getDocs } from "firebase/firestore";
import { Collection as _Collection, Document } from "src/interfaces/firestore";
export async function readFromCloudFireStore(collection_name: string): Promise<_Collection> {
    const querySnapshot = await getDocs(collection(db, collection_name));

    // Create a colleciton that will be returned that holds every document
    const resCollection: _Collection = {
        name: collection_name,
        documents: []
    }

    // Loop through each document and add it to the collection
    querySnapshot.forEach((doc) => {
        const document: Document = {
            id: doc.id,
            ...doc.data() 
        }
        resCollection.documents.push(document);
    });

    console.log(resCollection)
    return resCollection;
}

// Delete document from firestore
import { deleteDoc } from "firebase/firestore";
export async function deleteFromCloudFireStore(collection_name: string, doc_id: string) {
    try {
        await deleteDoc(doc(db, collection_name, doc_id));
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}