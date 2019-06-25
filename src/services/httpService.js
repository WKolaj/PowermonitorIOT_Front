import axios from "axios";

//Setting base URL for all requests
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

//Setting base mechanism for catching all expected errors
axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    //Logging inside console all unexpected errors
    let expectedResult =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedResult) console.log(error);
    return Promise.reject(error);
  }
);

const assignJWT = (headerName, jwt) => {
  axios.defaults.headers.common[headerName] = jwt;
};

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  assignJWT: assignJWT
};
