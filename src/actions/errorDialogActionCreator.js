import { SHOW_ERROR_DIALOG, HIDE_ERROR_DIALOG } from "./types";

export const showErrorDialogActionCreator = function(errorTitle, errorMessage) {
  return {
    type: SHOW_ERROR_DIALOG,
    payload: {
      error: {
        message: errorMessage,
        title: errorTitle
      }
    }
  };
};

export const hideErrorDialogActionCreator = function() {
  return {
    type: HIDE_ERROR_DIALOG
  };
};
