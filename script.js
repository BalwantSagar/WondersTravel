// let currentUser = null;
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        console.log("User logged in:", user.email);
    } else {
        currentUser = null;
        console.log("User logged out");
    }
});

const slider = document.getElementById("slider");
const heroTitle = document.getElementById("heroTitle");
const heroSub = document.getElementById("heroSub");

const wonderGrid = document.getElementById("wonderGrid");
const worldGrid = document.getElementById("worldGrid");
const indiaGrid = document.getElementById("indiaGrid");

let selectedPlace = null;
let finalTotal = 0;

// ---------- LOGIN ----------
// let isLoggedIn = localStorage.getItem("loggedIn") === "true";

// ---------- DATA ----------
const places = [

{
category:"wonder",
name:"Taj Mahal",
img:"https://cdn.thecollector.com/wp-content/uploads/2021/12/the-taj-mahal-architectural-digest.jpg?width=1200&quality=100&dpr=2",
title:"Wah TAJ!",
about:"Located in Agra, India.",
history:"Built by Shah Jahan in 1632.",
budget:9900,
hotel:"Oberoi Amarvilas",
travel:"Cab / Train"
},

{
category:"wonder",
name:"Christ the Redeemer",
img:"https://cdn.thecollector.com/wp-content/uploads/2021/12/christ-the-redeemer-statue-rio-1-scaled.jpg?width=1200&quality=100&dpr=2",
title:"Explore Wonders",
about:"Brazil.",
history:" Designed by the Polish-French sculptor Paul Landowski in the 1920s and completed by Brazilian engineer Heitor da Silva Costa and French engineer Albert Caquot in 1931. ",
budget:14900,
hotel:"Christ Hotel",
travel:"Cab / Train"
},

{
category:"wonder",
name:"Machu Picchu, Peru",
img:"https://cdn.thecollector.com/wp-content/uploads/2021/12/machu-picchu-world-wonder.jpg?width=1095&quality=100&dpr=2",
title:"Explore Wonders",
about:"Peru.",
history:"Built by the Inca Empire in the 15th century.",
budget:19900,
hotel:" Machu Picchu Hotel",
travel:"Cab / Train"
},

{
category:"wonder",
name:"Petra, Jordan",
img:"https://cdn.thecollector.com/wp-content/uploads/2022/12/petra-jordan-treasury-al-khazneh.jpg?width=1200&quality=100&dpr=2",
title:"The Jordanian Desert",
about:"A historic Nabataean city.",
history:"City built between the 9th and 12th centuries.",
budget:25000,
hotel:"Yucatán Resort",
travel:"Metro / Taxi"
},
{
category:"wonder",
name:"Colosseum",
img:"https://cdn.thecollector.com/wp-content/uploads/2021/12/colosseum-world-wonder-national-geographic.jpg?width=1200&quality=100&dpr=2",
title:"Rome Adventure",
about:"Historic Roman amphitheatre.",
history:"Completed in 80 AD.",
budget:25000,
hotel:"Rome Cavalieri",
travel:"Metro / Taxi"
},

{
category:"wonder",
name:"Chichén Itzá, Mexico",
img:"https://cdn.thecollector.com/wp-content/uploads/2021/12/chichen-itza-image-1-1.jpg?width=1280&quality=100&dpr=2",
title:"The Mexican state of Yucatán",
about:"A historic Mayan city .",
history:"City built between the 9th and 12th centuries.",
budget:35000,
hotel:"Yucatán Resort",
travel:"Metro / Taxi"
},

{
category:"wonder",
name:"Great Wall of China",
img:"https://cdn.thecollector.com/wp-content/uploads/2021/12/great-wall-china-national-geographic.jpg?width=1200&quality=100&dpr=2",
title:"China Tour",
about:"Historic wall across China.",
history:"Built over centuries.",
budget:30900,
hotel:"Beijing Hotel",
travel:"Bus / Tour"
},

{
category:"world",
name:"Chile - Easter Island",
img:"https://cdn.thecollector.com/wp-content/uploads/2025/02/moai-statues-easter-island-chile-1.jpg?width=1200&quality=100&dpr=2",
title:"The island of Rapa Nui",
about:"The Rapa Nui people embarked on an ambitious endeavor.",
history:" Between 1250 and 1500 AD, they carved nearly 900 of these monolithic statues from volcanic tuff.",
budget:7000,
hotel:"Chile Resort",
travel:"Metro / Taxi"
},

{
category:"world",
name:"Switzerland",
img:"https://cdn.britannica.com/89/177889-050-B50F529B/Houses-banks-Aare-River-Switzerland-Bern.jpg",
title:"Swiss Nature",
about:"Mountains and lakes.",
history:"Beautiful Europe country.",
budget:59000,
hotel:"Alpine Resort",
travel:"Train / Taxi"
},

{
category:"world",
name:"Canada",
img:"https://media.istockphoto.com/id/1282694604/photo/man-hand-holding-autumn-colorful-maple-leaf-agains-pond.jpg?s=612x612&w=0&k=20&c=u03Zx725FlDW87EWNJCGja7VliKNuk9__Z3bZgaeOkE=",
title:"Canada Tour",
about:"Nature and cities.",
history:"Modern tourism nation.",
budget:58500,
hotel:"Fairmont",
travel:"Cab / Metro"
},

{
category:"world",
name:"Tokyo Japan",
img:"https://www.travelscout24.de/wp-content/uploads/sites/14/Japan-Tokio.jpg",
title:"Tokyo Lights",
about:"Modern city with tradition.",
history:"Capital of Japan.",
budget:62000,
hotel:"Tokyo Grand",
travel:"Metro / Taxi"
},

{
category:"world",
name:"Singapore",
img:"https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
title:"Singapore Tour",
about:"Luxury clean city.",
history:"Asian tourism hub.",
budget:60000,
hotel:"Marina Bay",
travel:"Metro / Taxi"
},

{
category:"india",
name:"Lucknow",
img:"https://www.theindianpanorama.news/wp-content/uploads/2014/03/204.jpg",
title:"City of Nawabs",
about:"Historic city of Uttar Pradesh.",
history:"Known for culture and food.",
budget:2200,
hotel:"Taj Lucknow",
travel:"Cab / Auto"
},

{
category:"india",
name:"Ballia",
img:"https://i.ytimg.com/vi/KgP4-ZzDNJ8/maxresdefault.jpg",
title:"Revolutionary Ballia",
about:"First independent District.",
history:"Banks of River Ganga.",
budget:2500,
hotel:"Ballia Resort",
travel:"Bike / Cab"
},

{
category:"india",
name:"Ladakh",
img:"https://www.lehladakhtaxis.com/img/practical-info/667x445_ladakh-urial.jpg",
title:"Wonderful Ladakh",
about:"Oldest holy city.",
history:"Banks of River Ganga.",
budget:2500,
hotel:"Brijrama",
travel:"Boat / Cab"
},

{
category:"india",
name:"Madurai",
img:"https://cdn.thecollector.com/wp-content/uploads/2024/12/madurai-temple-madurai-india.jpg?width=1200&quality=100&dpr=2",
title:"Athens of the East",
about:"At the heart of Madurai lies the Meenakshi Amman Temple.",
history:"The banks of the Vaigai River in Tamil Nadu.",
budget:2500,
hotel:" Resort",
travel:"Bike / Cab"
},

{
category:"india",
name:"Punjab",
img:"https://www.thehistoryhub.com/wp-content/uploads/2014/04/Golden-Temple-Images.jpg",
title:"The Golden Temple",
about:"Also known as Harmandir Sahib, stands as the holiest site for Sikhs.",
history:" Tranquil sarovar (holy pool), this temple attracts millions of devotees and tourists each year.",
budget:2500,
hotel:" Saheb Resort",
travel:"Bike / Cab"
},

{
category:"india",
name:"Delhi",
img:"https://cdn.thecollector.com/wp-content/uploads/2024/12/india-gate-national-monument-india-delhi.jpg?width=1200&quality=100&dpr=2",
title:"The capital of India ",
about:"It has served as the capital of the Delhi Sultanate and the Mughal Empire.",
history:" Old Delhi, established by Emperor Shah Jahan in 1639, is home to the imposing Red Fort and the majestic Jama Masjid. Narrow lanes bustle with life, particularly at Chandni Chowk.",
budget:2500,
hotel:" National PG Resort",
travel:"Bike / Cab"
},


{
category:"india",
name:"Dhudhwa National Park",
img:"https://www.dudhwanationalpark.in/image/how-to-reach2.jpg",
title:"Flora and Fauna",
about:"The jungle of Uttar Pradesh.",
history:"Lakhimpur Kheri district.",
budget:2500,
hotel:"Dhudhwa Resort",
travel:"bike / Cab"
},

{
category:"india",
name:"Goa",
img:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
title:"Beach Goa",
about:"India's party beach state.",
history:"Portuguese heritage.",
budget:4000,
hotel:"Beach Resort",
travel:"Bike / Cab"
},

{
category:"india",
name:"Jaipur",
img:"https://img.freepik.com/premium-photo/hawa-mahal-jaipur-rajasthan-treditional-india-pink-city-jaipur_947808-87.jpg",
title:"Pink City",
about:"Royal Rajasthan city.",
history:"Known for forts.",
budget:3500,
hotel:"Raj Palace",
travel:"Cab / Auto"
},

{
category:"india",
name:"Kerala",
img:"https://img.onmanorama.com/content/dam/mm/en/travel/kerala/images/2022/9/16/jatayu-rock-1.jpg",
title:"God's Own Country",
about:"Backwaters and greenery.",
history:"Famous tourism state.",
budget:4200,
hotel:"Lake Resort",
travel:"Cab / Boat"
}

];

