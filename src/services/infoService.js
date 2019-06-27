import http from "./httpService";
import config from "../config.json";

const infoRoute = config["infoRoute"];

export async function getInfo() {
  let result = await http.get(infoRoute);
  return result.data;
}
