import {
  createBooking,
  fetchUserBookings,
  loginUser,
  logoutUser,
  registerUser,
  saveUserProfile,
  watchAuthState
} from "./firebase.js";

const slider = document.getElementById("slider");
const heroTitle = document.getElementById("heroTitle");
const heroSub = document.getElementById("heroSub");
const wonderGrid = document.getElementById("wonderGrid");
const worldGrid = document.getElementById("worldGrid");
const indiaGrid = document.getElementById("indiaGrid");
const authPopup = document.getElementById("authPopup");
const dashboardSection = document.getElementById("dashboardSection");
const detailVisitBtn = document.getElementById("detailVisitBtn");
const detailSaveBtn = document.getElementById("detailSaveBtn");
const flashToast = document.getElementById("flashToast");

let toastTimer = null;

const dialogIds = [
  "detailsDialog",
  "bookingDialog",
  "paymentDialog",
  "profileDialog",
  "bookingsDialog"
];

const appState = {
  guestMode: localStorage.getItem("travelGuestMode") === "true",
  isLoggedIn: false,
  user: null,
  profile: null,
  bookings: [],
  wishlist: [],
  selectedPlace: null,
  finalTotal: 0
};

const places = [
  {
    category: "wonder",
    name: "Taj Mahal",
    img: "https://cdn.thecollector.com/wp-content/uploads/2021/12/the-taj-mahal-architectural-digest.jpg?width=1200&quality=100&dpr=2",
    title: "Wah Taj!",
    about: "Located in Agra, India.",
    history: "Built by Shah Jahan in 1632.",
    budget: 9900,
    hotel: "Oberoi Amarvilas",
    travel: "Cab / Train"
  },
  {
    category: "wonder",
    name: "Christ the Redeemer",
    img: "https://cdn.thecollector.com/wp-content/uploads/2021/12/christ-the-redeemer-statue-rio-1-scaled.jpg?width=1200&quality=100&dpr=2",
    title: "Explore Wonders",
    about: "Brazil.",
    history: "Designed by Paul Landowski in the 1920s and completed in 1931.",
    budget: 14900,
    hotel: "Christ Hotel",
    travel: "Cab / Train"
  },
  {
    category: "wonder",
    name: "Machu Picchu, Peru",
    img: "https://cdn.thecollector.com/wp-content/uploads/2021/12/machu-picchu-world-wonder.jpg?width=1095&quality=100&dpr=2",
    title: "Explore Wonders",
    about: "Peru.",
    history: "Built by the Inca Empire in the 15th century.",
    budget: 19900,
    hotel: "Machu Picchu Hotel",
    travel: "Cab / Train"
  },
  {
    category: "wonder",
    name: "Petra, Jordan",
    img: "https://cdn.thecollector.com/wp-content/uploads/2022/12/petra-jordan-treasury-al-khazneh.jpg?width=1200&quality=100&dpr=2",
    title: "The Jordanian Desert",
    about: "A historic Nabataean city.",
    history: "City built between the 9th and 12th centuries.",
    budget: 25000,
    hotel: "Desert Heritage Resort",
    travel: "Metro / Taxi"
  },
  {
    category: "wonder",
    name: "Colosseum",
    img: "https://cdn.thecollector.com/wp-content/uploads/2021/12/colosseum-world-wonder-national-geographic.jpg?width=1200&quality=100&dpr=2",
    title: "Rome Adventure",
    about: "Historic Roman amphitheatre.",
    history: "Completed in 80 AD.",
    budget: 25000,
    hotel: "Rome Cavalieri",
    travel: "Metro / Taxi"
  },
  {
    category: "wonder",
    name: "Chichen Itza, Mexico",
    img: "https://cdn.thecollector.com/wp-content/uploads/2021/12/chichen-itza-image-1-1.jpg?width=1280&quality=100&dpr=2",
    title: "Yucatan Landmark",
    about: "A historic Mayan city.",
    history: "City built between the 9th and 12th centuries.",
    budget: 35000,
    hotel: "Yucatan Resort",
    travel: "Metro / Taxi"
  },
  {
    category: "wonder",
    name: "Great Wall of China",
    img: "https://cdn.thecollector.com/wp-content/uploads/2021/12/great-wall-china-national-geographic.jpg?width=1200&quality=100&dpr=2",
    title: "China Tour",
    about: "Historic wall across China.",
    history: "Built over centuries.",
    budget: 30900,
    hotel: "Beijing Hotel",
    travel: "Bus / Tour"
  },
  {
    category: "world",
    name: "Chile - Easter Island",
    img: "https://cdn.thecollector.com/wp-content/uploads/2025/02/moai-statues-easter-island-chile-1.jpg?width=1200&quality=100&dpr=2",
    title: "The Island of Rapa Nui",
    about: "A remote island with iconic stone statues.",
    history: "Between 1250 and 1500 AD, nearly 900 monolithic statues were carved here.",
    budget: 7000,
    hotel: "Chile Resort",
    travel: "Metro / Taxi"
  },
  {
    category: "world",
    name: "Switzerland",
    img: "https://cdn.britannica.com/89/177889-050-B50F529B/Houses-banks-Aare-River-Switzerland-Bern.jpg",
    title: "Swiss Nature",
    about: "Mountains and lakes.",
    history: "A beautiful European country known for alpine travel.",
    budget: 59000,
    hotel: "Alpine Resort",
    travel: "Train / Taxi"
  },
  {
    category: "world",
    name: "Canada",
    img: "https://media.istockphoto.com/id/1282694604/photo/man-hand-holding-autumn-colorful-maple-leaf-agains-pond.jpg?s=612x612&w=0&k=20&c=u03Zx725FlDW87EWNJCGja7VliKNuk9__Z3bZgaeOkE=",
    title: "Canada Tour",
    about: "Nature and cities.",
    history: "Modern tourism with unforgettable seasonal beauty.",
    budget: 58500,
    hotel: "Fairmont",
    travel: "Cab / Metro"
  },
  {
    category: "world",
    name: "Tokyo Japan",
    img: "https://www.travelscout24.de/wp-content/uploads/sites/14/Japan-Tokio.jpg",
    title: "Tokyo Lights",
    about: "Modern city with tradition.",
    history: "Capital of Japan.",
    budget: 62000,
    hotel: "Tokyo Grand",
    travel: "Metro / Taxi"
  },
  {
    category: "world",
    name: "Singapore",
    img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    title: "Singapore Tour",
    about: "Luxury clean city.",
    history: "An Asian tourism hub with premium city experiences.",
    budget: 60000,
    hotel: "Marina Bay",
    travel: "Metro / Taxi"
  },
  {
    category: "india",
    name: "Lucknow",
    img: "https://www.theindianpanorama.news/wp-content/uploads/2014/03/204.jpg",
    title: "City of Nawabs",
    about: "Historic city of Uttar Pradesh.",
    history: "Known for culture and food.",
    budget: 2200,
    hotel: "Taj Lucknow",
    travel: "Cab / Auto"
  },
  {
    category: "india",
    name: "Ballia",
    img: "https://i.ytimg.com/vi/KgP4-ZzDNJ8/maxresdefault.jpg",
    title: "Revolutionary Ballia",
    about: "A district on the banks of River Ganga.",
    history: "Known for its place in India's freedom movement.",
    budget: 2500,
    hotel: "Ballia Resort",
    travel: "Bike / Cab"
  },
  {
    category: "india",
    name: "Ladakh",
    img: "https://www.lehladakhtaxis.com/img/practical-info/667x445_ladakh-urial.jpg",
    title: "Wonderful Ladakh",
    about: "A high-altitude destination with dramatic landscapes.",
    history: "A favorite for adventure and scenic road travel.",
    budget: 12500,
    hotel: "Brijrama Retreat",
    travel: "SUV / Cab"
  },
  {
    category: "india",
    name: "Madurai",
    img: "https://cdn.thecollector.com/wp-content/uploads/2024/12/madurai-temple-madurai-india.jpg?width=1200&quality=100&dpr=2",
    title: "Athens of the East",
    about: "The Meenakshi Amman Temple is at the heart of the city.",
    history: "Set on the banks of the Vaigai River in Tamil Nadu.",
    budget: 4500,
    hotel: "Temple View Resort",
    travel: "Cab / Auto"
  },
  {
    category: "india",
    name: "Punjab",
    img: "https://www.thehistoryhub.com/wp-content/uploads/2014/04/Golden-Temple-Images.jpg",
    title: "The Golden Temple",
    about: "The holiest site for Sikhs.",
    history: "Surrounded by a serene holy pool and visited by millions each year.",
    budget: 3500,
    hotel: "Saheb Resort",
    travel: "Bike / Cab"
  },
  {
    category: "india",
    name: "Delhi",
    img: "https://cdn.thecollector.com/wp-content/uploads/2024/12/india-gate-national-monument-india-delhi.jpg?width=1200&quality=100&dpr=2",
    title: "The Capital of India",
    about: "A layered city of history, culture, and modern life.",
    history: "From Old Delhi to central boulevards, the city carries centuries of heritage.",
    budget: 5200,
    hotel: "National PG Resort",
    travel: "Bike / Cab"
  },
  {
    category: "india",
    name: "Dudhwa National Park",
    img: "https://www.dudhwanationalpark.in/image/how-to-reach2.jpg",
    title: "Flora and Fauna",
    about: "The jungle of Uttar Pradesh.",
    history: "Located in Lakhimpur Kheri district.",
    budget: 3200,
    hotel: "Dudhwa Resort",
    travel: "Jeep / Cab"
  },
  {
    category: "india",
    name: "Goa",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    title: "Beach Goa",
    about: "India's party beach state.",
    history: "Famous for Portuguese heritage and coastal escapes.",
    budget: 4000,
    hotel: "Beach Resort",
    travel: "Bike / Cab"
  },
  {
    category: "india",
    name: "Jaipur",
    img: "https://img.freepik.com/premium-photo/hawa-mahal-jaipur-rajasthan-treditional-india-pink-city-jaipur_947808-87.jpg",
    title: "Pink City",
    about: "Royal Rajasthan city.",
    history: "Known for its forts and palace architecture.",
    budget: 3500,
    hotel: "Raj Palace",
    travel: "Cab / Auto"
  },
  {
    category: "india",
    name: "Kerala",
    img: "https://img.onmanorama.com/content/dam/mm/en/travel/kerala/images/2022/9/16/jatayu-rock-1.jpg",
    title: "God's Own Country",
    about: "Backwaters and greenery.",
    history: "One of India's most loved tourism states.",
    budget: 4200,
    hotel: "Lake Resort",
    travel: "Cab / Boat"
  }
];

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getWishlistKey() {
  return appState.user ? `wonderstravel_wishlist_${appState.user.uid}` : "";
}

