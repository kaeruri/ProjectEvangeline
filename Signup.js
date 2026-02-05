const signupForm = document.querySelector('#SignUpForm');
signupForm.addEventListener('submit', function(signupSubmissionEvent) {
    signupSubmissionEvent.preventDefault();


    const signupUsernameInput = document.querySelector('#signup-username');
    const signupUsername = signupUsernameInput.value;
    const signupPasswordInput = document.querySelector('#signup-password');
    const signupPassword = signupPasswordInput.value;
    const signupConfirmPasswordInput = document.querySelector('#confirm-password');
    const signupConfirmPassword = signupConfirmPasswordInput.value;

    const trimmedUsername = signupUsername.trim();

    const errorMessage = document.querySelector('#signupError');

    if (trimmedUsername.length < 1) {
        errorMessage.innerText = 'Username cannot be empty.';
        errorMessage.classList.remove('hidden');
        return;
    } else {
        errorMessage.classList.add('hidden');
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[trimmedUsername]) {
        errorMessage.innerText = 'Username already exists. Please choose a different one.';
        errorMessage.classList.remove('hidden');
        return;
    } else {
        errorMessage.classList.add('hidden');
    }

    if (signupPassword.length < 6) {
        errorMessage.innerText = 'Password must be at least 6 characters long.';
        errorMessage.classList.remove('hidden');
        return;
    } else {
        errorMessage.classList.add('hidden');
    }

    if (!/\d/.test(signupPassword)) {
        errorMessage.innerText = 'Password must contain at least one number.';
        errorMessage.classList.remove('hidden');
        return;
    } else {
        errorMessage.classList.add('hidden');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(signupPassword)) {
        errorMessage.innerText = 'Password must contain at least one special character.';
        errorMessage.classList.remove('hidden');
        return;
    } else {
        errorMessage.classList.add('hidden');
    }

    if (signupPassword !== signupConfirmPassword) {
        errorMessage.innerText = 'Passwords do not match.';
        errorMessage.classList.remove('hidden');
        return;
    } else {
        errorMessage.classList.add('hidden');
    }

    users[trimmedUsername] = { password: signupPassword };
    localStorage.setItem('users', JSON.stringify(users));

    const saveKey = 'save_' + trimmedUsername;

    if (!localStorage.getItem(saveKey)) {
    const defaultSave = {
        storyProgress: 0,
        highestScore: 0,
        fastestClearTimeMs: null
    };

    localStorage.setItem(saveKey, JSON.stringify(defaultSave));
    }

    window.location.href = 'index.html';

});