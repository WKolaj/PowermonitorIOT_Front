import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  MenuItem,
  MenuList,
  ListItemText,
  ListItemIcon,
  ListItem,
  Divider
} from "@material-ui/core";
import { Check, Close, ViewModule } from "@material-ui/icons";

import { translate } from "../../translator/Translator";

const styles = theme => ({
  notConnectedIcon: {
    color: "red"
  },
  connectedIcon: {
    color: "green"
  },
  itemIcon: {
    margin: 0,
    padding: 0
  }
});

class DevicesMenuComponent extends Component {
  renderDeviceButton = device => {
    return (
      <MenuItem key={device.id}>
        <ListItemIcon className={this.props.classes.itemIcon}>
          {device.connected ? (
            <Check className={this.props.classes.connectedIcon} />
          ) : (
            <Close className={this.props.classes.notConnectedIcon} />
          )}
        </ListItemIcon>
        <ListItemText primary={device.name} />
      </MenuItem>
    );
  };

  render() {
    let { classes, devices } = this.props;
    let allDevices = Object.values(devices);
    return (
      <MenuList>
        <ListItem>
          <ListItemIcon>
            <ViewModule />
          </ListItemIcon>
          <ListItemText primary={translate("DeviceMenuTitle")} />
        </ListItem>
        <Divider />
        {allDevices.map(device => this.renderDeviceButton(device))}
      </MenuList>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    devices: state.data.devices,
    lang: state.userPreferences.lang
  };
};

const componentWithStyles = withStyles(styles)(DevicesMenuComponent);

export default connect(mapStateToProps)(componentWithStyles);
