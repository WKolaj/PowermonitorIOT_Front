import { FETCH_INFO } from "./types";
import { getInfo } from "../services/infoService";

export const fetchInfoActionCreator = function() {
  return async function(dispatch, getState) {
    try {
      let info = await getInfo();
      dispatch({
        type: FETCH_INFO,
        payload: {
          info: info
        }
      });
    } catch (err) {}
  };
};
