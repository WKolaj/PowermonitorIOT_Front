import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Dialog, Grid, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { hideTrendDialogActionCreator } from "../../actions/trendDialogActionCreator";
import Trend from "../TrendComponent/TrendComponent";
import { now, msToDate } from "../../utilities/utilities";

const styles = theme => {
  return {
    dialog: {
      paperFullWidth: true
    },
    dialogPaper: {
      width: "90%",
      height: "90%"
    }
  };
};

class TrendDialogComponent extends Component {
  handleCloseClicked = () => {
    this.props.hide();
  };

  render() {
    let { classes, shown, trendId, variableId, deviceId } = this.props;
    return (
      <Dialog
        className={`${classes.dialog} paperFullWidth`}
        open={shown}
        onClose={this.handleDialogClose}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        fullWidth={true}
        maxWidth={"xl"}
        classes={{ paper: classes.dialogPaper }}
      >
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          style={{ height: "98%", width: "98%" }}
          wrap="nowrap"
        >
          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="center"
            >
              <IconButton onClick={() => this.handleCloseClicked()}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item sm>
            <Trend variableId={variableId} deviceId={deviceId} />
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    shown: state.trendDialog.shown,
    trendId: state.trendDialog.trendId,
    variableId: state.trendDialog.variableId,
    deviceId: state.trendDialog.deviceId
  };
};

const componentWithStyle = withStyles(styles)(TrendDialogComponent);

export default connect(
  mapStateToProps,
  {
    hide: hideTrendDialogActionCreator
  }
)(componentWithStyle);
