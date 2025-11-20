import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDXS5R9OqedKQE5u_0v8o8pGzW9m-OGALc",
  authDomain: "blogspot-72ccb.firebaseapp.com",
  projectId: "blogspot-72ccb",
  storageBucket: "blogspot-72ccb.firebasestorage.app",
  messagingSenderId: "842549369855",
  appId: "1:842549369855:web:6a0e581f63d4824526a5ca",
  measurementId: "G-057FRFRZXQ",
  databaseURL: "https://blogspot-72ccb-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);