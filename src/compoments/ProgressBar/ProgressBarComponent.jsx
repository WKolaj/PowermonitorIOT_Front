import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";

const styles = theme => ({
  linearProgress: {
    width: 50,
    marginLeft: 10,
    marginRight: 20
  },
  progressBarIcon: {
    width: 16,
    height: 16
  },
  linearBackColorPrimary: {
    backgroundColor: theme.palette.grey[600]
  },
  linearBarColorPrimary: {
    backgroundColor: theme.palette.grey[100]
  },
  linearBackColorAlert: {
    backgroundColor: theme.palette.error.light
  },
  linearBarColorAlert: {
    backgroundColor: theme.palette.error.dark
  }
});

class ProgressBarComponent extends Component {
  getLinearBarClasses(isAlert, classes) {
    return isAlert
      ? {
          colorPrimary: classes.linearBackColorAlert,
          barColorPrimary: classes.linearBarColorAlert
        }
      : {
          colorPrimary: classes.linearBackColorPrimary,
          barColorPrimary: classes.linearBarColorPrimary
        };
  }

  render() {
    let { value, max, min, limit, classes, Icon } = this.props;
    if (max === undefined || max === null) max = 100;
    if (min === undefined || min === null) min = 0;
    if (limit === undefined || limit === null) limit = 80;

    let percentageValue = (100 * (value - min)) / (max - min);
    let isAlert = percentageValue >= limit;

    return (
      <React.Fragment>
        <Icon
          className={classes.progressBarIcon}
          color={isAlert ? "error" : "inherit"}
        />
        <LinearProgress
          className={classes.linearProgress}
          variant="determinate"
          value={percentageValue}
          classes={this.getLinearBarClasses(isAlert, classes)}
        />
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(ProgressBarComponent);