function loadWishlist() {
  if (!appState.user) {
    appState.wishlist = [];
    return;
  }

  try {
    appState.wishlist = JSON.parse(localStorage.getItem(getWishlistKey()) || "[]");
  } catch {
    appState.wishlist = [];
  }
}

function saveWishlist() {
  if (!appState.user) {
    return;
  }
  localStorage.setItem(getWishlistKey(), JSON.stringify(appState.wishlist));
}

function showToast(message, type = "success") {
  flashToast.textContent = message;
  flashToast.className = `flash-toast ${type}`;
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    flashToast.className = "flash-toast hidden";
  }, 3000);
}

function setStatus(elementId, message, isError = false) {
  const target = document.getElementById(elementId);
  if (!target) {
    return;
  }
  target.innerText = message;
  target.classList.toggle("error-text", isError);
  target.classList.toggle("success-text", !isError && Boolean(message));
}

function clearAuthStatus() {
  setStatus("userStatus", "");
}

function travelerLevel() {
  if (appState.bookings.length >= 5) {
    return "Globetrotter";
  }
  if (appState.bookings.length >= 2) {
    return "Voyager";
  }
  return "Explorer";
}

function renderCards() {
  wonderGrid.innerHTML = "";
  worldGrid.innerHTML = "";
  indiaGrid.innerHTML = "";

  places.forEach((place) => {
    const saved = appState.wishlist.includes(place.name);
    const saveLabel = saved ? "Saved" : "Save";
    const markup = `
      <div class="card" onclick="openPlace('${escapeText(place.name)}')">
        <img src="${place.img}" alt="${escapeText(place.name)}">
        <div class="card-content">
          <h3>${escapeText(place.name)}</h3>
          <p>${escapeText(place.about)}</p>
          <div class="card-actions">
            <button onclick="event.stopPropagation(); openPlace('${escapeText(place.name)}')">Explore</button>
            <button class="card-soft-btn" onclick="event.stopPropagation(); toggleWishlist('${escapeText(place.name)}')">${saveLabel}</button>
            <button class="visit-btn" onclick="event.stopPropagation(); startBookingFlow('${escapeText(place.name)}')">Visit</button>
          </div>
        </div>
      </div>
    `;

    if (place.category === "wonder") {
      wonderGrid.insertAdjacentHTML("beforeend", markup);
    }
    if (place.category === "world") {
      worldGrid.insertAdjacentHTML("beforeend", markup);
    }
    if (place.category === "india") {
      indiaGrid.insertAdjacentHTML("beforeend", markup);
    }
  });
}

