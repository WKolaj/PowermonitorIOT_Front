import {
  TREND_CREATE,
  TREND_REMOVE,
  TREND_UPDATE,
  TREND_ADD_POINT,
  TREND_ADD_POINTS,
  TREND_FETCH_CURRENT_VALUE,
  TREND_FETCH_HISTORY_VALUES
} from "./types";
import valuesService from "../services/valuesService";
import {
  dateToMs,
  msToDate,
  exists,
  isEmpty,
  tickNumberToMs,
  msToTickNumber
} from "../utilities/utilities";

/**
 * @description Mehtod for genereting ranges based on ranges given to action creator
 * @param {object} initialRanges initial ranges form arguments
 */
function generateInitialRanges(initialRanges) {
  //Generating initial ranges
  let rangesToReturn = {
    valueMin: 0,
    valueMax: 100,
    timeMin: Date.now() - 60000,
    timeMax: Date.now()
  };

  //Returning if initialRanges are empty
  if (!exists(initialRanges) || isEmpty(initialRanges)) return rangesToReturn;

  if (exists(initialRanges.valueMin) && exists(initialRanges.valueMax)) {
    rangesToReturn.valueMin = initialRanges.valueMin;
    rangesToReturn.valueMax = initialRanges.valueMax;
  }

  if (exists(initialRanges.timeMin) && exists(initialRanges.timeMax)) {
    rangesToReturn.timeMin = dateToMs(initialRanges.timeMin);
    rangesToReturn.timeMax = dateToMs(initialRanges.timeMax);
  }

  return rangesToReturn;
}

export const createTrendActionCreator = function(
  trendId,
  variableId,
  deviceId,
  initialAutoRangeX,
  initialAutoRangeY,
  currentValuesRefreshing,
  historyValuesRefreshing,
  initialRanges
) {
  return {
    type: TREND_CREATE,
    payload: {
      trendId,
      variableId,
      deviceId,
      initialAutoRangeX,
      initialAutoRangeY,
      currentValuesRefreshing,
      historyValuesRefreshing,
      initialRanges: generateInitialRanges(initialRanges)
    }
  };
};

export const updateTrendActionCreator = function(trendId, properties) {
  return {
    type: TREND_UPDATE,
    payload: {
      trendId,
      properties
    }
  };
};

export const removeTrendActionCreator = function(trendId) {
  return {
    type: TREND_REMOVE,
    payload: {
      trendId: trendId
    }
  };
};

export const fetchCurrentValueActionCreator = function(
  trendId,
  variableId,
  deviceId
) {
  return async (dispatch, getState) => {
    try {
      let valueObject = await valuesService.getValue(deviceId, variableId);
      if (!exists(valueObject) || isEmpty(valueObject)) return;

      let tickId = Object.keys(valueObject)[0];

      let value = valueObject[tickId];
      let time = tickNumberToMs(tickId);

      dispatch({
        type: TREND_FETCH_CURRENT_VALUE,
        payload: {
          trendId,
          time,
          value
        }
      });
    } catch (err) {}
  };
};

export const fetchHistoryValuesActionCreator = function(
  trendId,
  variableId,
  deviceId
) {
  return async function(dispatch, getState) {
    try {
      let stateObject = getState();
      let trendObject = stateObject["trends"][trendId];

      //Getting current time setting values
      let {
        timeMin: rangesTimeMin,
        timeMax: rangesTimeMax
      } = trendObject.properties.ranges;
      let {
        timeMin: fetchTimeMin,
        timeMax: fetchTimeMax
      } = trendObject.historyData.fetchExtremes;
      let {
        timeMin: currentTimeMin,
        timeMax: currentTimeMax
      } = trendObject.currentData.extremes;

      //Setting new fetch range
      let newFetchTimeMin = rangesTimeMin;
      let newFetchTimeMax = rangesTimeMax;

      //If new range is bigger than current Min time - cut it to currentMinTime
      if (exists(currentTimeMin) && newFetchTimeMax > currentTimeMin)
        newFetchTimeMax = currentTimeMin;

      //Checking also minFetchTime
      if (exists(currentTimeMin) && newFetchTimeMin > currentTimeMin)
        newFetchTimeMin = currentTimeMin;

      //Checking if new range is the same or smaller than preivious one - if so do no change anything
      if (newFetchTimeMin >= fetchTimeMin && newFetchTimeMax <= fetchTimeMax)
        return;

      let valueObject = await valuesService.getValues(
        deviceId,
        variableId,
        msToTickNumber(newFetchTimeMin),
        msToTickNumber(newFetchTimeMax)
      );

      if (!exists(valueObject) || isEmpty(valueObject)) return;

      //Converting values from request tickids to ms
      let valuesToReturn = {};
      let allTickIds = Object.keys(valueObject);
      for (let tickId of allTickIds) {
        valuesToReturn[tickNumberToMs(tickId)] = valueObject[tickId];
      }

      dispatch({
        type: TREND_FETCH_HISTORY_VALUES,
        payload: {
          trendId,
          newFetchTimeMin,
          newFetchTimeMax,
          values: valuesToReturn
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const refreshActionCreator = function(trendId, variableId, deviceId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];

    if (trendObject.properties.currentValuesRefreshing) {
      dispatch(fetchCurrentValueActionCreator(trendId, variableId, deviceId));
    }
    if (trendObject.properties.historyValuesRefreshing) {
      dispatch(fetchHistoryValuesActionCreator(trendId, variableId, deviceId));
    }
  };
};

export const xZoomInActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];

    let timeMin = trendObject.properties.ranges.timeMin;
    let timeMax = trendObject.properties.ranges.timeMax;
    let halfOfNewRange = (0.9 * (timeMax - timeMin)) / 2;
    let middlePoint = timeMin + (timeMax - timeMin) / 2;

    dispatch(
      updateTrendActionCreator(trendId, {
        ranges: {
          timeMin: middlePoint - halfOfNewRange,
          timeMax: middlePoint + halfOfNewRange
        }
      })
    );
  };
};

export const xZoomOutActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];

    let timeMin = trendObject.properties.ranges.timeMin;
    let timeMax = trendObject.properties.ranges.timeMax;
    let halfOfNewRange = (1.1 * (timeMax - timeMin)) / 2;
    let middlePoint = timeMin + (timeMax - timeMin) / 2;

    dispatch(
      updateTrendActionCreator(trendId, {
        ranges: {
          timeMin: middlePoint - halfOfNewRange,
          timeMax: middlePoint + halfOfNewRange
        }
      })
    );
  };
};

