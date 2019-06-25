import {
  SET_LAYOUT_BUSY,
  SET_LAYOUT_READY,
  LAYOUT_ACTIVATE_USER_CHECK,
  LAYOUT_DEACTIVATE_USER_CHECK
} from "./types";

export const setLayoutBusyActionCreator = function() {
  return {
    type: SET_LAYOUT_BUSY
  };
};

export const setLayoutReadyActionCreator = function() {
  return {
    type: SET_LAYOUT_READY
  };
};

export const layoutActivateUserCheckActionCreator = function() {
  return {
    type: LAYOUT_ACTIVATE_USER_CHECK
  };
};

export const layoutDeactivateUserCheckActionCreator = function() {
  return {
    type: LAYOUT_DEACTIVATE_USER_CHECK
  };
};
