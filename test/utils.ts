import { default as axios } from 'axios';
export { default as axios } from 'axios';

export function axiosStatusError(status: number) {
  return 'Request failed with status code ' + status;
}

export function setBaseUrl() {
  axios.defaults.baseURL = 'http://localhost:8000';
}
