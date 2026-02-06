const loginForm = document.querySelector('#LoginForm');
loginForm.addEventListener('submit', function (loginSubmissionEvent) {
    loginSubmissionEvent.preventDefault();

    const loginUsernameInput = document.querySelector('#username');
    const loginUsername = loginUsernameInput.value;
    const loginPasswordInput = document.querySelector('#password');
    const loginPassword = loginPasswordInput.value;

    const trimmedUsername = loginUsername.trim();


    const errorMessage = document.querySelector('#loginError');

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (!users[trimmedUsername]) {
        errorMessage.innerText = 'Username does not exist.';
        errorMessage.classList.remove('hidden');
        return;
    } else {
        errorMessage.classList.add('hidden');
    }

    if (users[trimmedUsername].password !== loginPassword) {
        errorMessage.innerText = 'Incorrect password.';
        errorMessage.classList.remove('hidden');
        return;
    } else {
        errorMessage.classList.add('hidden');
    }


    const saveKey = 'save_' + trimmedUsername;
    let save = JSON.parse(localStorage.getItem(saveKey));

    if (!save) {
    save = {
        storyProgress: 0,
        highestScore: 0,
        fastestClearTimeMs: null
    };
    localStorage.setItem(saveKey, JSON.stringify(save));
    }

    localStorage.setItem('currentUser', trimmedUsername);

    window.location.href = 'MainMenu.html';
});

//BGM

const bgm = new Audio("assets/audio/login_bgm.mp3");
bgm.loop = true;
bgm.volume = 0.35;

const gate = document.getElementById("audioGate");

function unlockAudio() {
  bgm.play().catch(() => {});
  if (gate) gate.style.display = "none";

  document.removeEventListener("click", unlockAudio);
  document.removeEventListener("keydown", unlockAudio);
}

// ALWAYS require a click
document.addEventListener("click", unlockAudio);
document.addEventListener("keydown", unlockAudio);


