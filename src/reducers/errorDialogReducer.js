import { HIDE_ERROR_DIALOG, SHOW_ERROR_DIALOG } from "../actions/types";

export default function(state = { shown: false }, action) {
  switch (action.type) {
    case SHOW_ERROR_DIALOG: {
      return { ...state, shown: true, error: action.payload.error };
    }
    case HIDE_ERROR_DIALOG: {
      return { ...state, shown: false, error: null };
    }
    default: {
      return state;
    }
  }
}
