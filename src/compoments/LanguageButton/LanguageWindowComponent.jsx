import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { connect } from "react-redux";
import {
  hideLanguageWindowActionCreator,
  showLanguageWindowActionCreator
} from "../../actions/languageWindowActionCreator";
import { changeUserLanguageActionCreator } from "../../actions/userPreferencesActionCreator";
import Flag from "react-world-flags";
import translations from "../../translations.json";

const allLanguages = translations["languageName"];

const styles = theme => ({
  root: {},
  flagIcon: {
    height: 20
  },
  menuDiv: {
    minWidth: 200
  }
});

class LanguageWindowComponent extends Component {
  handleMenuClose = () => {
    this.props.hide();
  };

  handleLangButtonClick = lang => {
    this.props.changeLanguage(lang);
    this.props.hide();
  };

  render() {
    let { shown, classes, referenceEl } = this.props;
    //Getting all short names for languages
    let languageShortNames = Object.keys(allLanguages);

    return (
      <Menu
        id="language-window"
        className={classes.root}
        anchorEl={shown ? referenceEl.current : null}
        keepMounted
        open={shown}
        onClose={this.handleMenuClose}
      >
        <div className={classes.menuDiv}>
          {languageShortNames.map(langShortName => {
            return (
              <MenuItem
                key={langShortName}
                onClick={() => this.handleLangButtonClick(langShortName)}
              >
                <ListItemIcon>
                  <Flag className={classes.flagIcon} code={langShortName} />
                </ListItemIcon>
                <ListItemText primary={allLanguages[langShortName]} />
              </MenuItem>
            );
          })}
        </div>
      </Menu>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    shown: state.languageWindow.shown
  };
};

let componentWithStyles = withStyles(styles)(LanguageWindowComponent);

export default connect(
  mapStateToProps,
  {
    hide: hideLanguageWindowActionCreator,
    show: showLanguageWindowActionCreator,
    changeLanguage: changeUserLanguageActionCreator
  }
)(componentWithStyles);
