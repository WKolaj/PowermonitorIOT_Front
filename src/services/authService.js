import jwtDecode from "jwt-decode";
import http from "./httpService";
import config from "../config.json";

const authTokenName = config["authTokenName"];
const authRoute = config["authRoute"];

//Purely for testing - to remove later -- start

// const generateTestUser = login => {
//   return {
//     login: login,
//     permissions: 15,
//     lang: "pl"
//   };
// };

// const generateToken = user => {
//   return jwt.sign(user, "TestPrivateKey");
// };

//Purely for testing - to remove later -- stop

export async function login(login, password) {
  let result = await http.post(authRoute, {
    login: login,
    password: password
  });
  let jwt = result.headers[authTokenName];

  return loginWithJWT(jwt);
}

export function getCurrentUser() {
  let jwt = localStorage.getItem(authTokenName);
  return jwtDecode(jwt);
}

export function getCurrentJWT() {
  return localStorage.getItem(authTokenName);
}

export function loginWithJWT(jwt) {
  localStorage.setItem(authTokenName, jwt);
  //Assigning JWT to every header in axios
  http.assignJWT(authTokenName, jwt);
  return getCurrentUser();
}

export function logout() {
  localStorage.removeItem(authTokenName);
}
