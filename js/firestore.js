// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { 
    getFirestore,
    collection, 
    addDoc,
    getDocs,
    deleteDoc,
    onSnapshot,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcYCq0BsO2-HUYI6JmTlHoYNr6TD85Sgk",
  authDomain: "fir-javascript-crud-db5a0.firebaseapp.com",
  projectId: "fir-javascript-crud-db5a0",
  storageBucket: "fir-javascript-crud-db5a0.appspot.com",
  messagingSenderId: "258792838383",
  appId: "1:258792838383:web:7affa518213febfcd3371a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export async function saveTask(codigo, fecha, description, estado ) {
    const dbRef =await addDoc(collection(db,"tasks"),{codigo, fecha, description, estado});
    return dbRef.id;
}

export const getTasks = () => getDocs(collection(db,"tasks"));

export const onGetTasks = (callback)=> onSnapshot(collection(db,"tasks"), callback);

export const deleteTask = id => deleteDoc(doc(db,"tasks", id));

export const getTask = id => getDoc(doc(db,"tasks",id));

export async function updateTask (id, newFields) {
  await updateDoc(doc(db,"tasks",id), newFields);
}