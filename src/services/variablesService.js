import http from "./httpService";
import config from "../config.json";

const variablesRoute = config["variablesRoute"];

export async function getAllVariables(deviceId) {
  let result = await http.get(`${variablesRoute}/${deviceId}`);
  return result.data;
}

export async function getVariable(deviceId, variableId) {
  let result = await http.get(`${variablesRoute}/${deviceId}/${variableId}`);
  return result.data;
}
