import { DEVICE_CONFIG_CHANGE_TAB } from "./types";

export const changeTabActionCreator = function(tabNumber) {
  return {
    type: DEVICE_CONFIG_CHANGE_TAB,
    payload: {
      tabNumber
    }
  };
};
