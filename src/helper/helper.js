import Axios from "axios";
Axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_SERVER_DOMAIN;

export async function SignUp(credentials) {
  try {
    const { data: { msg } } = await Axios.post('/api/register', credentials);
    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function loginUser(credentials) {
  try {
    const { data } = await Axios.post('/api/login', credentials);
    
    // Store user info in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(data.user));
    
    return Promise.resolve({ msg: data.msg });
  } catch (error) {
    return Promise.reject({ error: error.response.data.error });
  }
}

// Function to fetch prediction data
export async function fetchPrediction(data) {
  try {
    const response = await Axios.post('https://adef-35-233-243-168.ngrok-free.app/predict/gb', data);
    console.log(response.data);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject({ error: error.response.data.error });
  }
}


