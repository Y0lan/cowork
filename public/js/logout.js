import axios from 'axios';
import { showAlert } from './alerts';

export const logout = async (req, res) => {
  try {
    const res = await axios.get('/api/v1/users/logout', {
      withCredentials: true,
    });
    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
