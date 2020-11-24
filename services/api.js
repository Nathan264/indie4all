import axios from 'axios';

let token;

if(process.browser && localStorage.tokenIndie4All) {
    token = `Bearer ${JSON.parse(localStorage.tokenIndie4All)}`;
}else {
    token = null
}

const api = axios.create({ baseURL: 'https://indie4allbe.herokuapp.com/', headers: {
    authorization: token
} });
export default api;