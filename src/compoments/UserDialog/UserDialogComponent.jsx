import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from "@material-ui/core";
import {
  showUserDialogActionCreator,
  hideUserDialogActionCreator
} from "../../actions/userDialogActionCreator";
import { loginUserActionCreator } from "../../actions/userActionCreator";
import { translate } from "../../translator/Translator";
import { Field, reduxForm } from "redux-form";
import { isEmpty } from "../../utilities/utilities";
import Joi from "joi-browser";
import { authSchema } from "../../validation/validation";
import { changeUserLanguageActionCreator } from "../../actions/userPreferencesActionCreator";
import {
  setLayoutReadyActionCreator,
  setLayoutBusyActionCreator
} from "../../actions/layoutActionCreator";
import {
  showErrorDialogActionCreator,
  hideErrorDialogActionCreator
} from "../../actions/errorDialogActionCreator";

const styles = theme => {
  return {
    container: {
      width: 250,
      [theme.breakpoints.up("sm")]: {
        width: 300
      },
      display: "block"
    },
    form: {
      width: 250,
      [theme.breakpoints.up("sm")]: {
        width: 300
      },
      display: "block"
    },
    textField: {
      margin: theme.spacing(1)
    },
    errorLabel: {
      color: "red"
    }
  };
};

class UserDialogComponent extends Component {
  handleDialogClose = () => {
    this.props.hide();
    this.props.reset();
  };

  handleCancelButtonClick = () => {
    this.props.hide();
    this.props.reset();
  };

  onSubmit = async formValues => {
    this.props.showBusyWindow();
    try {
      await this.props.loginUser(
        this.props.formData.login,
        this.props.formData.password
      );
      this.props.changeUserLang(this.props.user.lang);
    } catch (err) {
      let errMessage = err.response ? err.response.data : err.message;
      this.props.showErrorDialog(translate("UserLoginError"), errMessage);
    }
    this.props.hideBusyWindow();
    this.props.reset();
    this.props.hide();
  };

  //Method for rendering single Field of form
  renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
    <div>
      <TextField
        className={this.props.classes.textField}
        {...input}
        placeholder={label}
        type={type}
        fullWidth
      />
      {touched &&
        ((error && (
          <Typography
            className={this.props.classes.errorLabel}
            variant="caption"
          >
            {error}
          </Typography>
        )) ||
          (warning && (
            <Typography
              className={this.props.classes.errorLabel}
              variant="caption"
            >
              {warning}
            </Typography>
          )))}
    </div>
  );

  //Method for checking if login button should be disabled
  checkLoginButtonDisable = () => {
    return !isEmpty(validate(this.props.formData));
  };

  render() {
    let { shown, classes } = this.props;

    return (
      <div>
        <Dialog
          open={shown}
          onClose={this.handleDialogClose}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
        >
          <form
            className={classes.form}
            onSubmit={this.props.handleSubmit(this.onSubmit)}
          >
            <DialogTitle id="alert-dialog-title">
              {translate("UserDialogTitle")}
            </DialogTitle>
            <DialogContent>
              <Field
                name="login"
                type="text"
                component={this.renderField}
                label="Login"
              />
              <Field
                name="password"
                type="password"
                component={this.renderField}
                label="Password"
              />
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.handleCancelButtonClick}>
                {translate("Cancel")}
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={this.checkLoginButtonDisable()}
              >
                {translate("SignIn")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    shown: state.userDialog.shown,
    user: state.user.currentUser,
    //state.form.userLogin can be empty at first!
    formData: state.form.userLogin
      ? state.form.userLogin.values
        ? state.form.userLogin.values
        : {}
      : {}
  };
};

const validate = formData => {
  let result = Joi.validate(formData, authSchema, { abortEarly: false });
  if (!result.error) return {};

  let objectToReturn = {};

  for (let detail of result.error.details) {
    objectToReturn[detail.path] = detail.message;
  }

  return objectToReturn;
};

const componentWithStyle = withStyles(styles)(UserDialogComponent);

const formComponentWithStyle = reduxForm({
  form: "userLogin",
  validate: validate
})(componentWithStyle);

export default connect(
  mapStateToProps,
  {
    hide: hideUserDialogActionCreator,
    show: showUserDialogActionCreator,
    loginUser: loginUserActionCreator,
    showBusyWindow: setLayoutBusyActionCreator,
    hideBusyWindow: setLayoutReadyActionCreator,
    changeUserLang: changeUserLanguageActionCreator,
    showErrorDialog: showErrorDialogActionCreator,
    hideErrorDialog: hideErrorDialogActionCreator
  }
)(formComponentWithStyle);
