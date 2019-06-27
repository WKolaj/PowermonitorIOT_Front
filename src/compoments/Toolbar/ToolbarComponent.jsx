import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { AppBar, Typography, IconButton, Toolbar } from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import { Menu } from "@material-ui/icons";
import {
  showDrawerActionCreator,
  hideDrawerActionCreator
} from "../../actions/drawerActionCreator";
import { translate } from "../../translator/Translator";
import LanguageButton from "../LanguageButton/LanguageButtonComponent";
import UserButton from "../UserButton/UserButtonComponent";
import ProgressBar from "../ProgressBar/ProgressBarComponent";

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  title: {
    flexGrow: 1
  }
});

class ToolbarComponent extends Component {
  render() {
    let { classes, drawerShown, showDrawer, hideDrawer } = this.props;

    return (
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open drawer"
            onClick={drawerShown ? hideDrawer : showDrawer}
          >
            {drawerShown ? <ChevronLeft /> : <Menu />}
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {translate("mainTitle")}
          </Typography>
          <LanguageButton />
          <UserButton />
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    lang: state.userPreferences.lang,
    drawerShown: state.drawer.shown
  };
};

const componentWithStyles = withStyles(styles)(ToolbarComponent);

export default connect(
  mapStateToProps,
  {
    showDrawer: showDrawerActionCreator,
    hideDrawer: hideDrawerActionCreator
  }
)(componentWithStyles);
