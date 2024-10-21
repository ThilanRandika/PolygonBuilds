// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZm7St5QwkOWU1GhVfnvxd9LCBARaHVI8",
  authDomain: "polygonbuilds-2cfef.firebaseapp.com",
  projectId: "polygonbuilds-2cfef",
  storageBucket: "polygonbuilds-2cfef.appspot.com",
  messagingSenderId: "874346725908",
  appId: "1:874346725908:web:90fdc68259e5b999555d01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Storage
export const storage = getStorage(app);