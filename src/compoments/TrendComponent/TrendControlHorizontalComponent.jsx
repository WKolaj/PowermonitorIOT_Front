import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { IconButton, ListItem, List } from "@material-ui/core";
import {
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  SwapHorizontalCircle,
  SwapHorizontalCircleOutlined,
  CloudDownload
} from "@material-ui/icons";
import { CSVLink } from "react-csv";

const csvDataHeaders = [];

const styles = theme => ({
  horizontalList: {
    display: "flex",
    flexDirection: "row",
    padding: 0
  }
});

class TrendControlHorizontalComponent extends Component {
  generateCSVFileName = () => {
    return `powermonitorIOT_report_${Date.now()}`;
  };

  getCSVHeader = valueTitle => {
    return [
      { label: "Time", key: "time" },
      { label: valueTitle, key: "value" }
    ];
  };

  render() {
    let {
      autoRange,
      onZoomInClicked,
      onZoomOutClicked,
      onMoveRightClicked,
      onMoveLeftClicked,
      onAutoResizeClicked,
      csvData,
      csvValueTitle,
      classes
    } = this.props;
    return (
      <List className={classes.horizontalList}>
        <ListItem>
          <IconButton disabled={autoRange} onClick={onMoveLeftClicked}>
            <ArrowLeft />
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton disabled={autoRange} onClick={onZoomInClicked}>
            <ZoomIn />
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton onClick={onAutoResizeClicked}>
            {autoRange ? (
              <SwapHorizontalCircle />
            ) : (
              <SwapHorizontalCircleOutlined />
            )}
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton disabled={autoRange} onClick={onZoomOutClicked}>
            <ZoomOut />
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton disabled={autoRange} onClick={onMoveRightClicked}>
            <ArrowRight />
          </IconButton>
        </ListItem>
        <ListItem>
          <CSVLink
            filename={this.generateCSVFileName()}
            data={csvData}
            headers={this.getCSVHeader(csvValueTitle)}
            onClick={event => {
              //Disabling further propagation if autoRange is on
              return !autoRange;
            }}
          >
            <IconButton disabled={autoRange} onClick={onMoveRightClicked}>
              <CloudDownload />
            </IconButton>
          </CSVLink>
        </ListItem>
      </List>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const componentWithStyles = withStyles(styles)(TrendControlHorizontalComponent);

export default connect(
  mapStateToProps,
  {}
)(componentWithStyles);
