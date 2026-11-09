import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyArnXf7wRnW1xHA-nX0pWc-ZOxz3gqvQUE",
  authDomain: "bhanu-portfolio-78a90.firebaseapp.com",
  projectId: "bhanu-portfolio-78a90",
  storageBucket: "bhanu-portfolio-78a90.firebasestorage.app",
  messagingSenderId: "330705572196",
  appId: "1:330705572196:web:2fc1d36cdfacec70ccea71",
  measurementId: "G-NK7BR604ZP",

  // Realtime Database
  databaseURL:
    "https://bhanu-portfolio-78a90-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;