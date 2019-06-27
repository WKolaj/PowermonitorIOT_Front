import { DATA_FETCH_DEVICES, DATA_REFRESH_CONNECTIONS } from "./types";
import { getAllDevices } from "../services/devicesService";

export const fetchDevicesActionCreator = function(userLogin, password) {
  return async function(dispatch, getState) {
    try {
      let devices = await getAllDevices();
      dispatch({
        type: DATA_FETCH_DEVICES,
        payload: {
          devices: devices
        }
      });
    } catch (err) {}
  };
};

export const refreshConnectionsActionCreator = function(userLogin, password) {
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
