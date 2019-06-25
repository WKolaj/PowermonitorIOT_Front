import React, { Component } from "react";
import { Person } from "@material-ui/icons";
import { Button, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  showUserWindowActionCreator,
  hideUserWindowActionCreator
} from "../../actions/userWindowActionCreator";
import UserWindow from "./UserWindowComponent";

const styles = theme => {
  return {
    button: {
      margin: theme.spacing(1)
    },
    icon: {
      marginRight: theme.spacing(1)
    },
    iconButton: {}
  };
};

class UserButtonComponent extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
  }

  handleButtonClicked = () => {
    let { userWindowShown, showUserWindow, hideUserWindow } = this.props;

    if (userWindowShown) hideUserWindow();
    else showUserWindow();
  };

  render() {
    let { user, classes } = this.props;
    return (
      <React.Fragment>
        {user ? (
          <Button
            variant="contained"
            color="secondary"
            ref={this.buttonRef}
            className={classes.button}
            onClick={this.handleButtonClicked}
          >
            <Person className={classes.icon} />
            {user.login}
          </Button>
        ) : (
          <IconButton
            variant="contained"
            color="inherit"
            ref={this.buttonRef}
            onClick={this.handleButtonClicked}
            className={classes.iconButton}
          >
            <Person />
          </IconButton>
        )}

        <UserWindow referenceEl={this.buttonRef} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    userWindowShown: state.userWindow.shown,
    user: state.user.currentUser
  };
};

const componentWithStyle = withStyles(styles)(UserButtonComponent);

export default connect(
  mapStateToProps,
  {
    showUserWindow: showUserWindowActionCreator,
    hideUserWindow: hideUserWindowActionCreator
  }
)(componentWithStyle);
