// --- elements ---
const speakBtn = document.getElementById("speakBtn");
const conversationDiv = document.getElementById("conversation");

// --- support check ---
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SR) {
  addMessage(
    "Error",
    "SpeechRecognition is not supported in this browser. Try Chrome.",
  );
}

// --- setup recognition ---
const recognition = SR ? new SR() : null;
if (recognition) {
  recognition.lang = "fr-FR";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.addEventListener("result", (e) => {
    const i = e.resultIndex;
    const userText = e.results[i][0].transcript.trim();
    console.log("onresult:", userText);
    addMessage("Vous", userText);

    // TODO: replace this with your real AI call later
    const aiResponse = "Bonjour ! Je t'écoute.";
    addMessage("AI", aiResponse);
    speak(aiResponse);
  });

  recognition.addEventListener("error", (e) => {
    console.error("Speech error:", e.error);
    addMessage("Error", `Speech error: ${e.error}`);
  });

  recognition.addEventListener("end", () => {
    console.log("recognition ended");
    addMessage("System", "🎤 Micro arrêté");
  });
}

// --- button click ---
speakBtn.addEventListener("click", () => {
  if (!recognition) return;
  addMessage("System", "🎤 J’écoute… parlez !");
  try {
    recognition.start();
  } catch (err) {
    // start() can throw if already started
    console.warn("start() error:", err);
  }
});

// --- helpers ---
function addMessage(sender, text) {
  const p = document.createElement("p");
  p.textContent = `${sender}: ${text}`;
  conversationDiv.appendChild(p);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  // Try to pick a French voice if available
  const pickVoice = () => {
    const voices = speechSynthesis.getVoices();
    const fr = voices.find((v) =>
      (v.lang || "").toLowerCase().startsWith("fr"),
    );
    if (fr) utter.voice = fr;
    speechSynthesis.speak(utter);
  };
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.addEventListener("voiceschanged", pickVoice, {
      once: true,
    });
  } else {
    pickVoice();
  }
}
