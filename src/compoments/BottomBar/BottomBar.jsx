import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { AppBar, Toolbar } from "@material-ui/core";
import { Storage, Memory, Whatshot, DeveloperBoard } from "@material-ui/icons";
import { fetchInfoActionCreator } from "../../actions/infoActionCreator";
import ProgressBar from "../ProgressBar/ProgressBarComponent";
import userService from "../../services/userService";
import { minCPUTemp, maxCPUTemp } from "../../config.json";

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    top: "auto",
    bottom: 0,
    height: 35,
    padding: 0,
    position: "fixed"
  },
  toolBar: {
    minHeight: 0,
    margin: 10
  }
});

class BottomBarComponent extends Component {
  refreshInfo = () => {
    let { fetchInfo, user } = this.props;
    if (userService.canVisualizeData(user)) {
      fetchInfo();
    }
  };

  componentDidMount = () => {
    this._timeHandler = setInterval(this.handleTimerTick, 5000);
    this.refreshInfo();
  };

  handleTimerTick = () => {
    this.refreshInfo();
  };

  componentWillUnmount = () => {
    if (this._timeHandler) clearInterval(this._timeHandler);
  };

  render() {
    let { classes, info } = this.props;
    //fetch info if not fetched
    if (!info) this.refreshInfo();
    return info ? (
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <ProgressBar
            value={info.RAM.used}
            max={info.RAM.total}
            min={0}
            Icon={DeveloperBoard}
          />
          <ProgressBar
            value={info.CPU.temperature.value}
            max={maxCPUTemp}
            min={minCPUTemp}
            Icon={Whatshot}
          />
          <ProgressBar
            value={info.CPU.load.value}
            max={100}
            min={0}
            Icon={Memory}
          />
          <ProgressBar
            value={info.MEM.db1Space.used}
            max={info.MEM.db1Space.total}
            min={0}
            Icon={Storage}
          />
        </Toolbar>
      </AppBar>
    ) : null;
  }
}

const mapStateToProps = (state, props) => {
  return {
    info: state.info.info,
    user: state.user.currentUser
  };
};

const componentWithStyles = withStyles(styles)(BottomBarComponent);

export default connect(
  mapStateToProps,
  { fetchInfo: fetchInfoActionCreator }
)(componentWithStyles);
