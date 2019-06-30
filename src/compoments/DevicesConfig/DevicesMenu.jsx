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
import { Link } from "react-router-dom";
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
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  }
});

class DevicesMenuComponent extends Component {
  renderDeviceButton = device => {
    return (
      <Link
        key={device.id}
        to={`/devicesConfig/${device.id}`}
        className={this.props.classes.link}
      >
        <ListItem button>
          <ListItemIcon className={this.props.classes.itemIcon}>
            {device.connected ? (
              <Check className={this.props.classes.connectedIcon} />
            ) : (
              <Close className={this.props.classes.notConnectedIcon} />
            )}
          </ListItemIcon>
          <ListItemText primary={device.name} />
        </ListItem>
      </Link>
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
