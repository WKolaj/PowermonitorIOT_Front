import React, { Component } from "react";
import { AppBar, Tabs, Tab, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { changeTabActionCreator } from "../../../actions/deviceConfigActionsCreator";
import { translate } from "../../../translator/Translator";
import {
  fetchElementsActionCreator,
  fetchValuesActionCreator
} from "../../../actions/dataActionCreator";
import userService from "../../../services/userService";
import VariablesEditTable from "./VariablesEditTableComponent";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class DeviceConfigComponent extends Component {
  handleSampling = async () => {
    let deviceId = this.props.match.params.deviceId;
    let { user, fetchValues } = this.props;

    if (userService.canVisualizeData(user)) {
      fetchValues(deviceId);
    }
  };

  startSampling = () => {
    this._samplingHandler = setInterval(this.handleSampling, 5000);
  };

  stopSampling = () => {
    clearInterval(this._samplingHandler);
  };

  handleTabClicked = (event, newValue) => {
    this.props.changeTab(newValue);
  };

  componentWillUnmount = () => {
    if (this._samplingHandler) this.stopSampling();
  };

  componentDidMount = () => {
    this.startSampling();
  };

  fetchElementsIfNotFetched() {
    let deviceId = this.props.match.params.deviceId;
    let { user, fetchAllElements } = this.props;
    //Fetching if it was not fetched before or deviceId changed
    if (!this._fetchedDeviceId || this._fetchedDeviceId !== deviceId) {
      if (userService.canVisualizeData(user)) {
        //fetch All elements will fetch also a device if it was not fetched before
        fetchAllElements(deviceId);
        this._fetchedDeviceId = deviceId;
      }
    }
  }

  render() {
    let deviceId = this.props.match.params.deviceId;
    let { classes, tabNumber } = this.props;
    this.fetchElementsIfNotFetched();
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={tabNumber} onChange={this.handleTabClicked}>
            <Tab label={translate("DeviceConfigVariableTitle")} />
            <Tab label={translate("DeviceConfigCalcElementTitle")} />
          </Tabs>
        </AppBar>
        {tabNumber === 0 && <VariablesEditTable deviceId={deviceId} />}
        {tabNumber === 1 && <Typography>Item Two</Typography>}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    tabNumber: state.deviceConfig.tabNumber,
    lang: state.userPreferences.lang,
    user: state.user.currentUser
  };
};

const componentWithStyles = withStyles(styles)(DeviceConfigComponent);

export default connect(
  mapStateToProps,
  {
    changeTab: changeTabActionCreator,
    fetchAllElements: fetchElementsActionCreator,
    fetchValues: fetchValuesActionCreator
  }
)(componentWithStyles);