function startHeroSlider() {
  let slide = 0;

  setInterval(() => {
    slide = (slide + 1) % places.length;
    slider.src = places[slide].img;
    heroTitle.innerText = places[slide].title;
    heroSub.innerText = appState.isLoggedIn
      ? `Welcome back. ${appState.wishlist.length} saved places and ${appState.bookings.length} trip bookings ready.`
      : "Browse every destination freely. Login when you are ready to book.";
  }, 3000);
}

function updateNav() {
  const authActionBtn = document.getElementById("authActionBtn");
  const profileActionBtn = document.getElementById("profileActionBtn");
  const bookingsActionBtn = document.getElementById("bookingsActionBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const siteLogo = document.getElementById("siteLogo");

  if (appState.isLoggedIn && appState.user) {
    const name = appState.profile?.fullName || appState.user.displayName || appState.user.email;
    siteLogo.innerText = `WondersTravel | ${name}`;
    authActionBtn.classList.add("hidden");
    profileActionBtn.classList.remove("hidden");
    bookingsActionBtn.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    siteLogo.innerText = "WondersTravel";
    authActionBtn.classList.remove("hidden");
    profileActionBtn.classList.add("hidden");
    bookingsActionBtn.classList.add("hidden");
    logoutBtn.classList.add("hidden");
  }
}

function updateDashboard() {
  if (!appState.isLoggedIn) {
    dashboardSection.classList.add("hidden");
    return;
  }

  dashboardSection.classList.remove("hidden");
  document.getElementById("dashboardTitle").innerText =
    `Welcome, ${appState.profile?.fullName || appState.user.email}`;
  document.getElementById("dashboardSubtitle").innerText =
    "Manage your details, review bookings, save places, and plan your next trip.";
  document.getElementById("profileStatusText").innerText =
    appState.profile?.fullName && appState.profile?.mobile && appState.profile?.address
      ? "Complete"
      : "Needs Attention";
  document.getElementById("bookingCountText").innerText =
    `${appState.bookings.length} Trip${appState.bookings.length === 1 ? "" : "s"}`;
  document.getElementById("wishlistCountText").innerText =
    `${appState.wishlist.length} Saved`;
  document.getElementById("travelerLevelText").innerText = travelerLevel();
}

function updateProfileForm() {
  if (!appState.user) {
    return;
  }

  document.getElementById("profileFullName").value = appState.profile?.fullName || "";
  document.getElementById("profileEmail").value = appState.user.email || "";
  document.getElementById("profileMobile").value = appState.profile?.mobile || "";
  document.getElementById("profileCity").value = appState.profile?.city || "";
  document.getElementById("profileAddress").value = appState.profile?.address || "";
  document.getElementById("profileAge").value = appState.profile?.age || "";
}

function renderBookings() {
  const bookingsList = document.getElementById("bookingsList");

  if (!appState.isLoggedIn) {
    bookingsList.innerHTML = `
      <div class="empty-state">
        <h3>Login required</h3>
        <p>Please login to view your trip bookings.</p>
      </div>
    `;
    return;
  }

  if (!appState.bookings.length) {
    bookingsList.innerHTML = `
      <div class="empty-state">
        <h3>No bookings yet</h3>
        <p>Use the Visit button on any destination to create your first trip booking.</p>
      </div>
    `;
    return;
  }

  bookingsList.innerHTML = appState.bookings
    .map((booking) => {
      const bookedOn = booking.createdAt
        ? booking.createdAt.toLocaleDateString()
        : "Recently";
      const syncLabel = booking.syncSource === "firebase" ? "Synced" : "Saved locally";

      return `
        <article class="booking-card">
          <div class="booking-card-head">
            <h3>${escapeText(booking.placeName)}</h3>
            <span>${syncLabel}</span>
          </div>
          <p><strong>Booked:</strong> ${escapeText(bookedOn)}</p>
          <p><strong>Traveler:</strong> ${escapeText(booking.travelerName)}</p>
          <p><strong>Departure:</strong> ${escapeText(booking.departureDate || "Not selected")}</p>
          <p><strong>Travelers:</strong> ${booking.people}</p>
          <p><strong>Stay:</strong> ${booking.days} day(s)</p>
          <p><strong>Cab:</strong> ${escapeText(booking.cabLabel)}</p>
          <p><strong>Total:</strong> Rs ${booking.total}</p>
        </article>
      `;
    })
    .join("");
}

async function syncBookings() {
  if (!appState.user) {
    appState.bookings = [];
    renderBookings();
    updateDashboard();
    return;
  }

  try {
    appState.bookings = await fetchUserBookings(appState.user.uid);
  } catch (error) {
    console.error(error);
    appState.bookings = [];
  }

  renderBookings();
  updateDashboard();
}

function populateBookingFromProfile() {
  document.getElementById("travelerName").value = appState.profile?.fullName || "";
  document.getElementById("contactNumber").value = appState.profile?.mobile || "";
  document.getElementById("bookingAddress").value = appState.profile?.address || "";
}

function hidePopup() {
  authPopup.classList.add("hidden");
}

function showPopup() {
  authPopup.classList.remove("hidden");
}

function openDialog(dialogId) {
  closeAllDialogs();
  document.getElementById(dialogId).classList.remove("hidden");
  document.body.classList.add("dialog-open");
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog) {
    dialog.classList.add("hidden");
  }
  const stillOpen = dialogIds.some((id) => !document.getElementById(id).classList.contains("hidden"));
  if (!stillOpen) {
    document.body.classList.remove("dialog-open");
  }
}

