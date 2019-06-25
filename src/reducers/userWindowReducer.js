import { HIDE_USER_WINDOW, SHOW_USER_WINDOW } from "../actions/types";

export default function(state = { shown: false }, action) {
  switch (action.type) {
    case SHOW_USER_WINDOW: {
      return { ...state, shown: true };
    }
    case HIDE_USER_WINDOW: {
      return { ...state, shown: false };
    }
    default: {
      return state;
    }
  }
}
