
document.addEventListener('DOMContentLoaded', async () => {
  const db = window.db;
  const thoughtsRef = firebase.firestore().collection("thoughts");

  const form = document.getElementById("thought-form");
  const input = document.getElementById("thought-input");
  const container = document.getElementById("thoughts");

  const userSelect = document.getElementById("user");
  const statusBar = document.getElementById("status-bar");

  // Estado base de la relación
  
  let status = 50;

  // Escuchar cambios en el estado de la relación
  firebase.firestore().collection("status").doc("relation").onSnapshot((doc) => {
    if (doc.exists) {
      status = doc.data().value;
      updateStatusBar();
    }
  });


  function updateStatusBar() {
    statusBar.style.width = status + "%";
    if (status < 30) {
      statusBar.style.backgroundColor = "#ff4d4d";
    } else if (status < 70) {
      statusBar.style.backgroundColor = "#ffcc00";
    } else {
      statusBar.style.backgroundColor = "#4CAF50";
    }
  }

  function renderThought(id, data) {
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
          
        await firebase.firestore().collection("thoughts").doc(id).update({ reaction: key });

        let statusChange = 0;
        if (key === "happy") statusChange = 10;
        if (key === "sad") statusChange = -10;
        if (key === "angry") statusChange = -20;

        const statusRef = firebase.firestore().collection("status").doc("relation");
        const currentStatusDoc = await statusRef.get();
        let newValue = status;
        if (currentStatusDoc.exists) {
          newValue = Math.max(0, Math.min(100, currentStatusDoc.data().value + statusChange));
        } else {
          newValue = Math.max(0, Math.min(100, 50 + statusChange));
        }
        await statusRef.set({ value: newValue });
    
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
    container.prepend(thoughtDiv);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newThought = {
      user: userSelect.value,
      text: input.value,
      timestamp: Date.now(),
      reaction: null
    };
    await firebase.firestore().collection("thoughts").add(newThought);
    input.value = "";
  });

  firebase.firestore().collection("thoughts").orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      container.innerHTML = "";
      snapshot.forEach((doc) => {
        renderThought(doc.id, doc.data());
      });
    });
});