// ---------- HERO ----------
let slide = 0;

setInterval(()=>{
slide = (slide + 1) % places.length;
slider.src = places[slide].img;
heroTitle.innerText = places[slide].title;
if(heroSub) heroSub.innerText = "Hotels • Cabs • Guides • Reviews";
},3000);

// ---------- CARD ----------
function createCard(place){
return `
<div class="card">
<img src="${place.img}">
<h3>${place.name}</h3>
<button onclick="openPlace('${place.name}')">Visit</button>
</div>
`;
}

places.forEach(p=>{
if(p.category==="wonder") wonderGrid.innerHTML += createCard(p);
if(p.category==="world") worldGrid.innerHTML += createCard(p);
if(p.category==="india") indiaGrid.innerHTML += createCard(p);
});

// ---------- OPEN PLACE ----------
function openPlace(name){

selectedPlace = places.find(p=>p.name===name);
if(!selectedPlace) return;

document.getElementById("detailsSection").classList.remove("hidden");

document.getElementById("placeName").innerText = selectedPlace.name;
document.getElementById("placeImg1").src = selectedPlace.img;
document.getElementById("placeImg2").src = selectedPlace.img;
document.getElementById("placeImg3").src = selectedPlace.img;

document.getElementById("placeAbout").innerText = selectedPlace.about;
document.getElementById("placeHistory").innerText = selectedPlace.history;
document.getElementById("placeBudget").innerText = "Budget ₹" + selectedPlace.budget;
document.getElementById("placeHotel").innerText = selectedPlace.hotel;
document.getElementById("placeTravel").innerText = selectedPlace.travel;

window.scrollTo({top:0,behavior:"smooth"});
}
window.openPlace = openPlace;

