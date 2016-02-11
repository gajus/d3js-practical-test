/* eslint-disable one-var, init-declarations */

import _ from 'lodash';
import React from 'react';
import drawTradeVolumeChart from './drawTradeVolumeChart';
import calculateTradeVolumeChart from './calculateTradeVolumeChart';
import calculateTradePriceChart from './../TradePriceChart/calculateTradePriceChart';


export default class extends React.Component {
    updateChart = (drawnTradeVolumeChart, calculateTradeVolumeChart, calculateTradePriceChart, tradeData, stockName) => {
        let {
            clean,
            drawVolumeHistogramChart,
            drawVolumeHistogramDataSumAxis
        } = drawnTradeVolumeChart;

        let {
            getVolumeHistogramData,
            getVolumeHistogramDataSumDomain,
            getVolumeHistogramDataSumScale
        } = calculateTradeVolumeChart;

        let {
            getTradeDataTimeDomain,
            getTradeDataTimeScales
        } = calculateTradePriceChart;

        clean();

        let [
            minTime,
            maxTime
        ] = getTradeDataTimeDomain(tradeData);

        let tradeDataTimeScale = getTradeDataTimeScales(minTime, maxTime);

        // drawHorizontalGrid(tradeDataTimeScale, tradeDataPriceScale);
        // drawVerticalGrid(tradeDataTimeScale, tradeDataPriceScale);

        let volumeHistogramData = getVolumeHistogramData(tradeData, minTime, maxTime);
        let volumeHistogramDataSumDomain = getVolumeHistogramDataSumDomain(volumeHistogramData);
        let volumeHistogramDataSumScale = getVolumeHistogramDataSumScale(volumeHistogramDataSumDomain);

        drawVolumeHistogramChart(volumeHistogramData, tradeDataTimeScale, volumeHistogramDataSumScale);
        drawVolumeHistogramDataSumAxis(volumeHistogramDataSumScale);

        // drawTradeDataTimeAxis(tradeDataTimeScale);
    };

    componentDidMount () {
        const tradePriceChartDimensions = {
            width: 960,
            height: 500,
            margin: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 50
            }
        };

        const tradeVolumeChartDimensions = {
            width: 960,
            height: 200,
            margin: {
                top: 0,
                right: 20,
                bottom: 20,
                left: 50
            }
        };

        this.drawnTradeVolumeChart = drawTradeVolumeChart(this.refs.chart, tradeVolumeChartDimensions);
        this.calculatedTradeVolumeChart = calculateTradeVolumeChart(tradeVolumeChartDimensions);
        this.calculatedPriceVolumeChart = calculateTradePriceChart(tradePriceChartDimensions);

        this.updateChart(this.drawnTradeVolumeChart, this.calculatedTradeVolumeChart, this.calculatedPriceVolumeChart, this.props.trades, this.props.stockName);
    }

    shouldComponentUpdate (nextProps) {
        this.updateChart(this.drawnTradeVolumeChart, this.calculatedTradeVolumeChart, this.calculatedPriceVolumeChart, nextProps.trades, nextProps.stockName);

        return false;
    }

    render () {
        return <div ref='chart' className='chart'></div>;
    }
};
