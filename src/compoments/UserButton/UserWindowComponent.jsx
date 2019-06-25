import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@material-ui/core";
import {
  AddToQueue,
  RemoveFromQueue,
  Settings,
  Person
} from "@material-ui/icons";
import { connect } from "react-redux";
import {
  hideUserWindowActionCreator,
  showUserWindowActionCreator
} from "../../actions/userWindowActionCreator";
import { logoutUserActionCreator } from "../../actions/userActionCreator";
import translate from "../../translator/Translator";
import { showUserDialogActionCreator } from "../../actions/userDialogActionCreator";

const styles = theme => ({
  root: {},
  menuDiv: {
    minWidth: 200
  }
});

class UserWindowComponent extends Component {
  handleMenuClose = () => {
    this.props.hide();
  };

  handleSignInClick = () => {
    this.props.hide();
    this.props.showUserDialog();
  };

  handleSignOutClick = async () => {
    this.props.hide();
    await this.props.logoutUser();
  };
  render() {
    let { shown, classes, referenceEl, user } = this.props;

    return (
      <Menu
        id="user-window"
        className={classes.root}
        anchorEl={shown ? referenceEl.current : null}
        keepMounted
        open={shown}
        onClose={this.handleMenuClose}
      >
        <div className={classes.menuDiv}>
          {user ? (
            <ListItem>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary={user.login} />
            </ListItem>
          ) : null}
          {user ? <Divider /> : null}
          {user ? (
            <MenuItem onClick={this.handleSignOutClick}>
              <ListItemIcon>
                <RemoveFromQueue />
              </ListItemIcon>
              <ListItemText primary={translate("SignOut")} />
            </MenuItem>
          ) : (
            <MenuItem onClick={this.handleSignInClick}>
              <ListItemIcon>
                <AddToQueue />
              </ListItemIcon>
              <ListItemText primary={translate("SignIn")} />
            </MenuItem>
          )}
          {user ? (
            <MenuItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary={translate("Settings")} />
            </MenuItem>
          ) : null}
        </div>
      </Menu>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    shown: state.userWindow.shown,
    user: state.user.currentUser
  };
};

let componentWithStyles = withStyles(styles)(UserWindowComponent);

export default connect(
  mapStateToProps,
  {
    hide: hideUserWindowActionCreator,
    show: showUserWindowActionCreator,
    showUserDialog: showUserDialogActionCreator,
    logoutUser: logoutUserActionCreator
  }
)(componentWithStyles);