function closeAllDialogs() {
  dialogIds.forEach((id) => {
    document.getElementById(id).classList.add("hidden");
  });
  document.body.classList.remove("dialog-open");
}

function requireLogin(message) {
  openAuth(message || "Please login to access this feature.");
}

function openPlace(name) {
  const place = places.find((item) => item.name === name);
  if (!place) {
    return;
  }

  appState.selectedPlace = place;
  document.getElementById("placeName").innerText = place.name;
  document.getElementById("placeImg1").src = place.img;
  document.getElementById("placeImg2").src = place.img;
  document.getElementById("placeImg3").src = place.img;
  document.getElementById("placeAbout").innerText = `About: ${place.about}`;
  document.getElementById("placeHistory").innerText = `History: ${place.history}`;
  document.getElementById("placeBudget").innerText = `Base Budget: Rs ${place.budget}`;
  document.getElementById("placeHotel").innerText = `Recommended Stay: ${place.hotel}`;
  document.getElementById("placeTravel").innerText = `Travel Mode: ${place.travel}`;
  detailVisitBtn.innerText = appState.isLoggedIn ? "Visit Now" : "Login To Visit";
  detailSaveBtn.innerText = appState.wishlist.includes(place.name) ? "Saved Place" : "Save Place";
  openDialog("detailsDialog");
}

