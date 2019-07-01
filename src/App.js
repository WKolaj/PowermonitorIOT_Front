import React, { Component } from "react";
import "./App.css";
import LayoutComponent from "./compoments/Layout/LayoutComponent.jsx";
import { Provider } from "react-redux";
import store from "./store";
import theme from "./theme";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { BrowserRouter } from "react-router-dom";

class App extends Component {
  componentDidMount() {
    document.title = "PowermonitorIOT";
  }

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <LayoutComponent />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
