import admin from "firebase-admin";
import serviceAccount from "../FirebaseKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "e-commerce-store-625b7.firebasestorage.app",
});

export const bucket = admin.storage().bucket();
