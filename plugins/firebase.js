import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'

const config = {
  apiKey: 'AIzaSyCjLE7YttfE5aE6eKSQpJPhhadf_PsGi2E',
  authDomain: 'cscom-2019.firebaseapp.com',
  databaseURL: 'https://cscom-2019.firebaseio.com',
  projectId: 'cscom-2019',
  storageBucket: 'cscom-2019.appspot.com',
  messagingSenderId: '13136201488'
}

// eslint-disable-next-line no-unused-expressions
!firebase.apps.length ? firebase.initializeApp(config) : ''
export const GoogleProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const DB = firebase.database()
export const StoreDB = firebase.firestore()
export const firestorage = firebase.storage()
export default firebase
