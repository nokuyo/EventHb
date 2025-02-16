// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkgcROZtI_8JjKUh1k6IodiWV3LRVWa2w",
  authDomain: "hackathon2025-a31e3.firebaseapp.com",
  projectId: "hackathon2025-a31e3",
  storageBucket: "hackathon2025-a31e3.firebasestorage.app",
  messagingSenderId: "393826157235",
  appId: "1:393826157235:web:9624d43051ab8edb6b26c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider};
export default app;