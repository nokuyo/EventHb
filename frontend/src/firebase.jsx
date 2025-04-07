// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1m2fnPK3GgyLpkMQJYpQUGPGzXaGjSSg",
  authDomain: "eventhub-be80d.firebaseapp.com",
  projectId: "eventhub-be80d",
  storageBucket: "eventhub-be80d.firebasestorage.app",
  messagingSenderId: "346619814388",
  appId: "1:346619814388:web:b456cde60c0e938d0c99a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth, provider};
export default app;