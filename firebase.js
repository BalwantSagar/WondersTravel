import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

const USERS_COLLECTION = "users";
const BOOKINGS_COLLECTION = "bookings";

function localBookingsKey(uid) {
  return `wonderstravel_bookings_${uid}`;
}

function readLocalBookings(uid) {
  try {
    return JSON.parse(localStorage.getItem(localBookingsKey(uid)) || "[]");
  } catch {
    return [];
  }
}

function writeLocalBookings(uid, bookings) {
  localStorage.setItem(localBookingsKey(uid), JSON.stringify(bookings));
}

function sanitizeProfile(profile) {
  return {
    fullName: profile.fullName || "",
    mobile: profile.mobile || "",
    address: profile.address || "",
    city: profile.city || "",
    age: profile.age || "",
    email: profile.email || "",
    updatedAt: serverTimestamp()
  };
}

export async function registerUser(profile) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    profile.email,
    profile.password
  );

  if (profile.fullName) {
    await updateProfile(credential.user, { displayName: profile.fullName });
  }

  await setDoc(
    doc(db, USERS_COLLECTION, credential.user.uid),
    {
      ...sanitizeProfile(profile),
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function saveUserProfile(uid, profile) {
  const payload = sanitizeProfile(profile);

  try {
    await setDoc(doc(db, USERS_COLLECTION, uid), payload, { merge: true });
  } catch (error) {
    console.error("Profile sync failed:", error);
  }

  localStorage.setItem(`wonderstravel_profile_${uid}`, JSON.stringify(profile));
}

export async function fetchUserProfile(uid) {
  let remoteProfile = null;

  try {
    const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
    remoteProfile = snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error("Profile fetch failed:", error);
  }

  const localProfile = JSON.parse(
    localStorage.getItem(`wonderstravel_profile_${uid}`) || "null"
  );

  return { ...(remoteProfile || {}), ...(localProfile || {}) };
}

export async function createBooking(uid, booking) {
  const localBooking = {
    id: `local_${Date.now()}`,
    uid,
    placeName: booking.placeName,
    days: booking.days,
    people: booking.people,
    cabLabel: booking.cabLabel,
    cabPrice: booking.cabPrice,
    total: booking.total,
    travelerName: booking.travelerName,
    contactNumber: booking.contactNumber,
    departureDate: booking.departureDate,
    address: booking.address || "",
    createdAt: new Date(),
    syncSource: "local"
  };

  const existing = readLocalBookings(uid);
  writeLocalBookings(uid, [localBooking, ...existing]);

  try {
    const remotePayload = {
      uid,
      placeName: booking.placeName,
      days: booking.days,
      people: booking.people,
      cabLabel: booking.cabLabel,
      cabPrice: booking.cabPrice,
      total: booking.total,
      travelerName: booking.travelerName,
      contactNumber: booking.contactNumber,
      departureDate: booking.departureDate,
      address: booking.address || "",
      createdAt: serverTimestamp()
    };

    const ref = await addDoc(collection(db, BOOKINGS_COLLECTION), remotePayload);
    return {
      ...localBooking,
      id: ref.id,
      syncSource: "firebase"
    };
  } catch (error) {
    console.error("Booking sync failed:", error);
    return localBooking;
  }
}

export async function fetchUserBookings(uid) {
  let remoteBookings = [];

  try {
    const bookingQuery = query(
      collection(db, BOOKINGS_COLLECTION),
      where("uid", "==", uid)
    );

    const snapshot = await getDocs(bookingQuery);
    remoteBookings = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
        syncSource: "firebase"
      };
    });
  } catch (error) {
    console.error("Booking fetch failed:", error);
  }

  const localBookings = readLocalBookings(uid).map((booking) => ({
    ...booking,
    createdAt: booking.createdAt ? new Date(booking.createdAt) : null,
    syncSource: booking.syncSource || "local"
  }));

  const merged = [...remoteBookings];
  const seen = new Set(
    remoteBookings.map((booking) => {
      return [
        booking.placeName,
        booking.departureDate,
        booking.total,
        booking.contactNumber
      ].join("|");
    })
  );

  localBookings.forEach((booking) => {
    const signature = [
      booking.placeName,
      booking.departureDate,
      booking.total,
      booking.contactNumber
    ].join("|");

    if (!seen.has(signature)) {
      merged.push(booking);
    }
  });

  return merged.sort((left, right) => {
    const leftTime = left.createdAt ? left.createdAt.getTime() : 0;
    const rightTime = right.createdAt ? right.createdAt.getTime() : 0;
    return rightTime - leftTime;
  });
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback({ user: null, profile: null });
      return;
    }

    let profile = null;

    try {
      profile = await fetchUserProfile(user.uid);
    } catch (error) {
      console.error("Auth profile bootstrap failed:", error);
    }

    callback({ user, profile });
  });
}
