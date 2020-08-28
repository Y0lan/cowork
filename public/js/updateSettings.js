import axios from 'axios';
import { showAlert } from './alerts.js';
// type:
// - password
// - data
export const updateSettings = async (data, type) => {
  try {
    console.log(data);
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    //TODO send email verification
    const res = await axios.patch(url, data);

    if (res.data.status === 'success') {
      showAlert('success', `information updated ! 🥰`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
