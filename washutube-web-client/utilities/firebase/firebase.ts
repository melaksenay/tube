// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    User
 } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAU4Pg0ZgebOP78Huhe8ugT7DGlUjmWfM",
  authDomain: "washu-vid-service.firebaseapp.com",
  projectId: "washu-vid-service",
//   storageBucket: "washu-vid-service.appspot.com", Made my own Bucket
//   messagingSenderId: "980501957180",     Made my own Pub/Sub
  appId: "1:980501957180:web:87d4dc02e82900a8171139",
  measurementId: "G-EHBJSTCHTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

/**
 * Signs in the user with a Google Popup
 * @returns a promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the current user out
 * @returns a promise that resolves when the user is signed out
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when the user's authentication state changes
 * @returns a function that unsubs the callback
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}