// Shared Firebase setup (modular SDK from Google's CDN).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Google sign-in returns through <project>.firebaseapp.com (the authDomain). On the .web.app address
// that is a different site, and browsers that block third-party storage break the popup.
// So the .web.app address forwards to the same page on firebaseapp.com.
if (location.hostname === firebaseConfig.projectId + ".web.app") {
  location.replace("https://" + firebaseConfig.authDomain + location.pathname + location.search + location.hash);
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// Site root, e.g. https://….web.app/ (works from any lesson folder)
export const ROOT = new URL("../", import.meta.url).href;
export const lang = () => { try { return localStorage.getItem("cadru-lang") === "en" ? "en" : "ro"; } catch (e) { return "ro"; } };
