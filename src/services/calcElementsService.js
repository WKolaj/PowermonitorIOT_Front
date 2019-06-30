import http from "./httpService";
import config from "../config.json";

const calcElementsRoute = config["calcElementsRoute"];

export async function getAllCalcElements(deviceId) {
  let result = await http.get(`${calcElementsRoute}/${deviceId}`);
  return result.data;
}

export async function getCalcElements(deviceId, calcElementId) {
  let result = await http.get(
    `${calcElementsRoute}/${deviceId}/${calcElementId}`
  );
  return result.data;
}
