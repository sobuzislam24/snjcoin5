// USER APP FIREBASE CONNECTION
// Uses Cloud Firestore.
// Before using this file, enable Cloud Firestore in Firebase Console.

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTay11VbCWjJT3w01FPI8WAiYsDI268HA",
  authDomain: "njkja-d1948.firebaseapp.com",
  databaseURL: "https://njkja-d1948-default-rtdb.firebaseio.com",
  projectId: "njkja-d1948",
  storageBucket: "njkja-d1948.firebasestorage.app",
  messagingSenderId: "326873214877",
  appId: "1:326873214877:web:11c08ba36b870aee3d8974"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.firebaseDB = db;

// Create/update the Telegram user profile.
window.createOrLoadUser = async function(user) {
  const telegramId = String(user.id);
  const ref = doc(db, "users", telegramId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      username: user.username ? "@" + user.username : "@" + (user.first_name || "user"),
      telegramId,
      balance: 0,
      status: "INACTIVE",
      currentPlan: "No Active Plan",
      adsLimit: 0,
      adsRemaining: 0,
      blocked: false,
      createdAt: serverTimestamp()
    });
  }

  const latest = await getDoc(ref);
  return { id: latest.id, ...latest.data() };
};

// Creates only a PENDING request.
// Wallet balance is NOT increased automatically.
window.createDepositRequest = async function(request, userId) {
  await addDoc(collection(db, "depositRequests"), {
    ...request,
    userId: String(userId),
    status: "PENDING",
    createdAt: serverTimestamp()
  });
};
