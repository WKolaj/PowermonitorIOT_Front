import {
  DATA_FETCH_DEVICES,
  DATA_REFRESH_CONNECTIONS,
  DATA_FETCH_DEVICE,
  DATA_FETCH_VARIABLE,
  DATA_FETCH_CALCELEMENT,
  DATA_FETCH_VARIABLES,
  DATA_FETCH_CALCELEMENTS,
  DATA_FETCH_VALUES
} from "./types";
import { getAllDevices, getDevice } from "../services/devicesService";
import { getVariable, getAllVariables } from "../services/variablesService";
import valuesService from "../services/valuesService";
import {
  getCalcElements,
  getAllCalcElements
} from "../services/calcElementsService";
import { exists, arrayToObject } from "../utilities/utilities";

export const fetchDevicesActionCreator = function() {
  return async function(dispatch, getState) {
    try {
      let devices = await getAllDevices();

      let devicesToReturn = {};

      for (let device of devices) {
        //Converting arrays to collection objects
        device.variables = arrayToObject(device.variables);
        device.calculationElements = arrayToObject(device.calculationElements);

        devicesToReturn[device.id] = device;
      }

      dispatch({
        type: DATA_FETCH_DEVICES,
        payload: {
          devices: devicesToReturn
        }
      });
    } catch (err) {}
  };
};

export const refreshConnectionsActionCreator = function() {
  return async function(dispatch, getState) {
    try {
      let devices = await getAllDevices();
      let connections = devices.map(device => {
        return { deviceId: device.id, connection: device.connected };
      });
      dispatch({
        type: DATA_REFRESH_CONNECTIONS,
        payload: {
          connections: connections
        }
      });
    } catch (err) {}
  };
};

export const fetchDeviceActionCreator = function(deviceId) {
  return async function(dispatch, getState) {
    try {
      let device = await getDevice(deviceId);
      //Converting arrays to collection objects
      device.variables = arrayToObject(device.variables, "id");
      device.calculationElements = arrayToObject(
        device.calculationElements,
        "id"
      );

      dispatch({
        type: DATA_FETCH_DEVICE,
        payload: {
          device: device
        }
      });
    } catch (err) {}
  };
};

export const fetchVariableActionCreator = function(deviceId, variableId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    //Dispatching device if it do not exist
    let deviceObject = stateObject.data.devices[deviceId];

    if (!exists(deviceObject)) {
      await dispatch(fetchDeviceActionCreator(deviceId));

      //Refreshing device if it does not exist
      stateObject = getState();
      deviceObject = stateObject.data.devices[deviceId];
    }

    try {
      let variable = await getVariable(deviceId, variableId);

      await dispatch({
        type: DATA_FETCH_VARIABLE,
        payload: {
          deviceId,
          variable
        }
      });
    } catch (err) {}
  };
};

export const fetchCalculationElementActionCreator = function(
  deviceId,
  calculationElementId
) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    //Dispatching device if it do not exist
    let deviceObject = stateObject.data.devices[deviceId];

    if (!exists(deviceObject)) {
      await dispatch(fetchDeviceActionCreator(deviceId));

      //Refreshing device if it does not exist
      stateObject = getState();
      deviceObject = stateObject.data.devices[deviceId];
    }

    try {
      let calculationElement = await getCalcElements(
        deviceId,
        calculationElementId
      );

      await dispatch({
        type: DATA_FETCH_CALCELEMENT,
        payload: {
          deviceId,
          calculationElement
        }
      });
    } catch (err) {}
  };
};

export const fetchElementActionCreator = function(deviceId, elementId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    //Dispatching device if it do not exist
    let deviceObject = stateObject.data.devices[deviceId];

    if (!exists(deviceObject)) {
      await dispatch(fetchDeviceActionCreator(deviceId));

      //Refreshing device if it does not exist
      stateObject = getState();
      deviceObject = stateObject.data.devices[deviceId];
    }

    //Checking if it is variable or calcElement - and dispatching proper acrion creator
    let isVariable = elementId in deviceObject.variables;

    if (isVariable) dispatch(fetchVariableActionCreator(deviceId, elementId));
    else dispatch(fetchCalculationElementActionCreator(deviceId, elementId));
  };
};

export const fetchVariablesActionCreator = function(deviceId) {
  return async function(dispatch, getState) {
    try {
      let stateObject = getState();
      //Dispatching device if it do not exist
      let deviceObject = stateObject.data.devices[deviceId];

      if (!exists(deviceObject)) {
        await dispatch(fetchDeviceActionCreator(deviceId));

        //Refreshing device if it does not exist
        stateObject = getState();
        deviceObject = stateObject.data.devices[deviceId];
      }

      let allVariables = await getAllVariables(deviceId);

      //Converting arrays to collection objects
      let variableToReturn = arrayToObject(allVariables, "id");

      dispatch({
        type: DATA_FETCH_VARIABLES,
        payload: {
          deviceId: deviceId,
          variables: variableToReturn
        }
      });
    } catch (err) {}
  };
};

export const fetchCalculationElementsActionCreator = function(deviceId) {
  return async function(dispatch, getState) {
    try {
      let stateObject = getState();
      //Dispatching device if it do not exist
      let deviceObject = stateObject.data.devices[deviceId];

      if (!exists(deviceObject)) {
        await dispatch(fetchDeviceActionCreator(deviceId));

        //Refreshing device if it does not exist
        stateObject = getState();
        deviceObject = stateObject.data.devices[deviceId];
      }

      let allCalcElements = await getAllCalcElements(deviceId);

      //Converting arrays to collection objects
      let calcElementsToReturn = arrayToObject(allCalcElements, "id");

      dispatch({
        type: DATA_FETCH_CALCELEMENTS,
        payload: {
          deviceId: deviceId,
          calculationElements: calcElementsToReturn
        }
      });
    } catch (err) {}
  };
};

export const fetchElementsActionCreator = function(deviceId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    //Dispatching device if it do not exist
    let deviceObject = stateObject.data.devices[deviceId];

    if (!exists(deviceObject)) {
      await dispatch(fetchDeviceActionCreator(deviceId));

      //Refreshing device if it does not exist
      stateObject = getState();
      deviceObject = stateObject.data.devices[deviceId];
    }

    await dispatch(fetchVariablesActionCreator(deviceId));
    await dispatch(fetchCalculationElementsActionCreator(deviceId));
  };
};

export const fetchValuesActionCreator = function(deviceId) {
  return async function(dispatch, getState) {
    let stateObject = getState();
    //Dispatching device if it do not exist
    let deviceObject = stateObject.data.devices[deviceId];

    if (!exists(deviceObject)) {
      await dispatch(fetchDeviceActionCreator(deviceId));

      //Refreshing device if it does not exist
      stateObject = getState();
      deviceObject = stateObject.data.devices[deviceId];
    }

    let values = await valuesService.getDeviceValues(deviceId);
    await dispatch({
      type: DATA_FETCH_VALUES,
      payload: {
        deviceId,
        values
      }
    });
  };
};
