import { HIDE_DRAWER, SHOW_DRAWER } from "../actions/types";

export default function(state = { shown: false }, action) {
  switch (action.type) {
    case SHOW_DRAWER: {
      return { ...state, shown: true };
    }
    case HIDE_DRAWER: {
      return { ...state, shown: false };
    }
    default: {
      return state;
    }
  }
}
