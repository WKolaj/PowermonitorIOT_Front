import { HIDE_LANGUAGE_WINDOW, SHOW_LANGUAGE_WINDOW } from "./types";

export const showLanguageWindowActionCreator = function() {
  return {
    type: SHOW_LANGUAGE_WINDOW
  };
};

export const hideLanguageWindowActionCreator = function() {
  return {
    type: HIDE_LANGUAGE_WINDOW
  };
};
