import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

// Initialize CSRF token
const initCSRF = async () => {
  try {
    const response = await fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      console.warn('CSRF cookie endpoint not available, trying alternative method');
      // Alternative: just make a basic request to establish session
      await fetch('/', {
        method: 'GET',
        credentials: 'include',
      });
    }
  } catch (error) {
    console.warn('CSRF cookie initialization failed:', error);
    try {
      // Fallback: make a basic request to establish session
      await fetch('/', {
        method: 'GET',
        credentials: 'include',
      });
    } catch (fallbackError) {
      console.warn('Fallback CSRF initialization also failed:', fallbackError);
    }
  }
};

// Initialize on load
initCSRF();
