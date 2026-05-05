// ================================
// WondersTravel Firebase Final
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
getFirestore,
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===================================
// 🔴 PASTE YOUR FIREBASE CONFIG HERE
// ===================================
const firebaseConfig = {
  apiKey: "AIzaSyC7quztgkbeHBp3iiOvalEz7PaohugOJYw",
  authDomain: "wonderstravel-cf93b.firebaseapp.com",
  projectId: "wonderstravel-cf93b",
  storageBucket: "wonderstravel-cf93b.firebasestorage.app",
  messagingSenderId: "13751619919",
  appId: "1:13751619919:web:0ccce8cefd7066b4a6b53a",
  measurementId: "G-Q17F9YC295"
};



// ================================
// Initialize Firebase
// ================================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ================================
// SIGNUP
// ================================
window.signup = function(){

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

if(email === "" || password === ""){
alert("Please fill all fields");
return;
}

createUserWithEmailAndPassword(auth,email,password)
.then(()=>{
alert("Signup Successful ✔");
})
.catch((error)=>{
alert(error.message);
});

};


// ================================
// LOGIN
// ================================
window.login = function(){

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value.trim();

if(email === "" || password === ""){
alert("Please fill all fields");
return;
}

signInWithEmailAndPassword(auth,email,password)
.then(()=>{
alert("Login Successful ✔");
document.getElementById("authPopup").classList.add("hidden");
})
.catch((error)=>{
alert(error.message);
});

};


// ================================
// LOGOUT
// ================================
window.logout = function(){

signOut(auth)
.then(()=>{
alert("Logged Out");
});

};


// ================================
// USER STATUS
// ================================
onAuthStateChanged(auth,(user)=>{

const status = document.getElementById("userStatus");

if(!status) return;

if(user){
status.innerText = "Logged in: " + user.email;
}else{
status.innerText = "Not Logged In";
}

});


// ================================
// SAVE REVIEW
// ================================
window.saveReview = async function(placeName,reviewText){

try{

await addDoc(collection(db,"reviews"),{
place: placeName,
review: reviewText,
time: new Date().toLocaleString()
});

}catch(error){
console.log(error);
}

};


// ================================
// LOAD REVIEWS
// ================================
window.loadReviews = async function(){

const box = document.getElementById("reviewList");

if(!box) return;

box.innerHTML = "";

const querySnapshot = await getDocs(collection(db,"reviews"));

querySnapshot.forEach((doc)=>{

const data = doc.data();

box.innerHTML += `
<div class="review-item">
<strong>${data.place}</strong><br>
${data.review}<br>
<small>${data.time}</small>
</div>
`;

});

};


// ================================
// SAVE BOOKING
// ================================
window.saveBooking = async function(place,total){

try{

await addDoc(collection(db,"bookings"),{
place: place,
amount: total,
time: new Date().toLocaleString()
});

}catch(error){
console.log(error);
}

};


// ================================
// AUTO LOAD REVIEWS WHEN PAGE OPEN
// ================================
window.addEventListener("load",()=>{

if(document.getElementById("reviewList")){
loadReviews();
}

});