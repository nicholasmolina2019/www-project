// lib/firebaseClient.ts

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

export const firebaseConfig = {
  apiKey: "AIzaSyAziG2uz3H0GJUjSvZtdHMallE11cDR2-o",
  authDomain: "checklist-1710b.firebaseapp.com",
  projectId: "checklist-1710b",
  storageBucket: "checklist-1710b.appspot.com",
  messagingSenderId: "724680973232",
  appId: "1:724680973232:web:17fd5ae4c4cbf493741475",
  measurementId: "G-ZF8JKSWJ39"
}

// Initialize Firebase app
let app: FirebaseApp
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Firebase Authentication and export it
export const auth = getAuth(app)

// Conditionally initialize Firebase Analytics only on client
let analyticsInstance: any = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app)
    }
  }).catch(err => {
    console.error("Failed to initialize Firebase Analytics", err)
  })
}

export const analytics = () => analyticsInstance
