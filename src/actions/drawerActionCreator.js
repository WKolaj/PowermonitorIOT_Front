import { HIDE_DRAWER, SHOW_DRAWER } from "./types";

export const showDrawerActionCreator = function() {
  return {
    type: SHOW_DRAWER
  };
};

export const hideDrawerActionCreator = function() {
  return {
    type: HIDE_DRAWER
  };
};
