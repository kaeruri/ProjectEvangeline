


















//BGM

const bgm = new Audio("Audios/AreYouAloneBGM.mp3");
bgm.loop = true;
bgm.volume = 0.4;

const gate = document.getElementById("audioGate");

function unlockAudio() {
  bgm.play().catch(() => {});
  localStorage.setItem("audioUnlocked", "true");

  // hide gate
  if (gate) gate.style.display = "none";

  // remove listener so it doesn't re-run
  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}

// If already unlocked from a previous page/session, skip the gate
if (localStorage.getItem("audioUnlocked") === "true") {
  bgm.play().catch(() => {});
  if (gate) gate.style.display = "none";
} else {
  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);
}