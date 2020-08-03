import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyByuJfnEf-kz7wFTelKfJjKfmrXAeWM7Ug",
  authDomain: "sample-app-react-c94a3.firebaseapp.com",
  databaseURL: "https://sample-app-react-c94a3.firebaseio.com",
  projectId: "sample-app-react-c94a3",
  storageBucket: "sample-app-react-c94a3.appspot.com",
  messagingSenderId: "569938170644",
  appId: "1:569938170644:web:da245f4bcbe72be7802801",
  measurementId: "G-6D1LDS86K0"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export { db, auth, storage };