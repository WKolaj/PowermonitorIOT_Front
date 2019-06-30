import React, { Component } from "react";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Chart } from "react-google-charts";
import {
  createTrendActionCreator,
  updateTrendActionCreator,
  removeTrendActionCreator,
  fetchCurrentValueActionCreator,
  fetchHistoryValuesActionCreator,
  xZoomInActionCreator,
  xZoomOutActionCreator,
  yZoomInActionCreator,
  yZoomOutActionCreator,
  xMoveLeftActionCreator,
  xMoveRightActionCreator,
  yMoveDownActionCreator,
  yMoveUpActionCreator,
  toogleXAutoRangeActionCreator,
  toogleYAutoRangeActionCreator,
  refreshActionCreator
} from "../../actions/trendsActionCreator";
import TrendControlVertical from "./TrendControlVerticalComponent";
import TrendControlHorizontal from "./TrendControlHorizontalComponent";
import translate from "../../translator/Translator";
import valuesService from "../../services/valuesService";
import {
  exists,
  now,
  msToDate,
  dateToMs,
  tickNumberToDate,
  msToTickNumber,
  tickNumberToMs,
  isEmpty
} from "../../utilities/utilities";
import moment from "moment";
import { fetchElementActionCreator } from "../../actions/dataActionCreator";
import userService from "../../services/userService.js";

const styles = theme => ({
  gridFullWidthAndHeight: { height: "100%", width: "100%" },
  gridFullWidth: { width: "100%" },
  gridFullHeight: { height: "100%" },
  title: {},
  progress: {
    width: 200,
    height: 200,
    margin: theme.spacing(2)
  }
});

class TrendComponent extends Component {
  handleSampling = async () => {
    let { trendId, variableId, deviceId, user } = this.props;

    if (userService.canVisualizeData(user)) {
      this.props.refresh(trendId, variableId, deviceId);
    }
  };

  startSampling = () => {
    this._samplingHandler = setInterval(this.handleSampling, 500);
  };

  stopSampling = () => {
    clearInterval(this._samplingHandler);
  };

  create = async () => {
    let {
      user,
      createTrend,
      fetchElement,
      trendId,
      variableId,
      deviceId,
      initialAutoRangeX,
      initialAutoRangeY,
      currentValuesRefreshing,
      historyValuesRefreshing,
      initialRanges
    } = this.props;

    if (userService.canVisualizeData(user)) {
      await createTrend(
        trendId,
        variableId,
        deviceId,
        initialAutoRangeX,
        initialAutoRangeY,
        currentValuesRefreshing,
        historyValuesRefreshing,
        initialRanges
      );
      await fetchElement(deviceId, variableId);
    }
    this.startSampling();
  };

  componentWillUnmount = () => {
    if (this._samplingHandler) this.stopSampling();
    this.props.removeTrend(this.props.trendId);
  };

  static generateTrendId(deviceId, variableId) {
    return `${deviceId}${variableId}`;
  }

  static formatTrendTooltip(dataMsTime, value) {
    let dateText = moment(msToDate(parseInt(dataMsTime))).format(
      "DD/MM/YYYY HH:mm:ss"
    );

    return `${value.toFixed(3)}\n${dateText}`;
  }

  /**
   * @description Method for converting object stored in Redux to Array if points
   * @param {Object} stateData Object in format stored in Redux
   */
  static convertStateDataToTrendData(stateData) {
    if (stateData === {}) return [];

    //Sorting by date
    let dataMsTimes = Object.keys(stateData).sort(function(a, b) {
      return parseInt(a) - parseInt(b);
    });

    return dataMsTimes.map(dataMsTime => [
      msToDate(parseInt(dataMsTime)),
      stateData[dataMsTime],
      TrendComponent.formatTrendTooltip(dataMsTime, stateData[dataMsTime])
    ]);
  }

  static generateOptionsForChartComponent(trendObject) {
    let options = {
      title: "",
      hAxis: { title: "" },
      vAxis: { title: "" },
      legend: "none",
      chartArea: { width: "90%", height: "90%" }
    };

    let { properties } = trendObject;

    options.hAxis = {
      ...options.hAxis,
      format: "dd/MM/yyyy HH:mm:ss",
      viewWindow: {
        min: msToDate(properties.ranges.timeMin),
        max: msToDate(properties.ranges.timeMax)
      }
    };

    options.vAxis = {
      ...options.vAxis,
      viewWindow: {
        min: properties.ranges.valueMin,
        max: properties.ranges.valueMax
      }
    };

    return options;
  }

  static generateDataToSave(stateData, minTime, maxTime) {
    //Filter elements
    let filteredData = Object.keys(stateData).filter(function(a) {
      return parseInt(a) >= minTime && parseInt(a) <= maxTime;
    });

    //Sorting by date
    let dataMsTimes = filteredData.sort(function(a, b) {
      return parseInt(a) - parseInt(b);
    });

    return dataMsTimes.map(dataMsTime => {
      return {
        time: moment(msToDate(parseInt(dataMsTime))).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
        value: stateData[dataMsTime]
      };
    });
  }

  renderBusyComponent = () => {
    return (
      <Grid
        className={this.props.classes.gridFullWidthAndHeight}
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item>
          <CircularProgress
            className={this.props.classes.progress}
            size={150}
            thickness={5}
          />
        </Grid>
      </Grid>
    );
  };

