const currentUser = (localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

const saveKey = 'save_' + currentUser;
const saveData = JSON.parse(localStorage.getItem(saveKey));

const storyMode = document.querySelector('#story-mode-button');
storyMode.addEventListener('click', function () {
    window.location.href = 'Game.html';
});

const survivalMode = document.querySelector('#survival-mode-button');
survivalMode.addEventListener('click', function () {
    window.location.href = 'Game.html';
});

const leaderboardPage = document.querySelector('#leaderboard-button');
leaderboardPage.addEventListener('click', function () {
    window.location.href = 'LeaderboardPage.html';
});