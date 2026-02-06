function formatTimeMs(ms) {
  if (ms == null) return "—";

  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/*Personal Best Section*/

function renderPersonalBest() {
  const user = localStorage.getItem("currentUser");
  if (!user) return;

  const saveKey = "save_" + user;
  const saveData = JSON.parse(localStorage.getItem(saveKey));

  document.querySelector("#PBUser").textContent = user;

  if (!saveData) {
    document.querySelector("#PBHighScore").textContent = "—";
    document.querySelector("#PBFastestTime").textContent = "—";
    return;
  }

  const bestScore = saveData.highestScore ?? 0;
  const bestTime = saveData.fastestClearTimeMs ?? null;

  document.querySelector("#PBHighScore").textContent = bestScore > 0 ? bestScore : "—";
  document.querySelector("#PBFastestTime").textContent = formatTimeMs(bestTime);
}


/*Leaderboard Section*/

function renderTop3() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  for (let rank = 1; rank <= 3; rank++) {
    const entry = leaderboard[rank - 1];

    const playerEl = document.querySelector(`#Player${rank}`);
    const timeEl = document.querySelector(`#Time${rank}`);
    const scoreEl = document.querySelector(`#Score${rank}`);

    if (!playerEl || !timeEl || !scoreEl) continue; // safety

    if (!entry) {
      playerEl.textContent = "—";
      timeEl.textContent = "—";
      scoreEl.textContent = "—";
    } else {
      playerEl.textContent = entry.username ?? "—";
      timeEl.textContent = formatTimeMs(entry.timeMs);
      scoreEl.textContent = entry.score ?? "—";
    }
  }
}

renderPersonalBest();
renderTop3();

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