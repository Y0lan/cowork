import '@babel/polyfill';
import { login } from './login';
import { signup } from './signup';
import { logout } from './logout';
import { updateSettings } from './updateSettings';
import { subscribeUser } from './stripe'

const loginForm = document.querySelector('#login');
const signupForm = document.querySelector('#signup');
const userSettingsForm = document.querySelector('#user-settings');
const userPasswordForm = document.querySelector('#password-form');
const logOutButton = document.querySelector('#logout');
const subscribeButton = document.getElementsByClassName('subscribe-button')

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

if (userSettingsForm) {
  userSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];
    form.append('name', name);
    form.append('email', email);
    form.append('photo', photo);
    await updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password-new').value;
    await updateSettings(
      {
        current: currentPassword,
        new: newPassword,
      },
      'password'
    );
  });
}

if(subscribeButton.length > 0){
  for (let btn of subscribeButton) {
    btn.addEventListener('click', async e => {
      e.target.textContent = 'Processing...'
      const { subscriptionType } = e.target.dataset;
      await subscribeUser(subscriptionType)
    })
  }
}
