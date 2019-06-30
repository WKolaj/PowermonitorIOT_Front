import {
  DATA_FETCH_DEVICES,
  DATA_FETCH_DEVICE,
  DATA_REFRESH_CONNECTIONS,
  DATA_FETCH_VARIABLE,
  DATA_FETCH_CALCELEMENT,
  DATA_FETCH_VARIABLES,
  DATA_FETCH_CALCELEMENTS,
  DATA_FETCH_VALUES
} from "../actions/types";
import { exists } from "../utilities/utilities";

export default function(state = { devices: {} }, action) {
  switch (action.type) {
    case DATA_FETCH_DEVICES: {
      let devices = action.payload.devices;

      return {
        ...state,
        devices: devices
      };
    }
    case DATA_FETCH_DEVICE: {
      let newDevices = {
        ...state.devices,
        [action.payload.device.id]: action.payload.device
      };
      return {
        ...state,
        devices: newDevices
      };
    }
    case DATA_FETCH_VARIABLE: {
      let oldDevice = state.devices[action.payload.deviceId];
      let newDevice = {
        ...oldDevice,
        variables: {
          ...oldDevice.variables,
          [action.payload.variable.id]: action.payload.variable
        }
      };

      let newDevices = {
        ...state.devices,
        [action.payload.deviceId]: newDevice
      };

      return {
        ...state,
        devices: newDevices
      };
    }

    case DATA_FETCH_CALCELEMENT: {
      let oldDevice = state.devices[action.payload.deviceId];
      let newDevice = {
        ...oldDevice,
        calculationElements: {
          ...oldDevice.calculationElements,
          [action.payload.calculationElement.id]:
            action.payload.calculationElement
        }
      };

      let newDevices = {
        ...state.devices,
        [action.payload.deviceId]: newDevice
      };

      return {
        ...state,
        devices: newDevices
      };
    }

    case DATA_FETCH_VARIABLES: {
      let oldDevice = state.devices[action.payload.deviceId];
      let newDevice = {
        ...oldDevice,
        variables: {
          ...oldDevice.variables,
          ...action.payload.variables
        }
      };

      let newDevices = {
        ...state.devices,
        [action.payload.deviceId]: newDevice
      };

      return {
        ...state,
        devices: newDevices
      };
    }

    case DATA_FETCH_CALCELEMENTS: {
      let oldDevice = state.devices[action.payload.deviceId];
      let newDevice = {
        ...oldDevice,
        calculationElements: {
          ...oldDevice.calculationElements,
          ...action.payload.calculationElements
        }
      };

      let newDevices = {
        ...state.devices,
        [action.payload.deviceId]: newDevice
      };

      return {
        ...state,
        devices: newDevices
      };
    }

    case DATA_FETCH_VALUES: {
      let { deviceId, values } = action.payload;

      let oldDevice = state.devices[deviceId];
      let oldVariables = oldDevice.variables;
      let oldCalcElements = oldDevice.calculationElements;
      let newVariables = {};
      let newCalcElements = {};

      for (let variableId of Object.keys(oldDevice.variables)) {
        let newValue = values[variableId];
        if (exists(newValue))
          newVariables[variableId] = {
            ...oldVariables[variableId],
            value: newValue
          };
        else newVariables[variableId] = oldVariables[variableId];
      }

      for (let calcElementId of Object.keys(oldDevice.calculationElements)) {
        let newValue = values[calcElementId];
        if (exists(newValue))
          newCalcElements[calcElementId] = {
            ...oldCalcElements[calcElementId],
            value: newValue
          };
        else newCalcElements[calcElementId] = oldCalcElements[calcElementId];
      }

      let newDevice = {
        ...oldDevice,
        variables: newVariables,
        calculationElements: newCalcElements
      };

      let newDevices = {
        ...state.devices,
        [deviceId]: newDevice
      };

      return {
        ...state,
        devices: newDevices
      };
    }

    case DATA_REFRESH_CONNECTIONS: {
      //do not change state if devices are not fetched yet
      if (!state.devices) return state;

      let newDevices = { ...state.devices };

      for (let connectionObject of action.payload.connections) {
        let { deviceId, connection } = connectionObject;
        let oldDevice = state.devices[deviceId];
        //setting connection to device if it exists
        if (oldDevice)
          newDevices[deviceId] = { ...oldDevice, connected: connection };
      }

      return {
        ...state,
        devices: newDevices
      };
    }
    default: {
      return state;
    }
  }
}