function startBookingFlow(name) {
  const place = places.find((item) => item.name === name);
  if (!place) {
    return;
  }

  appState.selectedPlace = place;

  if (!appState.isLoggedIn) {
    requireLogin("Login is required before booking any trip.");
    return;
  }

  openBookingSection();
}

function openBookingSection() {
  if (!appState.selectedPlace) {
    return;
  }

  populateBookingFromProfile();
  document.getElementById("bookingPlaceName").innerText = `Booking for ${appState.selectedPlace.name}`;
  document.getElementById("total").innerText = "";
  document.getElementById("payResult").innerText = "";
  appState.finalTotal = 0;
  openDialog("bookingDialog");
}

function calculateTotal() {
  if (!appState.selectedPlace) {
    return;
  }

  const days = Number(document.getElementById("days").value) || 1;
  const people = Number(document.getElementById("people").value) || 1;
  const cabPrice = Number(document.getElementById("cab").value) || 0;
  appState.finalTotal = appState.selectedPlace.budget * days * people + cabPrice;
  document.getElementById("total").innerText = `Total Amount Rs ${appState.finalTotal}`;
  showToast("Trip cost calculated.", "success");
}

function openPayment() {
  if (!appState.isLoggedIn) {
    requireLogin("Please login before proceeding to payment.");
    return;
  }

  const travelerName = document.getElementById("travelerName").value.trim();
  const contactNumber = document.getElementById("contactNumber").value.trim();
  const departureDate = document.getElementById("departureDate").value;

  if (!travelerName || !contactNumber || !departureDate) {
    showToast("Please complete traveler details first.", "error");
    return;
  }

  if (!appState.finalTotal) {
    calculateTotal();
  }

  document.getElementById("paymentSummary").innerText =
    `${appState.selectedPlace.name} | Total Rs ${appState.finalTotal}`;
  openDialog("paymentDialog");
}

