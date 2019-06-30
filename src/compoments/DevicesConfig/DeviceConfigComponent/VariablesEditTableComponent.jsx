import React, { Component } from "react";
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  IconButton
} from "@material-ui/core";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { translate } from "../../../translator/Translator";
import { exists } from "../../../utilities/utilities";
import { showTrendDialogActionCreator } from "../../../actions/trendDialogActionCreator";
import CustomPaginationActionsTable from "./ElementPaginationActionsTable";

const styles = theme => ({
  table: {
    height: "500px"
  },
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box"
  },
  tableRow: {
    cursor: "pointer"
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: "initial"
  }
});

class VariablesEditTableComponent extends Component {
  handleShowTrendClick = variableId => {
    let { deviceId, showTrend } = this.props;
    showTrend(deviceId, variableId);
  };

  render() {
    let { classes, device } = this.props;

    //If device has not yet been fetched - return null;
    if (!exists(device)) return null;

    let allVariables = Object.values(device.variables);

    return (
      <CustomPaginationActionsTable
        elements={allVariables}
        onTrendClicked={this.handleShowTrendClick}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    device: state.data.devices[props.deviceId],
    lang: state.userPreferences.lang,
    user: state.user.currentUser
  };
};

const componentWithStyles = withStyles(styles)(VariablesEditTableComponent);

export default connect(
  mapStateToProps,
  { showTrend: showTrendDialogActionCreator }
)(componentWithStyles);
