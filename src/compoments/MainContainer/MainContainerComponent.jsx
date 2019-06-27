import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";
import DevicesConfig from "../DevicesConfig/DevicesConfigComponent";

const styles = theme => ({
  container: {
    padding: theme.spacing(1),
    height: "calc(100% - 110px)"
  }
});

class MainContainerComponent extends Component {
  render() {
    let { classes } = this.props;

    return (
      <Grid className={classes.container}>
        <Switch>
          <Route path="/devicesConfig" component={DevicesConfig} />
        </Switch>
      </Grid>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const componentWithStyles = withStyles(styles)(MainContainerComponent);

export default connect(
  mapStateToProps,
  {}
)(componentWithStyles);
