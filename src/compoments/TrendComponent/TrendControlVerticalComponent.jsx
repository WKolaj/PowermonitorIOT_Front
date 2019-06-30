import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { IconButton, ListItem, List } from "@material-ui/core";
import {
  ZoomIn,
  ZoomOut,
  ArrowUpward,
  ArrowDownward,
  SwapVerticalCircleOutlined,
  SwapVerticalCircle
} from "@material-ui/icons";

const styles = theme => ({
  horizontalList: {
    display: "flex",
    flexDirection: "row",
    padding: 0
  },
  verticalList: {
    display: "flex",
    flexDirection: "column",
    padding: 0
  }
});

class TrendControlVerticalComponent extends Component {
  render() {
    let {
      autoRange,
      onZoomInClicked,
      onZoomOutClicked,
      onMoveUpClicked,
      onMoveDownClicked,
      onAutoResizeClicked,
      classes
    } = this.props;
    return (
      <List className={classes.verticalList}>
        <ListItem>
          <IconButton disabled={autoRange} onClick={onMoveUpClicked}>
            <ArrowUpward />
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
              <SwapVerticalCircle />
            ) : (
              <SwapVerticalCircleOutlined />
            )}
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton disabled={autoRange} onClick={onZoomOutClicked}>
            <ZoomOut />
          </IconButton>
        </ListItem>
        <ListItem>
          <IconButton disabled={autoRange} onClick={onMoveDownClicked}>
            <ArrowDownward />
          </IconButton>
        </ListItem>
      </List>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const componentWithStyles = withStyles(styles)(TrendControlVerticalComponent);

export default connect(
  mapStateToProps,
  {}
)(componentWithStyles);
