import axios from 'axios';

const apiUrl = 'http://localhost:8080/api';
//const apiUrl = '/api';
const methods = ['get', 'post'];

function formatUrl(path) {
  return `${apiUrl}${path}`;
}

class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, data, config) => new Promise((resolve, reject) => {
          (method === 'get' ?
          axios[method](formatUrl(path), {withCredentials: true, ...config}) :
          axios[method](formatUrl(path), data, {withCredentials: true, ...config}))
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            reject(err);
          });
      });
      return this[method];
    });
  }
}

export default new ApiClient();