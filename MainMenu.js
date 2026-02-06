const currentUser = (localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

const saveKey = 'save_' + currentUser;
const saveData = JSON.parse(localStorage.getItem(saveKey));

const storyMode = document.querySelector('#story-mode-button');
storyMode.addEventListener('click', function () {
    localStorage.setItem("gameMode", "story")
    window.location.href = 'Game.html';
});

const survivalMode = document.querySelector('#survival-mode-button');
survivalMode.addEventListener('click', function () {
    localStorage.setItem("gameMode", "survival")
    window.location.href = 'Game.html';
});

const leaderboardPage = document.querySelector('#leaderboard-button');
leaderboardPage.addEventListener('click', function () {
    window.location.href = 'LeaderboardPage.html';
});


//Animations

document.addEventListener("DOMContentLoaded", () => {
  const menuButtons = document.querySelectorAll("#StartingNavLinks button");

  menuButtons.forEach(button => {
    button.addEventListener("mouseenter", () => {
      button.classList.add("pop");
    });

    button.addEventListener("mouseleave", () => {
      button.classList.remove("pop");
    });
  });
});

console.log(document.querySelectorAll("#StartingNavLinks button"));

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
