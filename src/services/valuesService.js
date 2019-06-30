import http from "./httpService";
import config from "../config.json";

const valuesRoute = config["valuesRoute"];

const getValue = async function(deviceId, elementId) {
  let result = await http.get(`${valuesRoute}/${deviceId}/${elementId}`);
  return result.data;
};

const getValues = async function(
  deviceId,
  elementId,
  timeRangeStart,
  timeRangeStop
) {
  let result = await http.get(`${valuesRoute}/${deviceId}/${elementId}`, {
    params: {
      timeRangeStart,
      timeRangeStop
    }
  });
  return result.data;
};

export default { getValue, getValues };
