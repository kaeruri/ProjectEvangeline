const currentUser = (localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'Login.html';
}

const saveKey = 'save_' + currentUser;
const saveData = JSON.parse(localStorage.getItem(saveKey));

