import {
  SET_LAYOUT_BUSY,
  SET_LAYOUT_READY,
  LAYOUT_ACTIVATE_USER_CHECK,
  LAYOUT_DEACTIVATE_USER_CHECK
} from "../actions/types";

export default function(
  state = { busy: false, userCheckActive: false },
  action
) {
  switch (action.type) {
    case SET_LAYOUT_BUSY: {
      return { ...state, busy: true };
    }
    case SET_LAYOUT_READY: {
      return { ...state, busy: false };
    }
    case LAYOUT_ACTIVATE_USER_CHECK: {
      return { ...state, userCheckActive: true };
    }
    case LAYOUT_DEACTIVATE_USER_CHECK: {
      return { ...state, userCheckActive: false };
    }
    default: {
      return state;
    }
  }
}
