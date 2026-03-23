import admin from "firebase-admin";
import fs from "fs";
const serviceAccount = JSON.parse(
  process.env.NODE_ENV === "production"
    ? fs.readFileSync(new URL("/etc/secrets/FirebaseKey.json", import.meta.url))
    : fs.readFileSync(new URL("../FirebaseKey.json", import.meta.url)),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "e-commerce-store-625b7.firebasestorage.app",
});

export const bucket = admin.storage().bucket();
export default admin;
