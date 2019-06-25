import { CHANGE_USER_LANGUAGE } from "./types";

export const changeUserLanguageActionCreator = function(language) {
  return {
    type: CHANGE_USER_LANGUAGE,
    payload: {
      lang: language
    }
  };
};