export const yZoomInActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];

    let valueMin = trendObject.properties.ranges.valueMin;
    let valueMax = trendObject.properties.ranges.valueMax;
    let halfOfNewRange = (0.9 * (valueMax - valueMin)) / 2;
    let middlePoint = valueMin + (valueMax - valueMin) / 2;

    dispatch(
      updateTrendActionCreator(trendId, {
        ranges: {
          valueMin: middlePoint - halfOfNewRange,
          valueMax: middlePoint + halfOfNewRange
        }
      })
    );
  };
};

export const yZoomOutActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];

    let valueMin = trendObject.properties.ranges.valueMin;
    let valueMax = trendObject.properties.ranges.valueMax;
    let halfOfNewRange = (1.1 * (valueMax - valueMin)) / 2;
    let middlePoint = valueMin + (valueMax - valueMin) / 2;

    dispatch(
      updateTrendActionCreator(trendId, {
        ranges: {
          valueMin: middlePoint - halfOfNewRange,
          valueMax: middlePoint + halfOfNewRange
        }
      })
    );
  };
};

export const xMoveLeftActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];
    let timeMin = trendObject.properties.ranges.timeMin;
    let timeMax = trendObject.properties.ranges.timeMax;
    let moveUnit = (timeMax - timeMin) * 0.1;

    dispatch(
      updateTrendActionCreator(trendId, {
        ranges: {
          timeMin: timeMin - moveUnit,
          timeMax: timeMax - moveUnit
        }
      })
    );
  };
};

export const xMoveRightActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];
    let timeMin = trendObject.properties.ranges.timeMin;
    let timeMax = trendObject.properties.ranges.timeMax;
    let moveUnit = (timeMax - timeMin) * 0.1;

    dispatch(
      updateTrendActionCreator(trendId, {
        ranges: {
          timeMin: timeMin + moveUnit,
          timeMax: timeMax + moveUnit
        }
      })
    );
  };
};

export const yMoveUpActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];
    let valueMin = trendObject.properties.ranges.valueMin;
    let valueMax = trendObject.properties.ranges.valueMax;
    let moveUnit = (valueMax - valueMin) * 0.1;

    dispatch(
      updateTrendActionCreator(trendId, {
        ranges: {
          valueMin: valueMin + moveUnit,
          valueMax: valueMax + moveUnit
        }
      })
    );
  };
};

export const yMoveDownActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];
    let valueMin = trendObject.properties.ranges.valueMin;
    let valueMax = trendObject.properties.ranges.valueMax;
    let moveUnit = (valueMax - valueMin) * 0.1;

    dispatch(
      updateTrendActionCreator(trendId, {
        ranges: {
          valueMin: valueMin - moveUnit,
          valueMax: valueMax - moveUnit
        }
      })
    );
  };
};

export const disableXAutoRangeActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    dispatch(updateTrendActionCreator(trendId, { autoRangeX: false }));
  };
};

export const enableXAutoRangeActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    dispatch(updateTrendActionCreator(trendId, { autoRangeX: true }));
  };
};

export const disableYAutoRangeActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    dispatch(updateTrendActionCreator(trendId, { autoRangeY: false }));
  };
};

export const enableYAutoRangeActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    dispatch(updateTrendActionCreator(trendId, { autoRangeY: true }));
  };
};

export const toogleXAutoRangeActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];
    if (trendObject.properties.autoRangeX)
      dispatch(disableXAutoRangeActionCreator(trendId));
    else dispatch(enableXAutoRangeActionCreator(trendId));
  };
};

export const toogleYAutoRangeActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    let trendObject = stateObject["trends"][trendId];
    if (trendObject.properties.autoRangeY)
      dispatch(disableYAutoRangeActionCreator(trendId));
    else dispatch(enableYAutoRangeActionCreator(trendId));
  };
};

export const stopRefreshingCurrentValuesActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    dispatch(
      updateTrendActionCreator(trendId, { currentValuesRefreshing: false })
    );
  };
};

export const startRefreshingCurrentValuesActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    dispatch(
      updateTrendActionCreator(trendId, { currentValuesRefreshing: true })
    );
  };
};

export const stopRefreshingHistoryValuesActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    dispatch(
      updateTrendActionCreator(trendId, { historyValuesRefreshing: false })
    );
  };
};

export const startRefreshingHistoryValuesActionCreator = function(trendId) {
  return async function(dispatch, getState) {
    dispatch(
      updateTrendActionCreator(trendId, { historyValuesRefreshing: true })
    );
  };
};
