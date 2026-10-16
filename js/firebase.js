
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAxKrtqZ-E2FHiZI-zV0K4aW-50IneOFJ4",
    authDomain: "caltrack-adb58.firebaseapp.com",
    projectId: "caltrack-adb58",
    storageBucket: "caltrack-adb58.firebasestorage.app",
    messagingSenderId: "227554236666",
    appId: "1:227554236666:web:d3b2f2b2f6bb3833971143"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

