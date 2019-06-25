import { CHANGE_USER_LANGUAGE } from "../actions/types";

export default function(state = { lang: "pl" }, action) {
  switch (action.type) {
    case CHANGE_USER_LANGUAGE: {
      return { ...state, lang: action.payload.lang };
    }
    default: {
      return state;
    }
  }
}