async function payNow() {
  const card = document.getElementById("card").value.trim();

  if (!/^\d{16}$/.test(card)) {
    setStatus("payResult", "Invalid card number", true);
    showToast("Enter a valid 16 digit card number.", "error");
    return;
  }

  if (!appState.user || !appState.selectedPlace) {
    setStatus("payResult", "Login is required before payment", true);
    showToast("Please login before payment.", "error");
    return;
  }

  const cabSelect = document.getElementById("cab");
  const booking = {
    placeName: appState.selectedPlace.name,
    days: Number(document.getElementById("days").value) || 1,
    people: Number(document.getElementById("people").value) || 1,
    cabLabel: cabSelect.options[cabSelect.selectedIndex].text,
    cabPrice: Number(cabSelect.value) || 0,
    total: appState.finalTotal || appState.selectedPlace.budget,
    travelerName: document.getElementById("travelerName").value.trim(),
    contactNumber: document.getElementById("contactNumber").value.trim(),
    departureDate: document.getElementById("departureDate").value,
    address: document.getElementById("bookingAddress").value.trim()
  };

  try {
    const savedBooking = await createBooking(appState.user.uid, booking);
    const syncMessage =
      savedBooking.syncSource === "firebase"
        ? "Payment successful. Booking saved."
        : "Payment successful. Booking saved locally.";

    setStatus("payResult", syncMessage, false);
    showToast(syncMessage, "success");
    await syncBookings();
    setTimeout(() => {
      openBookingsSection();
    }, 400);
  } catch (error) {
    console.error(error);
    setStatus("payResult", "Booking could not be saved. Please try again.", true);
    showToast("Booking failed. Please try again.", "error");
  }
}

