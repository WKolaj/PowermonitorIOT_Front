import {
  DATA_FETCH_DEVICES,
  DATA_FETCH_DEVICE,
  DATA_REFRESH_CONNECTIONS,
  DATA_FETCH_VARIABLE,
  DATA_FETCH_CALCELEMENT
} from "../actions/types";

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
