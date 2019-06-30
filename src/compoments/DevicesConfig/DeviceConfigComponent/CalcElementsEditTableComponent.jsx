import React, { Component } from "react";
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  IconButton
} from "@material-ui/core";
import { BarChart } from "@material-ui/icons";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { translate } from "../../../translator/Translator";
import { getDeviceValues } from "../../../services/valuesService";
import { exists } from "../../../utilities/utilities";
import { showTrendDialogActionCreator } from "../../../actions/trendDialogActionCreator";

const styles = theme => ({});

class VariablesEditTableComponent extends Component {
  renderValue = variable => {
    if (!exists(variable.value)) return "";
    return `${variable.value.toFixed(3)} ${variable.unit}`;
  };

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
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              {translate("VariableConfigTableVariableName")}
            </TableCell>
            <TableCell align="right">
              {translate("VariableConfigTableVariableValue")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allVariables.map(variable => (
            <TableRow key={variable.id}>
              <TableCell component="th" scope="row">
                {variable.name}
              </TableCell>
              <TableCell align="right">
                {this.renderValue(variable)}
                <IconButton
                  onClick={() => this.handleShowTrendClick(variable.id)}
                >
                  <BarChart />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
