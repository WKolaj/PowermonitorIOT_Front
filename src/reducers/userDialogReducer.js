import { HIDE_USER_DIALOG, SHOW_USER_DIALOG } from "../actions/types";

export default function(state = { shown: false }, action) {
  switch (action.type) {
    case SHOW_USER_DIALOG: {
      return { ...state, shown: true };
    }
    case HIDE_USER_DIALOG: {
      return { ...state, shown: false };
    }
    default: {
      return state;
    }
  }
}
