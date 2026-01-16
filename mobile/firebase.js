import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAN5JK628wb2Fy2ZAiENU_2nKsKhz0huvk",
  authDomain: "essai-36122.firebaseapp.com",
  projectId: "essai-36122",
  storageBucket: "essai-36122.firebasestorage.app",
  messagingSenderId: "776979023685",
  appId: "1:776979023685:web:1a175acb12195552c3202c",
  measurementId: "G-4J9JHMJV1K"
};
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
export { firebase };
