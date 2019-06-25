import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { hideDrawerActionCreator } from "../../actions/drawerActionCreator";
import {
  Drawer,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import {
  BarChart,
  Dashboard,
  EventNote,
  ViewModule,
  People,
  Settings
} from "@material-ui/icons";
import clsx from "clsx";
import translate from "../../translator/Translator";
//Method for creating styles
const styles = theme => ({
  toolbarIcon: {
    marginLeft: 1,
    [theme.breakpoints.up("sm")]: {
      marginLeft: 5
    },
    padding: 0
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar
});
const drawerWidth = 240;

class DrawerComponent extends Component {
  render() {
    let { classes, shown } = this.props;
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !shown && classes.drawerPaperClose)
        }}
        open={shown}
      >
        <div className={classes.appBarSpacer} />
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <Dashboard className={classes.toolbarIcon} />
          </ListItemIcon>
          <ListItemText primary={translate("DrawerOverview")} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <BarChart className={classes.toolbarIcon} />
          </ListItemIcon>
          <ListItemText primary={translate("DrawerReports")} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <EventNote className={classes.toolbarIcon} />
          </ListItemIcon>
          <ListItemText primary={translate("DrawerEvents")} />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon>
            <ViewModule className={classes.toolbarIcon} />
          </ListItemIcon>
          <ListItemText primary={translate("DrawerDevices")} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <People className={classes.toolbarIcon} />
          </ListItemIcon>
          <ListItemText primary={translate("DrawerUsers")} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Settings className={classes.toolbarIcon} />
          </ListItemIcon>
          <ListItemText primary={translate("DrawerAdvanced")} />
        </ListItem>
      </Drawer>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    shown: state.drawer.shown
  };
};

const componentWithStyles = withStyles(styles)(DrawerComponent);

export default connect(
  mapStateToProps,
  {
    hideDrawer: hideDrawerActionCreator
  }
)(componentWithStyles);