  renderTitleText = () => {
    let { elementObject, deviceObject } = this.props;

    return elementObject && deviceObject
      ? `${deviceObject.name} - ${elementObject.name} [${elementObject.unit}]`
      : "";
  };

  render() {
    let {
      classes,
      trendId,
      trendObject,
      xZoomIn,
      xZoomOut,
      yZoomIn,
      yZoomOut,
      xMoveLeft,
      xMoveRight,
      yMoveDown,
      yMoveUp,
      toogleXAutoRange,
      toogleYAutoRange
    } = this.props;

    //Creating a trend and returning if trend not initialized
    if (!trendObject) {
      this.create();
      return this.renderBusyComponent();
    }

    if (isEmpty(trendObject.data.values)) return this.renderBusyComponent();

    let options = TrendComponent.generateOptionsForChartComponent(trendObject);

    let trendValues = TrendComponent.convertStateDataToTrendData(
      trendObject.data.values
    );

    let csvData = TrendComponent.generateDataToSave(
      trendObject.data.values,
      trendObject.properties.ranges.timeMin,
      trendObject.properties.ranges.timeMax
    );
    let csvValueTitle = this.renderTitleText();

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        className={classes.gridFullWidthAndHeight}
      >
        <Grid item>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Typography variant="h4" className={classes.title}>
              {this.renderTitleText()}
            </Typography>
          </Grid>
        </Grid>

        <Grid item sm>
          <Grid
            className={classes.gridFullWidthAndHeight}
            container
            direction="column"
            justify="center"
            alignItems="stretch"
            wrap="nowrap"
          >
            <Grid item sm>
              <Grid
                className={classes.gridFullWidthAndHeight}
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                wrap="nowrap"
              >
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.gridFullHeight}
                    wrap="nowrap"
                  >
                    <TrendControlVertical
                      onZoomInClicked={() => yZoomIn(trendId)}
                      onZoomOutClicked={() => yZoomOut(trendId)}
                      onMoveUpClicked={() => yMoveUp(trendId)}
                      onMoveDownClicked={() => yMoveDown(trendId)}
                      onAutoResizeClicked={() => toogleYAutoRange(trendId)}
                      autoRange={trendObject.properties.autoRangeY}
                    />
                  </Grid>
                </Grid>
                <Grid item sm>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    className={classes.gridFullWidthAndHeight}
                    wrap="nowrap"
                  >
                    <Chart
                      chartType="SteppedAreaChart"
                      rows={trendValues}
                      options={options}
                      width="95%"
                      height="95%"
                      graphID="ScatterChart"
                      columns={[
                        {
                          type: "date",
                          label: ""
                        },
                        {
                          type: "number",
                          label: ""
                        },
                        { role: "tooltip", type: "string", p: { html: true } }
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                className={classes.gridFullWidthAndHeight}
                container
                direction="row"
                justify="center"
                alignItems="center"
                wrap="nowrap"
              >
                <TrendControlHorizontal
                  onZoomInClicked={() => xZoomIn(trendId)}
                  onZoomOutClicked={() => xZoomOut(trendId)}
                  onMoveRightClicked={() => xMoveRight(trendId)}
                  onMoveLeftClicked={() => xMoveLeft(trendId)}
                  onAutoResizeClicked={() => toogleXAutoRange(trendId)}
                  autoRange={trendObject.properties.autoRangeX}
                  csvData={csvData}
                  csvValueTitle={csvValueTitle}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );

    // return (

    // );
  }
}

const mapStateToProps = (state, props) => {
  let { variableId, deviceId } = props;
  let trendId = TrendComponent.generateTrendId(deviceId, variableId);

  //Getting element from data
  let element;
  if (state.data.devices[deviceId]) {
    //Checking if element is varaible or calcElement
    if (variableId in state.data.devices[deviceId].variables) {
      element = state.data.devices[deviceId].variables[variableId];
    } else {
      element = state.data.devices[deviceId].calculationElements[variableId];
    }
  }

  return {
    trendId: trendId,
    user: state.user.currentUser,
    trendObject: state.trends[trendId],
    lang: state.userPreferences.lang,
    deviceObject: state.data.devices[props.deviceId],
    elementObject: element
  };
};

const componentWithStyles = withStyles(styles)(TrendComponent);

export default connect(
  mapStateToProps,
  {
    createTrend: createTrendActionCreator,
    updateTrend: updateTrendActionCreator,
    removeTrend: removeTrendActionCreator,
    fetchCurrentValue: fetchCurrentValueActionCreator,
    fetchHistoryValues: fetchHistoryValuesActionCreator,
    xZoomIn: xZoomInActionCreator,
    xZoomOut: xZoomOutActionCreator,
    yZoomIn: yZoomInActionCreator,
    yZoomOut: yZoomOutActionCreator,
    xMoveLeft: xMoveLeftActionCreator,
    xMoveRight: xMoveRightActionCreator,
    yMoveDown: yMoveDownActionCreator,
    yMoveUp: yMoveUpActionCreator,
    refresh: refreshActionCreator,
    toogleXAutoRange: toogleXAutoRangeActionCreator,
    toogleYAutoRange: toogleYAutoRangeActionCreator,
    fetchElement: fetchElementActionCreator
  }
)(componentWithStyles);
