
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, updateDoc, getDoc,
  onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAE6KTe1IaFdyyfJQ-ZJzH7zhxeVhldM-c",
  authDomain: "isabelandres-95b39.firebaseapp.com",
  projectId: "isabelandres-95b39",
  storageBucket: "isabelandres-95b39.appspot.com",
  messagingSenderId: "268223199536",
  appId: "1:268223199536:web:c240b62ff743fe3b9ab0f5",
  measurementId: "G-X0GTRFCHB2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById("thought-form");
  const input = document.getElementById("thought-input");
  const container = document.getElementById("thoughts");
  const userSelect = document.getElementById("user");
  const statusBar = document.getElementById("status-bar");

  function updateStatusBar(value) {
    statusBar.style.width = value + "%";
    if (value < 30) {
      statusBar.style.backgroundColor = "#ff4d4d";
    } else if (value < 70) {
      statusBar.style.backgroundColor = "#ffcc00";
    } else {
      statusBar.style.backgroundColor = "#4CAF50";
    }
  }

  const statusRef = doc(db, "status", "relation");
  onSnapshot(statusRef, (docSnap) => {
    if (docSnap.exists()) {
      updateStatusBar(docSnap.data().value);
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newThought = {
      user: userSelect.value,
      text: input.value,
      timestamp: Date.now(),
      reaction: null
    };
    await addDoc(collection(db, "thoughts"), newThought);
    input.value = "";
  });

  const thoughtsRef = collection(db, "thoughts");
  const q = query(thoughtsRef, orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    container.innerHTML = "";
    if (snapshot.empty) {
      const noThoughtsMsg = document.createElement("div");
      noThoughtsMsg.textContent = "Aún no hay pensamientos publicados.";
      noThoughtsMsg.style.color = "#aaa";
      noThoughtsMsg.style.textAlign = "center";
      noThoughtsMsg.style.marginTop = "20px";
      container.appendChild(noThoughtsMsg);
      return;
    }

    container.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      const thoughtDiv = document.createElement("div");
      thoughtDiv.classList.add("thought");

      const user = document.createElement("strong");
      user.textContent = data.user + ": ";
      thoughtDiv.appendChild(user);

      const text = document.createElement("span");
      text.textContent = data.text;
      thoughtDiv.appendChild(text);

      const timestamp = document.createElement("div");
      timestamp.style.fontSize = "0.8em";
      timestamp.style.color = "#888";
      const date = new Date(data.timestamp);
      timestamp.textContent = date.toLocaleString();
      thoughtDiv.appendChild(timestamp);

      const reactionDiv = document.createElement("div");
      reactionDiv.classList.add("reactions");

      const emojis = {
        happy: "😊",
        sad: "😢",
        angry: "😠"
      };

      Object.entries(emojis).forEach(([key, emoji]) => {
        const button = document.createElement("button");
        button.textContent = emoji;
        button.disabled = data.reaction ? true : false;
        button.addEventListener("click", async () => {
          if (!data.reaction) {
            await updateDoc(doc(db, "thoughts", id), { reaction: key });

            let statusChange = 0;
            if (key === "happy") statusChange = 10;
            if (key === "sad") statusChange = -10;
            if (key === "angry") statusChange = -20;

            const currentStatus = await getDoc(statusRef);
            let newValue = 50;
            if (currentStatus.exists()) {
              newValue = Math.max(0, Math.min(100, currentStatus.data().value + statusChange));
            } else {
              newValue = Math.max(0, Math.min(100, 50 + statusChange));
            }
            await updateDoc(statusRef, { value: newValue });
          }
        });
        reactionDiv.appendChild(button);
      });

      if (data.reaction) {
        const reacted = document.createElement("div");
        reacted.textContent = "Reacción: " + emojis[data.reaction];
        reactionDiv.appendChild(reacted);
      }

      thoughtDiv.appendChild(reactionDiv);
      container.appendChild(thoughtDiv);
    });
  });
});

window.addEventListener("error", function(event) {
  const container = document.getElementById("thoughts");
  const errorMsg = document.createElement("div");
  errorMsg.textContent = "Error al conectar con Firebase. Intenta más tarde.";
  errorMsg.style.color = "#ff6b6b";
  errorMsg.style.textAlign = "center";
  errorMsg.style.marginTop = "20px";
  container.appendChild(errorMsg);
});
