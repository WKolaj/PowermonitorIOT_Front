import { TREND_DIALOG_SHOW, TREND_DIALOG_HIDE } from "./types";
import TrendComponent from "../compoments/TrendComponent/TrendComponent";

export const showTrendDialogActionCreator = function(deviceId, variableId) {
  return {
    type: TREND_DIALOG_SHOW,
    payload: {
      deviceId: deviceId,
      variableId: variableId,
      trendId: TrendComponent.generateTrendId(deviceId, variableId)
    }
  };
};

export const hideTrendDialogActionCreator = function() {
  return {
    type: TREND_DIALOG_HIDE
  };
};
