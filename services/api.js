import axios from 'axios';

let token;

if(process.browser && localStorage.tokenIndie4All) {
    token = `Bearer ${JSON.parse(localStorage.tokenIndie4All)}`;
}else {
    token = null
}

const api = axios.create({ baseURL: 'http://localhost:3333', headers: {
    authorization: token
} });
export default api;