import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";

// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// const uiConfig = {
//   signInSuccessUrl: window.location,
//   signInOptions: [
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//     firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     firebase.auth.GithubAuthProvider.PROVIDER_ID,
//     firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     firebase.auth.PhoneAuthProvider.PROVIDER_ID,
//     firebase.auth.AnonymousAuthProvider.PROVIDER_ID,
//   ],
//   tosUrl: "https://github.com/jonikorpi/kausi/blob/master/TERMS_OF_SERVICE.md",
//   privacyPolicyUrl:
//     "https://github.com/jonikorpi/kausi/blob/master/PRIVACY_POLICY.md",
// };
// ui.start('#firebaseui-auth-container', uiConfig);
// if (ui.isPendingRedirect()) {
//   ui.start("#firebaseui-auth-container", uiConfig);
// }
