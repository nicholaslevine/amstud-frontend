const API_URL = "https://amstud-repo-production.up.railway.app/query"; 

const bubbleTrans = document.getElementById("bubble-trans");
const input = document.getElementById("player-input");
const sendBtn = document.getElementById("send-btn");
const statusText = document.getElementById("status-text");

function showBubble(text) {
  bubbleTrans.textContent = text;
  bubbleTrans.style.height = ""; 
  bubbleTrans.classList.remove("visible");
  void bubbleTrans.offsetWidth;
  bubbleTrans.classList.add("visible");
}



showBubble(
  "The forest is quiet, yet it speaks of all the mysteries of the universe. What stirs in your mind today?"
);

async function sendMessage() {
  const text = input.value.trim();
  if (!text || sendBtn.disabled) return;

  input.value = "";
  statusText.textContent = "He listens to the wind, weighing your words...";
  sendBtn.disabled = true;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: text })
    });

    if (!res.ok) {
      let errTxt = "";
      try {
        const errData = await res.json();
        errTxt = errData.error || JSON.stringify(errData);
      } catch {
        errTxt = res.statusText;
      }
      throw new Error(errTxt || "Server error");
    }

    const data = await res.json();
    const reply =
      data.answer ||
      "(He looks around at the trees, as if the answer is in the silence itself.)";

    showBubble(reply);
    statusText.textContent = "";
  } catch (err) {
    console.error(err);
    showBubble(
      "Our thread to the greater intellect frayed for a moment. Try sharing your thought again."
    );
    statusText.textContent = "Error talking to the RAG backend: " + err.message;
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
