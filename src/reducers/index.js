import { combineReducers } from "redux";
import drawerReducer from "./drawerReducer";
import userPreferencesReducer from "./userPreferencesReducer";
import languageWindowReducer from "./languageWindowReducer";
import userWindowReducer from "./userWindowReducer";
import userDialogReducer from "./userDialogReducer";
import userReducer from "./userReducer";
import layoutReducer from "./layoutReducer";
import errorDialogReducer from "./errorDialogReducer";
import dataReducer from "./dataReducer";
import infoReducer from "./infoReducer";
import { reducer } from "redux-form";

export default combineReducers({
  drawer: drawerReducer,
  userPreferences: userPreferencesReducer,
  languageWindow: languageWindowReducer,
  userWindow: userWindowReducer,
  userDialog: userDialogReducer,
  user: userReducer,
  layout: layoutReducer,
  error: errorDialogReducer,
  data: dataReducer,
  info: infoReducer,
  form: reducer
});
