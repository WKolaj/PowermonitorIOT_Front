import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Button
} from "@material-ui/core";
import {
  showErrorDialogActionCreator,
  hideErrorDialogActionCreator
} from "../../actions/errorDialogActionCreator";
const styles = theme => {
  return {
    dialog: {},
    dialogDiv: {},
    progress: {
      width: 200,
      height: 200,
      margin: theme.spacing(2)
    }
  };
};

class ErrorDialogComponent extends Component {
  handleDialogClose = () => {
    this.props.hide();
  };

  handleClose = () => {
    this.props.hide();
  };

  render() {
    let { shown, error } = this.props;

    return (
      <Dialog
        open={shown}
        onClose={this.handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {error ? error.title : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {error ? error.message : ""}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    shown: state.error.shown,
    error: state.error.error
  };
};

const componentWithStyle = withStyles(styles)(ErrorDialogComponent);

export default connect(
  mapStateToProps,
  {
    show: showErrorDialogActionCreator,
    hide: hideErrorDialogActionCreator
  }
)(componentWithStyle);
