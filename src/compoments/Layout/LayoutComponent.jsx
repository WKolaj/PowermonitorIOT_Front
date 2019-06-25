import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "../Toolbar/ToolbarComponent";
import { Container, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import Drawer from "../Drawer/DrawerComponent";
import UserDialog from "../UserDialog/UserDialogComponent";
import BusyDialog from "../BusyDialog/BusyDialogComponent";
import { getCurrentJWT } from "../../services/authService";
import { loginUserWithJWTActionCreator } from "../../actions/userActionCreator";
import {
  showUserDialogActionCreator,
  hideUserDialogActionCreator
} from "../../actions/userDialogActionCreator";
import {
  layoutActivateUserCheckActionCreator,
  layoutDeactivateUserCheckActionCreator
} from "../../actions/layoutActionCreator";
import ErrorDialog from "../ErrorDialog/ErrorDialogComponent";

//Method for creating styles
const styles = theme => ({
  root: {
    display: "flex"
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: 240
  }
});

class LayoutComponent extends Component {
  componentDidMount() {
    let jwt = getCurrentJWT();
    if (jwt) this.props.logUserWithJWT(jwt);

    this.props.activateUserCheck();
  }

  /**
   * @description Method for checking constantly if user is logged in
   */
  checkUser() {
    let { user, userDialogShown, userCheckActive } = this.props;
    if (userCheckActive && !user && !userDialogShown)
      this.props.showUserDialog();
  }

  render() {
    let { classes } = this.props;

    this.checkUser();

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Toolbar />
        <Drawer />
        <UserDialog />
        <BusyDialog />
        <ErrorDialog />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Typography>{process.env.REACT_APP_BASE_URL}</Typography>
          </Container>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    userDialogShown: state.userDialog.shown,
    user: state.user.currentUser,
    userCheckActive: state.layout.userCheckActive
  };
};

let componentWithStyles = withStyles(styles)(LayoutComponent);

//Thanks to withStyle method - styles will be available by props as classes object
export default connect(
  mapStateToProps,
  {
    logUserWithJWT: loginUserWithJWTActionCreator,
    hideUserDialog: hideUserDialogActionCreator,
    showUserDialog: showUserDialogActionCreator,
    activateUserCheck: layoutActivateUserCheckActionCreator,
    deactivateUserCheck: layoutDeactivateUserCheckActionCreator
  }
)(componentWithStyles);
