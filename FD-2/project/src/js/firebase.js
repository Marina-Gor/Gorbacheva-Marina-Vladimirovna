import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: "AIzaSyAWYD3cjmiGJfMW6U4qVEyzV-f2L2Bsdew",
	authDomain: "zuma-ca665.firebaseapp.com",
	projectId: "zuma-ca665",
	storageBucket: "zuma-ca665.appspot.com",
	messagingSenderId: "199514844710",
	appId: "1:199514844710:web:42a7fdb906f18aa7f540e7",
	measurementId: "G-5SQ2FBYWYR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const database = getDatabase(app);

export { app, analytics, auth, database }