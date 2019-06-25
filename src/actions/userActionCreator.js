import { login, logout, loginWithJWT } from "../services/authService";
import { LOGIN_USER, LOGOUT_USER, LOGIN_USER_WITH_JWT } from "./types";

export const loginUserWithJWTActionCreator = function(jwt) {
  let currentUser = loginWithJWT(jwt);
  return {
    type: LOGIN_USER_WITH_JWT,
    payload: {
      user: currentUser
    }
  };
};

export const loginUserActionCreator = function(userLogin, password) {
  return async function(dispatch, getState) {
    let currentUser = await login(userLogin, password);
    dispatch({
      type: LOGIN_USER,
      payload: {
        user: currentUser
      }
    });
  };
};

export const logoutUserActionCreator = function() {
  logout();
  return {
    type: LOGOUT_USER
  };
};
