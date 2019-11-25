import axios from 'axios';
/**
 * Sets up token header to be sent with every request
 * @param {*} token 
 */
const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;