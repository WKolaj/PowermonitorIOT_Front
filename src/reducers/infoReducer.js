import { FETCH_INFO } from "../actions/types";

export default function(state = { info: null }, action) {
  switch (action.type) {
    case FETCH_INFO: {
      return {
        ...state,
        info: action.payload.info
      };
    }
    default: {
      return state;
    }
  }
}
