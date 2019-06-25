import { HIDE_USER_WINDOW, SHOW_USER_WINDOW } from "./types";

export const showUserWindowActionCreator = function() {
  return {
    type: SHOW_USER_WINDOW
  };
};

export const hideUserWindowActionCreator = function() {
  return {
    type: HIDE_USER_WINDOW
  };
};
