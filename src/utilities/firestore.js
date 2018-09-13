import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp(
  process.env.NODE_ENV === "production"
    ? {
        apiKey: process.env.REACT_APP_PRODUCTION_API_KEY,
        authDomain: process.env.REACT_APP_PRODUCTION_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PRODUCTION_PROJECT_ID,
      }
    : {
        apiKey: process.env.REACT_APP_DEVELOPMENT_API_KEY,
        authDomain: process.env.REACT_APP_DEVELOPMENT_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_DEVELOPMENT_PROJECT_ID,
      }
);

const firestore = firebase.firestore();
firestore.enablePersistence();

export default firestore;
