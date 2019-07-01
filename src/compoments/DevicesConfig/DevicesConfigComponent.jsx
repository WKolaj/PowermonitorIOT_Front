import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Grid, Paper } from "@material-ui/core";
import { Route, Switch } from "react-router-dom";
import {
  fetchDevicesActionCreator,
  fetchDeviceActionCreator,
  refreshConnectionsActionCreator,
  fetchVariableActionCreator,
  fetchVariablesActionCreator,
  fetchCalculationElementActionCreator,
  fetchCalculationElementsActionCreator,
  fetchElementActionCreator,
  fetchElementsActionCreator
} from "../../actions/dataActionCreator";
import userService from "../../services/userService.js";
import DevicesMenu from "./DevicesMenu";
import Trend from "../TrendComponent/TrendComponent";
import {
  startRefreshingCurrentValuesActionCreator,
  startRefreshingHistoryValuesActionCreator,
  stopRefreshingCurrentValuesActionCreator,
  stopRefreshingHistoryValuesActionCreator
} from "../../actions/trendsActionCreator";
import { showTrendDialogActionCreator } from "../../actions/trendDialogActionCreator";
import { isEmpty } from "../../utilities/utilities";
import DeviceConfig from "./DeviceConfigComponent/DeviceConfigComponent";

const styles = theme => ({
  root: { height: "100%" },
  leftColumn: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    height: "100%",
    width: 250
  },
  rightColumn: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    height: "100%"
  }
});

class DevicesConfigComponent extends Component {
  refreshDevices = () => {
    //this.props.fetchDevice("5d134065682f6f0e682d4015");
    let { fetchDevices, user, devices } = this.props;
    if (isEmpty(devices) && userService.canVisualizeData(user)) {
      fetchDevices();
    }
  };

  componentDidMount = () => {
    this._timeHandler = setInterval(this.handleTimerTick, 5000);
  };

  handleTimerTick = () => {
    let { user, devices, refreshConnections } = this.props;
    if (devices && userService.canVisualizeData(user)) {
      refreshConnections();
    }
  };

  componentWillUnmount = () => {
    if (this._timeHandler) clearInterval(this._timeHandler);
  };

  render() {
    this.refreshDevices();
    let { classes, devices } = this.props;
    if (!devices) return null;
    return (
      <Grid
        container
        className={classes.root}
        direction="row"
        justify="center"
        alignItems="stretch"
        wrap="nowrap"
      >
        <Grid item>
          <Paper className={classes.leftColumn} style={{ overflow: "auto" }}>
            <DevicesMenu />
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.rightColumn} style={{ overflow: "auto" }}>
            <Switch>
              <Route path="/devicesConfig/:deviceId" component={DeviceConfig} />
            </Switch>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    devices: state.data.devices,
    user: state.user.currentUser,
    trendObject:
      state.trends[
        Trend.generateTrendId(
          "5d134065682f6f0e682d4015",
          "5d134065682f6f0e682d3fe0"
        )
      ]
  };
};

const componentWithStyles = withStyles(styles)(DevicesConfigComponent);

export default connect(
  mapStateToProps,
  {
    fetchDevices: fetchDevicesActionCreator,
    refreshConnections: refreshConnectionsActionCreator,
    startRefreshingCurrentValues: startRefreshingCurrentValuesActionCreator,
    startRefreshingHistoryValues: startRefreshingHistoryValuesActionCreator,
    stopRefreshingCurrentValues: stopRefreshingCurrentValuesActionCreator,
    stopRefreshingHistoryValues: stopRefreshingHistoryValuesActionCreator,
    fetchDevice: fetchDeviceActionCreator,
    fetchVariable: fetchVariableActionCreator,
    fetchCalculationElement: fetchCalculationElementActionCreator,
    fetchElement: fetchElementActionCreator,
    showTrendDialog: showTrendDialogActionCreator
  }
)(componentWithStyles);
