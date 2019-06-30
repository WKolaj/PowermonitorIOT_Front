import { TREND_DIALOG_SHOW, TREND_DIALOG_HIDE } from "../actions/types";

export default function(state = { shown: false }, action) {
  switch (action.type) {
    case TREND_DIALOG_SHOW: {
      return {
        ...state,
        shown: true,
        trendId: action.payload.trendId,
        variableId: action.payload.variableId,
        deviceId: action.payload.deviceId
      };
    }
    case TREND_DIALOG_HIDE: {
      return { ...state, shown: false };
    }
    default: {
      return state;
    }
  }
}
