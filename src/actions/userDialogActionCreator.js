import { SHOW_USER_DIALOG, HIDE_USER_DIALOG } from "./types";

export const showUserDialogActionCreator = function() {
  return {
    type: SHOW_USER_DIALOG
  };
};

export const hideUserDialogActionCreator = function() {
  return {
    type: HIDE_USER_DIALOG
  };
};
