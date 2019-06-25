import React, { Component } from "react";
import { Language } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  showLanguageWindowActionCreator,
  hideLanguageWindowActionCreator
} from "../../actions/languageWindowActionCreator";
import LanguageWindow from "./LanguageWindowComponent";

const styles = theme => {};

class LanguageButtonComponent extends Component {
  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
  }

  handleButtonClicked = () => {
    let {
      langWindowShown,
      showLanguageWindow,
      hideLanguageWindow
    } = this.props;

    if (langWindowShown) hideLanguageWindow();
    else showLanguageWindow();
  };

  render() {
    return (
      <React.Fragment>
        <IconButton
          ref={this.buttonRef}
          onClick={this.handleButtonClicked}
          color="inherit"
        >
          <Language />
        </IconButton>
        <LanguageWindow referenceEl={this.buttonRef} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    langWindowShown: state.languageWindow.shown
  };
};

const componentWithStyle = withStyles(styles)(LanguageButtonComponent);

export default connect(
  mapStateToProps,
  {
    showLanguageWindow: showLanguageWindowActionCreator,
    hideLanguageWindow: hideLanguageWindowActionCreator
  }
)(componentWithStyle);
