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
const db = getFirestore(app);
/* Agregar nuevo Documento*/
export async function  saveTask(codigo, fecha, description, estado ){
      console.log("Antes de addDoc");
      const refId = await addDoc(collection(db,"tasks"),{codigo, fecha, description, estado}).then(console.log("Exito saveTask"));
      console.log("refId:" + refId.id);
      return refId.id; 
}
// saveTask(codigo, fecha, description, estado).then(function (mensaje){
//   console.log(mensaje);
// }).catch(function (error){
//   console.log(error);
// }
// )

/* Obtener Documentos*/
export const getTasks = () => getDocs(collection(db,"tasks"),orderBy("description"),);

/* Obtener SnapShot*/
export const onGetTasks = (callback)=> onSnapshot(collection(db,"tasks"), callback);

/* Eliminar Documento*/
export const deleteTask = id => deleteDoc(doc(db,"tasks", id));

/* Obtener 1 Documento*/
export const getTask = id => getDoc(doc(db,"tasks",id));

/* Actualizar Documento*/
export async function updateTask (id, newFields) {
  try {
    await updateDoc(doc(db,"tasks",id), newFields);
    console.log("Document actualizado con ID: ", id);
  } catch (error) {
    console.log("Error actualizando Documento: ", error);
  }
}