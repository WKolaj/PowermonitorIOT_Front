import React, { Component } from "react";
import {
  ListItem,
  ListItemIcon,
  Tabs,
  Tab,
  Typography,
  ListItemText,
  Divider
} from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
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
import CalcElementEditTable from "./CalcElementEditTableComponent";
import { exists } from "../../../utilities/utilities";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  headerListItem: {},
  headerListIcon: {},
  headerListText: {
    fontSize: 21
  },
  headerIcon: {
    width: 60,
    height: 60
  },
  headerNotConnectedIcon: {
    color: "red",
    fontSizeLarge: "large"
  },
  headerConnectedIcon: {
    color: "green"
  },
  tabs: {
    marginTop: 8
  },
  itemIcon: {
    margin: 0,
    padding: 0
  },
  link: {
    textDecoration: "none",
    color: "inherit"
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

  renderHeader = device => {
    return exists(device) ? (
      <ListItem className={this.props.classes.headerListItem}>
        <ListItemIcon className={this.props.classes.headerListIcon}>
          {device.connected ? (
            <Check className={this.props.classes.headerConnectedIcon} />
          ) : (
            <Close className={this.props.classes.headerNotConnectedIcon} />
          )}
        </ListItemIcon>
        <ListItemText
          classes={{ primary: this.props.classes.headerListText }}
          primary={device.name}
        />
      </ListItem>
    ) : null;
  };

  render() {
    let deviceId = this.props.match.params.deviceId;
    let { classes, tabNumber, devices } = this.props;
    let device = devices[deviceId];
    this.fetchElementsIfNotFetched();
    return (
      <div className={classes.root}>
        {this.renderHeader(device)}
        <Divider />
        <Tabs
          className={classes.tabs}
          value={tabNumber}
          onChange={this.handleTabClicked}
        >
          <Tab label={translate("DeviceConfigVariableTitle")} />
          <Tab label={translate("DeviceConfigCalcElementTitle")} />
        </Tabs>
        {tabNumber === 0 && <VariablesEditTable deviceId={deviceId} />}
        {tabNumber === 1 && <CalcElementEditTable deviceId={deviceId} />}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    tabNumber: state.deviceConfig.tabNumber,
    lang: state.userPreferences.lang,
    user: state.user.currentUser,
    devices: state.data.devices
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