// ---------- BOOKING ----------
// function openBooking(){

// if(!isLoggedIn){
// openAuth();
// return;
// }

function openBooking(){

    if(!currentUser){
        alert("Please login first");
        openAuth();
        return;
    }

    document.getElementById("bookingSection").classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
}
function openBooking(){

    if(!currentUser){
        alert("Please login first");
        openAuth();
        return;
    }

    document.getElementById("bookingSection").classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
}
window.openBooking = openBooking;

function calculateTotal(){

let days = +document.getElementById("days").value || 1;
let people = +document.getElementById("people").value || 1;

finalTotal = selectedPlace.budget * days * people;

document.getElementById("total").innerText =
"Total Amount ₹" + finalTotal;
}
window.calculateTotal = calculateTotal;

// ---------- PAYMENT ----------
function payNow(){

let card = document.getElementById("card").value.trim();

if(card.length===16){
alert("Payment Successful ✔");
}else{
alert("Invalid Card Number");
}
}
window.payNow = payNow;

// ---------- AUTH ----------
function openAuth(){
document.getElementById("authPopup").classList.remove("hidden");
showLogin();
clearStatus();
}
window.openAuth = openAuth;

function closeAuth(){
document.getElementById("authPopup").classList.add("hidden");
}
window.closeAuth = closeAuth;

