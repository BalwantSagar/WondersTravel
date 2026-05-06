import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7quztgkbeHBp3iiOvalEz7PaohugOJYw",
  authDomain: "wonderstravel-cf93b.firebaseapp.com",
  projectId: "wonderstravel-cf93b",
  storageBucket: "wonderstravel-cf93b.firebasestorage.app",
  messagingSenderId: "13751619919",
  appId: "1:13751619919:web:0ccce8cefd7066b4a6b53a",
  measurementId: "G-Q17F9YC295"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- EXPOSE FUNCTIONS TO THE WINDOW ---
// This allows the "onclick" in your HTML to actually find these functions.

// window.signup = function() {
//     const email = document.getElementById("regEmail").value.trim();
//     const pass = document.getElementById("regPassword").value.trim();
//     const name = document.getElementById("fullname").value.trim();

//     if(!email || !pass) return alert("Please fill fields");

//     createUserWithEmailAndPassword(auth, email, pass)
//         .then((userCredential) => {
//             alert("Registered successfully!");
//             document.getElementById("authPopup").classList.add("hidden");
//         })
//         .catch((error) => alert(error.message));
// };

window.signup = function() {
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value.trim();

    if (!email.includes("@")) {
        return alert("Enter valid email");
    }

    if (pass.length < 6) {
        return alert("Password must be at least 6 characters");
    }

    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => {
            alert("Registered successfully!");
        })
        .catch((error) => {
    console.log(error.code);
    alert(error.code);
});
};

window.login = function() {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => {
            alert("Logged in!");
            document.getElementById("authPopup").classList.add("hidden");
        })
        .catch((error) => alert("Login Failed: " + error.message));
};

window.logout = function() {
    signOut(auth).then(() => location.reload());
};

// --- MONITOR AUTH STATE (The Top-Left Name Fix) ---
onAuthStateChanged(auth, (user) => {
    const logo = document.getElementById("siteLogo");
    const authBtnArea = document.querySelector(".nav-right");

    if (user) {
        // Show name on left top
        logo.innerText = "Welcome, " + user.email.split('@')[0];
        // Change Login button to Logout
        authBtnArea.innerHTML = `<button onclick="logout()">Logout</button>`;
        window.isUserLoggedIn = true; // Global flag for booking
    } else {
        logo.innerText = "WondersTravel";
        authBtnArea.innerHTML = `<button onclick="openAuth()">Login</button>`;
        window.isUserLoggedIn = false;
    }
});
