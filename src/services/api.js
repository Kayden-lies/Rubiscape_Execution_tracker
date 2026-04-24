import axios from 'axios';

const api = axios.create({
  baseURL: 'https://execution-tracker.onrender.com/api/v1',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.assign('/login');
    }

    const message =
      error?.response?.data?.message ||
      (status >= 500 ? 'Server error. Please try again.' : error.message);

    window.dispatchEvent(
      new CustomEvent('app:error', {
        detail: {
          message,
          status,
        },
      }),
    );

    return Promise.reject(error);
  },
);

export default api;
