// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeUI } from '@firebase-oss/ui-core';
import { FirebaseUIProvider } from '@firebase-oss/ui-react';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJ7jV6fn7QSzAdXqetAzf9sLCW48Rsa94",
  authDomain: "ronetz.firebaseapp.com",
  projectId: "ronetz",
  storageBucket: "ronetz.firebasestorage.app",
  messagingSenderId: "351975478150",
  appId: "1:351975478150:web:f5db87ed0ca46f701c5207",
  measurementId: "G-KKFNZQK6R8"
};

// Initialize Firebase
// Exported so any module needing `getAuth(app)` (see firebaseAuthProvider.ts)
// imports it from here, guaranteeing `initializeApp` has already run —
// ES module evaluation order does that for us regardless of import order.
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
const ui = initializeUI({ app });

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <FirebaseUIProvider ui={ui}>{children}</FirebaseUIProvider>;
}