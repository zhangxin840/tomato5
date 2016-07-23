// import firebaseUi from '../vendors/firebase-ui-auth.js';
import firebase from 'firebase';
import firebaseUiAuthCss from '../vendors/firebase-ui-auth.css'; /* eslint no-unused-vars: 0 */

const user = {
  displayName: '',
  email: '',
  emailVerified: false,
  photoURL: '',
  uid: '',
};

const initAuthUI = function initAuthUI() {
  // firebaseui is imported by script tag
  const firebaseui = window.firebaseui;
  // FirebaseUI config.
  const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: '/zx',
  };

  // Initialize the FirebaseUI Widget using Firebase.
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);
};

const init = function init() {
  firebase.auth().onAuthStateChanged((theUser) => {
    if (theUser) {
      user.displayName = theUser.displayName;
      user.email = theUser.email;
      user.emailVerified = theUser.emailVerified;
      user.photoURL = theUser.photoURL;
      user.uid = theUser.uid;

      // Object.assign(user, theUser);
      console.log(theUser);
    } else {
      // User is signed out.
      console.log('signed out');
      user.displayName = '';
      user.email = '';
      user.emailVerified = false;
      user.photoURL = '';
      user.uid = '';
      initAuthUI();
    }
  }, (error) => {
    console.log(error);
  });
};

const getUser = function getUser() {
  return user;
};

const logout = function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    window.location.reload();
  }, (error) => {
    // An error happened.
    window.location.reload();
  });
};

export default { init, getUser, logout };
