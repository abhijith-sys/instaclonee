import firebase from "firebase";

const firebaseApp = firebase.initializeApp({

  apiKey: "AIzaSyA4ZH4P-vxZbKc2Z4kbda38mEi55J-lTns",
  authDomain: "instamyran.firebaseapp.com",
  databaseURL: "https://instamyran-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "instamyran",
  storageBucket: "instamyran.appspot.com",
  messagingSenderId: "657405020203",
  appId: "1:657405020203:web:3fa502a2bb0a499985c26e"
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
