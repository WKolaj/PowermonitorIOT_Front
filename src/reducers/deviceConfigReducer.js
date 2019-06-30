import { DEVICE_CONFIG_CHANGE_TAB } from "../actions/types";

export default function(state = { tabNumber: 0 }, action) {
  switch (action.type) {
    case DEVICE_CONFIG_CHANGE_TAB: {
      return { ...state, tabNumber: action.payload.tabNumber };
    }
    default: {
      return state;
    }
  }
}
