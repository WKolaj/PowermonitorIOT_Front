import {
  TREND_CREATE,
  TREND_UPDATE,
  TREND_REMOVE,
  TREND_FETCH_CURRENT_VALUE,
  TREND_FETCH_HISTORY_VALUES,
  TREND_REFRESH
} from "../actions/types";
import {
  exists,
  isEmpty,
  tickNumberToDate,
  msToDate
} from "../utilities/utilities";

/**
 * @description Method for calculating ranges based on automatic mechanism of redux scaling
 * @param {Object} trendObject trend object inside redux store
 */
function calculateTrendRanges(trendObject) {
  let rangesToReturn = { ...trendObject.properties.ranges };
  if (
    trendObject.properties.autoRangeY &&
    exists(trendObject.data.extremes.valueMax) &&
    exists(trendObject.data.extremes.valueMin)
  ) {
    rangesToReturn.valueMax = trendObject.data.extremes.valueMax;
    rangesToReturn.valueMin = trendObject.data.extremes.valueMin;
  }

  if (
    trendObject.properties.autoRangeX &&
    exists(trendObject.data.extremes.timeMax) &&
    exists(trendObject.data.extremes.timeMin)
  ) {
    let currentRange =
      trendObject.properties.ranges.timeMax -
      trendObject.properties.ranges.timeMin;

    rangesToReturn.timeMax = trendObject.data.extremes.timeMax;
    rangesToReturn.timeMin = trendObject.data.extremes.timeMax - currentRange;
  }

  return rangesToReturn;
}

/**
 * @description Method for creating new extremes based on previous ones
 * @param {number} time
 * @param {object} value
 * @param {object} currentExtremes
 */
function createNewExtremes(time, value, currentExtremes) {
  let valueMin = currentExtremes.valueMin;
  let valueMax = currentExtremes.valueMax;
  let timeMin = currentExtremes.timeMin;
  let timeMax = currentExtremes.timeMax;

  let newExtremes = { ...currentExtremes };
  if (!exists(timeMax) || time > timeMax) newExtremes.timeMax = time;
  if (!exists(timeMin) || time < timeMin) newExtremes.timeMin = time;
  if (!exists(valueMax) || value > valueMax) newExtremes.valueMax = value;
  if (!exists(valueMin) || value < valueMin) newExtremes.valueMin = value;

  return newExtremes;
}

/**
 * @description Method for creating new extremes based on previous ones
 * @param {object} values
 * @param {object} currentExtremes
 */
function createNewExtremesFromValues(values, currentExtremes) {
  let newExtremes = { ...currentExtremes };

  for (let time of Object.keys(values)) {
    let value = values[time];
    newExtremes = createNewExtremes(parseInt(time), value, newExtremes);
  }
  return newExtremes;
}

export default function(state = {}, action) {
  switch (action.type) {
    case TREND_CREATE: {
      let {
        trendId,
        variableId,
        deviceId,
        initialAutoRangeX,
        initialAutoRangeY,
        currentValuesRefreshing,
        historyValuesRefreshing,
        initialRanges
      } = action.payload;

      //Creating initial properties
      let properties = {
        ranges: initialRanges,
        autoRangeX: exists(initialAutoRangeX) ? initialAutoRangeX : true,
        autoRangeY: exists(initialAutoRangeY) ? initialAutoRangeY : true,
        currentValuesRefreshing: exists(currentValuesRefreshing)
          ? currentValuesRefreshing
          : true,
        historyValuesRefreshing: exists(historyValuesRefreshing)
          ? historyValuesRefreshing
          : true
      };

      //Creating initial trend object
      let newTrendObject = {
        trendId,
        properties,
        variableId,
        deviceId,
        data: {
          values: {},
          extremes: {}
        },
        currentData: {
          values: {},
          extremes: {}
        },
        historyData: {
          values: {},
          extremes: {},
          fetchExtremes: {}
        }
      };
      return {
        ...state,
        [trendId]: newTrendObject
      };
    }

    case TREND_UPDATE: {
      let { trendId, properties } = action.payload;
      let oldTrend = state[trendId];

      let newProperties = {
        ...oldTrend.properties,
        ...properties,
        ranges: { ...oldTrend.properties.ranges }
      };

      //Setting new ranges if they exist
      if (exists(properties.ranges))
        newProperties.ranges = {
          ...oldTrend.properties.ranges,
          ...properties.ranges
        };

      let newTrend = {
        ...oldTrend,
        properties: newProperties
      };
      newTrend.properties.ranges = calculateTrendRanges(newTrend);
      return { ...state, [trendId]: newTrend };
    }

    case TREND_REMOVE: {
      let { trendId } = action.payload;
      let newState = { ...state };
      delete newState[trendId];

      return newState;
    }

    case TREND_FETCH_CURRENT_VALUE: {
      let { trendId, time, value } = action.payload;

      let oldTrend = state[trendId];

      //If value is still the same - comparing to previous refreshing - do not change anything
      if (time === oldTrend.currentData.lastTickId) return state;

      let newExtremes = createNewExtremes(
        time,
        value,
        state[trendId].data.extremes
      );

      //Calculating new current values
      let newCurrentValues = { ...oldTrend.currentData.values, [time]: value };
      let newCurrentData = {
        extremes: newExtremes,
        values: newCurrentValues,
        lastTickId: time
      };

      //Calculating new values
      let newValues = { ...oldTrend.data.values, [time]: value };
      let newData = { extremes: newExtremes, values: newValues };

      let newTrend = {
        ...oldTrend,
        data: newData,
        currentData: newCurrentData
      };
      newTrend.properties.ranges = calculateTrendRanges(newTrend);
      return { ...state, [trendId]: newTrend };
    }

    case TREND_FETCH_HISTORY_VALUES: {
      let {
        trendId,
        newFetchTimeMin,
        newFetchTimeMax,
        values
      } = action.payload;

      let oldTrend = state[trendId];
      //Calculating new fetch extremes
      let newFetchExtremes = {
        ...oldTrend.historyData.fetchExtremes,
        timeMin: newFetchTimeMin,
        timeMax: newFetchTimeMax
      };

      //Calulcating extremes from history data
      let newHistoryExtremes = createNewExtremesFromValues(
        values,
        state[trendId].historyData.extremes
      );

      //Calculating new history values
      let newHistoryValues = {
        ...oldTrend.historyData.values,
        ...values
      };
      let newHistoryData = {
        ...oldTrend.historyData,
        values: newHistoryValues,
        extremes: newHistoryExtremes,
        fetchExtremes: newFetchExtremes
      };

      //Calulcating extremes from data
      let newExtremes = createNewExtremesFromValues(
        values,
        state[trendId].data.extremes
      );

      //Calculating new values
      let newValues = { ...oldTrend.data.values, ...newHistoryValues };
      let newData = { extremes: newExtremes, values: newValues };

      let newTrend = {
        ...oldTrend,
        data: newData,
        historyData: newHistoryData
      };

      newTrend.properties.ranges = calculateTrendRanges(newTrend);

      return { ...state, [trendId]: newTrend };
    }

    default: {
      return state;
    }
  }
}
