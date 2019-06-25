import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Dialog, CircularProgress } from "@material-ui/core";
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

class UserDialogComponent extends Component {
  render() {
    let { shown, classes } = this.props;

    return (
      <div>
        <Dialog
          className={classes.dialog}
          open={shown}
          onClose={this.handleDialogClose}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none"
            }
          }}
        >
          <div className={classes.dialogDiv}>
            <CircularProgress
              className={classes.progress}
              size={150}
              thickness={5}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    shown: state.layout.busy
  };
};

const componentWithStyle = withStyles(styles)(UserDialogComponent);

export default connect(
  mapStateToProps,
  {}
)(componentWithStyle);
