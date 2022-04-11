// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCEMIkVVlFCCFmR4Y54MmpPHT2KqVW6JE",
  authDomain: "chatitall.firebaseapp.com",
  projectId: "chatitall",
  storageBucket: "chatitall.appspot.com",
  messagingSenderId: "818792091751",
  appId: "1:818792091751:web:d8bf3705edc543e30584c2"
};

// Initialize Firebase
const db = initializeApp(firebaseConfig);
export default db;