function clearStatus(){
document.getElementById("userStatus").innerText="";
}

function showRegister(){
document.getElementById("loginBox").classList.add("hidden");
document.getElementById("registerBox").classList.remove("hidden");
clearStatus();
}
window.showRegister = showRegister;

function showLogin(){
document.getElementById("registerBox").classList.add("hidden");
document.getElementById("loginBox").classList.remove("hidden");
clearStatus();
}
window.showLogin = showLogin;

// ---------- REGISTER ----------
function signup(){

let name = document.getElementById("fullname").value.trim();
let mobile = document.getElementById("mobile").value.trim();
let email = document.getElementById("regEmail").value.trim();
let pass = document.getElementById("regPassword").value.trim();
let city = document.getElementById("city").value.trim();
let age = document.getElementById("age").value.trim();

if(name==="" || mobile==="" || email==="" || pass===""){
document.getElementById("userStatus").innerText="Please fill all fields";
return;
}

    onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        console.log("User logged in:", user.email);
    } else {
        currentUser = null;
        console.log("User logged out");
    }
});

let user = {name,mobile,email,pass,city,age};

// localStorage.setItem("travelUser",JSON.stringify(user));
// localStorage.setItem("loggedIn","true");

// isLoggedIn = true;

showUserName(name);

document.getElementById("userStatus").innerText =
"Registration Successful ✔";

setTimeout(()=>{
closeAuth();
},800);

}
window.signup = signup;

// ---------- LOGIN ----------
function login(){

let email = document.getElementById("email").value.trim();
let pass = document.getElementById("password").value.trim();

// let saved = JSON.parse(localStorage.getItem("travelUser"));

if(saved && email===saved.email && pass===saved.pass){

// isLoggedIn = true;
// localStorage.setItem("loggedIn","true");

    localStorage.setItem("loggedIn","true");
// isLoggedIn = true;
    
showUserName(saved.name);

document.getElementById("userStatus").innerText =
"Welcome " + saved.name + " ✔";

setTimeout(()=>{
closeAuth();
},800);

}else{
document.getElementById("userStatus").innerText =
"Wrong Email or Password";
}
}
window.login = login;

// ---------- SHOW NAME ----------
function showUserName(name){
document.querySelector(".logo").innerText =
"WondersTravel | " + name;
}

// ---------- AUTO LOAD USER ----------
let savedUser = JSON.parse(localStorage.getItem("travelUser"));
if(savedUser && isLoggedIn){
showUserName(savedUser.name);
}

// ---------- SCROLL ----------
function scrollToSection(id){
document.getElementById(id).scrollIntoView({
behavior:"smooth"
});
}
window.scrollToSection = scrollToSection;