function goHome() {
  closeAllDialogs();
}

function backToDetails() {
  if (appState.selectedPlace) {
    openPlace(appState.selectedPlace.name);
  } else {
    goHome();
  }
}

function backToBooking() {
  openBookingSection();
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function openAuth(message = "Login to unlock booking, profile, and dashboard access.") {
  document.getElementById("authPromptText").innerText = message;
  clearAuthStatus();
  showLogin();
  showPopup();
}

function closeAuth() {
  if (!appState.isLoggedIn) {
    appState.guestMode = true;
    localStorage.setItem("travelGuestMode", "true");
  }
  hidePopup();
}

function continueAsGuest() {
  appState.guestMode = true;
  localStorage.setItem("travelGuestMode", "true");
  clearAuthStatus();
  hidePopup();
  showToast("Browsing in guest mode.", "info");
}

function showRegister() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("registerBox").classList.remove("hidden");
  clearAuthStatus();
}

function showLogin() {
  document.getElementById("registerBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
  clearAuthStatus();
}

async function signup() {
  const profile = {
    fullName: document.getElementById("fullname").value.trim(),
    mobile: document.getElementById("mobile").value.trim(),
    email: document.getElementById("regEmail").value.trim(),
    password: document.getElementById("regPassword").value.trim(),
    address: document.getElementById("address").value.trim(),
    city: document.getElementById("city").value.trim(),
    age: document.getElementById("age").value.trim()
  };

  if (!profile.fullName || !profile.mobile || !profile.email || !profile.password || !profile.address) {
    setStatus("userStatus", "Please fill all required fields.", true);
    showToast("Please fill all required fields.", "error");
    return;
  }

  if (profile.password.length < 6) {
    setStatus("userStatus", "Password must be at least 6 characters.", true);
    showToast("Password must be at least 6 characters.", "error");
    return;
  }

  try {
    await registerUser(profile);
    setStatus("userStatus", "Registration successful.");
    localStorage.removeItem("travelGuestMode");
    hidePopup();
    showToast("Registration successful.", "success");
  } catch (error) {
    console.error(error);
    setStatus("userStatus", error.message || "Registration failed.", true);
    showToast("Registration failed.", "error");
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    setStatus("userStatus", "Enter email and password.", true);
    showToast("Enter email and password.", "error");
    return;
  }

  try {
    await loginUser(email, password);
    setStatus("userStatus", "Login successful.");
    localStorage.removeItem("travelGuestMode");
    hidePopup();
    showToast("Logged in successfully.", "success");
  } catch (error) {
    console.error(error);
    setStatus("userStatus", "Wrong email or password.", true);
    showToast("Wrong email or password.", "error");
  }
}

async function logout() {
  try {
    await logoutUser();
    appState.guestMode = false;
    localStorage.removeItem("travelGuestMode");
    appState.wishlist = [];
    closeAllDialogs();
    renderCards();
    updateDashboard();
    showToast("Logged out successfully.", "success");
  } catch (error) {
    console.error(error);
    showToast("Logout failed.", "error");
  }
}

function openProfileSection() {
  if (!appState.isLoggedIn) {
    requireLogin("Please login to open your traveler profile.");
    return;
  }

  updateProfileForm();
  setStatus("profileStatus", "");
  openDialog("profileDialog");
}

async function saveProfile() {
  if (!appState.user) {
    requireLogin("Please login to save your profile.");
    return;
  }

  const profile = {
    fullName: document.getElementById("profileFullName").value.trim(),
    email: appState.user.email || "",
    mobile: document.getElementById("profileMobile").value.trim(),
    city: document.getElementById("profileCity").value.trim(),
    address: document.getElementById("profileAddress").value.trim(),
    age: document.getElementById("profileAge").value.trim()
  };

  if (!profile.fullName || !profile.mobile || !profile.address) {
    setStatus("profileStatus", "Full name, contact number, and address are required.", true);
    showToast("Complete the required profile details.", "error");
    return;
  }

  try {
    await saveUserProfile(appState.user.uid, profile);
    appState.profile = { ...appState.profile, ...profile };
    updateNav();
    updateProfileForm();
    updateDashboard();
    setStatus("profileStatus", "Profile saved successfully.");
    showToast("Profile updated.", "success");
  } catch (error) {
    console.error(error);
    setStatus("profileStatus", "Profile could not be saved.", true);
    showToast("Profile save failed.", "error");
  }
}

function openBookingsSection() {
  if (!appState.isLoggedIn) {
    requireLogin("Please login to see your bookings.");
    return;
  }

  renderBookings();
  openDialog("bookingsDialog");
}

function openBookingFromDetails() {
  if (!appState.selectedPlace) {
    return;
  }
  startBookingFlow(appState.selectedPlace.name);
}

function toggleWishlist(placeName = appState.selectedPlace?.name) {
  if (!appState.isLoggedIn) {
    requireLogin("Login to save places in your wishlist.");
    return;
  }

  if (!placeName) {
    return;
  }

  if (appState.wishlist.includes(placeName)) {
    appState.wishlist = appState.wishlist.filter((item) => item !== placeName);
    showToast("Place removed from wishlist.", "info");
  } else {
    appState.wishlist.unshift(placeName);
    showToast("Place saved to wishlist.", "success");
  }

  saveWishlist();
  updateDashboard();
  renderCards();

  if (appState.selectedPlace?.name === placeName) {
    detailSaveBtn.innerText = appState.wishlist.includes(placeName) ? "Saved Place" : "Save Place";
  }
}

watchAuthState(async ({ user, profile }) => {
  appState.user = user;
  appState.profile = profile;
  appState.isLoggedIn = Boolean(user);

  if (appState.isLoggedIn) {
    appState.guestMode = false;
    localStorage.removeItem("travelGuestMode");
    hidePopup();
    loadWishlist();
    updateProfileForm();
    await syncBookings();
  } else {
    appState.bookings = [];
    appState.wishlist = [];
    renderBookings();
  }

  updateNav();
  updateDashboard();
  renderCards();

  if (!appState.isLoggedIn && !appState.guestMode) {
    openAuth();
  }

  if (appState.isLoggedIn && (!appState.profile?.fullName || !appState.profile?.mobile || !appState.profile?.address)) {
    openProfileSection();
  }
});

dialogIds.forEach((id) => {
  document.getElementById(id).addEventListener("click", (event) => {
    if (event.target.id === id) {
      closeDialog(id);
    }
  });
});

renderCards();
startHeroSlider();

window.openPlace = openPlace;
window.startBookingFlow = startBookingFlow;
window.openBookingFromDetails = openBookingFromDetails;
window.calculateTotal = calculateTotal;
window.openPayment = openPayment;
window.payNow = payNow;
window.goHome = goHome;
window.backToDetails = backToDetails;
window.backToBooking = backToBooking;
window.scrollToSection = scrollToSection;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.continueAsGuest = continueAsGuest;
window.showRegister = showRegister;
window.showLogin = showLogin;
window.signup = signup;
window.login = login;
window.logout = logout;
window.openProfileSection = openProfileSection;
window.saveProfile = saveProfile;
window.openBookingsSection = openBookingsSection;
window.closeDialog = closeDialog;
window.toggleWishlist = toggleWishlist;
