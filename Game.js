//BGM

const bgm = new Audio("Audios/AreYouAloneBGM.mp3");
bgm.loop = true;
bgm.volume = 0.35;

const gate = document.getElementById("audioGate");

function unlockAudio() {
  bgm.play().catch(() => {});

  sessionStorage.setItem("audioUnlocked", "true");

  if (gate) gate.style.display = "none";

  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
  document.removeEventListener("touchstart", unlockAudio);
}

// If already unlocked this session, try to play + hide gate
if (sessionStorage.getItem("audioUnlocked") === "true") {
  bgm.play().catch(() => {});
  if (gate) gate.style.display = "none";
} else {
  // Need user gesture first
  document.addEventListener("click", unlockAudio);
  document.addEventListener("keydown", unlockAudio);
  document.addEventListener("touchstart", unlockAudio, { passive: true });
}