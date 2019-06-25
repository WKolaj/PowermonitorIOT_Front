import { HIDE_LANGUAGE_WINDOW, SHOW_LANGUAGE_WINDOW } from "../actions/types";

export default function(state = { shown: false }, action) {
  switch (action.type) {
    case SHOW_LANGUAGE_WINDOW: {
      return { ...state, shown: true };
    }
    case HIDE_LANGUAGE_WINDOW: {
      return { ...state, shown: false };
    }
    default: {
      return state;
    }
  }
}
