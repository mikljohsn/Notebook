// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQkRYiizIPhNsumS-h06FnxBgbic6fLXI",
  authDomain: "reactnative-5fff6.firebaseapp.com",
  projectId: "reactnative-5fff6",
  storageBucket: "reactnative-5fff6.appspot.com",
  messagingSenderId: "282781583850",
  appId: "1:282781583850:web:8bfce0e02931a689498a93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app); // Get a reference to the database service
const storage = getStorage(app); // Get a reference to the storage service

export {app, database, storage}