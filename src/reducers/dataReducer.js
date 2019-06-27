import { DATA_FETCH_DEVICES, DATA_REFRESH_CONNECTIONS } from "../actions/types";

export default function(state = { devices: null, connections: null }, action) {
  switch (action.type) {
    case DATA_FETCH_DEVICES: {
      let devices = {};

      for (let device of action.payload.devices) {
        devices[device.id] = device;
      }

      return {
        ...state,
        devices: devices
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
