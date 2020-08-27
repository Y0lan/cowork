import '@babel/polyfill';
import { login } from './login';
import { signup } from './signup';
import { logout } from './logout';

const loginForm = document.querySelector('#login');
const signupForm = document.querySelector('#signup');
const logOutButton = document.querySelector('#logout');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    signup(`${firstname} ${lastname}`, email, password);
  });
}

if (logOutButton) {
  logOutButton.addEventListener('click', logout);
}
