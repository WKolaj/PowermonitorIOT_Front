import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Grid, Paper } from "@material-ui/core";
import {
  fetchDevicesActionCreator,
  refreshConnectionsActionCreator
} from "../../actions/dataActionCreator";
import userService from "../../services/userService.js";
import DevicesMenu from "./DevicesMenu";

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
    let { fetchDevices, user, devices } = this.props;
    if (!devices && userService.canVisualizeData(user)) {
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
      >
        <Grid item>
          <Paper className={classes.leftColumn}>
            <DevicesMenu />
          </Paper>
        </Grid>
        <Grid item xs>
          <Paper className={classes.rightColumn}>asd</Paper>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    devices: state.data.devices,
    user: state.user.currentUser
  };
};

const componentWithStyles = withStyles(styles)(DevicesConfigComponent);

export default connect(
  mapStateToProps,
  {
    fetchDevices: fetchDevicesActionCreator,
    refreshConnections: refreshConnectionsActionCreator
  }
)(componentWithStyles);
