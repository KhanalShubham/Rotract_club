import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpSeqpjdUknkOVKtsDFTFOe310A9rgwbQ",
  authDomain: "rotract-club.firebaseapp.com",
  projectId: "rotract-club",
  storageBucket: "rotract-club.firebasestorage.app",
  messagingSenderId: "629779195507",
  appId: "1:629779195507:web:614560519b0f610c75ac06",
  measurementId: "G-QX57W0MYPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
