import { initializeApp } from "firebase/app";

const firebaseConfig = {
  //   apiKey: import.meta.VITE_FIREBASE_KEY,
  apiKey: "AIzaSyBxX33N5jZ-F-E4acUxA4xQNY2mVD29_tk",
  authDomain: "estateapp-b5e69.firebaseapp.com",
  projectId: "estateapp-b5e69",
  storageBucket: "estateapp-b5e69.appspot.com",
  messagingSenderId: "143482308234",
  appId: "1:143482308234:web:96eca819fb49c019f8cf73",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
