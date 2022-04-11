// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  //firebase config here
};

// Initialize Firebase
const db = initializeApp(firebaseConfig);
export default db;
