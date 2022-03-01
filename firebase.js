// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtI7MykYZqxpA0Vl-THQyEpxKPBKf-coY",
    authDomain: "crypto-tracker-7e52c.firebaseapp.com",
    projectId: "crypto-tracker-7e52c",
    storageBucket: "crypto-tracker-7e52c.appspot.com",
    messagingSenderId: "636777792792",
    appId: "1:636777792792:web:be73f6ce96cafef4c48a6d"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const auth = firebase.auth()

export { auth }
