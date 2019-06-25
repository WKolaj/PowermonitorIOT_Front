import React, { Component } from "react";
import "./App.css";
import LayoutComponent from "./compoments/Layout/LayoutComponent.jsx";
import { Provider } from "react-redux";
import store from "./store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <LayoutComponent />
      </Provider>
    );
  }
}

export default App;
