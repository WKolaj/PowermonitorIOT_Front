import http from "./httpService";
import config from "../config.json";

const devicesRoute = config["devicesRoute"];

export async function getAllDevices() {
  let result = await http.get(devicesRoute);
  return result.data;
}

export async function getDevice(deviceId) {
  let result = await http.get(`${devicesRoute}/${deviceId}`);
  return result.data;
}
