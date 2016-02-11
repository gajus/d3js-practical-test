/* eslint-disable one-var, init-declarations */

import _ from 'lodash';
import React from 'react';
import './styles.scss';
import drawChart from './drawChart';
import calculateChart from './calculateChart';

export default class extends React.Component {
    updateChart = (drawChart, calculateChart, tradeData, stockName) => {
        let {
            clean,
            drawHorizontalGrid,
            drawVerticalGrid,
            drawTradeDataTimeAxis,
            drawTradeDataPriceAxis,
            drawTradeLineChart,
            drawVolumeHistogramChart,
            drawVolumeHistogramDataSumAxis
        } = drawChart;

        let {
            getTradeDataTimeDomain,
            getTradeDataPriceDomain,
            getTradeDataTimeScales,
            getTradeDataPriceScales,
            getVolumeHistogramData,
            getVolumeHistogramDataSumDomain,
            getVolumeHistogramDataSumScale
        } = calculateChart;

        clean();

        let [
            minTime,
            maxTime
        ] = getTradeDataTimeDomain(tradeData);

        let [
            minPrice,
            maxPrice
        ] = getTradeDataPriceDomain(tradeData);

        let tradeDataTimeScale = getTradeDataTimeScales(minTime, maxTime);
        let tradeDataPriceScale = getTradeDataPriceScales(minPrice, maxPrice);

        drawHorizontalGrid(tradeDataTimeScale, tradeDataPriceScale);
        drawVerticalGrid(tradeDataTimeScale, tradeDataPriceScale);

        let volumeHistogramData = getVolumeHistogramData(tradeData, minTime, maxTime);
        let volumeHistogramDataSumDomain = getVolumeHistogramDataSumDomain(volumeHistogramData);
        let volumeHistogramDataSumScale = getVolumeHistogramDataSumScale(volumeHistogramDataSumDomain);

        drawVolumeHistogramChart(volumeHistogramData, tradeDataTimeScale, volumeHistogramDataSumScale);

        drawVolumeHistogramDataSumAxis(volumeHistogramDataSumScale);

        let tradesGoupedByExchange = _.groupBy(tradeData, 'exchange');

        _.forEach(tradesGoupedByExchange, (tradesInExchange, exchangeName) => {
            drawTradeLineChart('exchange-' + exchangeName.toLowerCase(), tradesInExchange, tradeDataTimeScale, tradeDataPriceScale);
        });

        drawTradeDataTimeAxis(tradeDataTimeScale, tradeDataPriceScale);
        drawTradeDataPriceAxis(tradeDataTimeScale, tradeDataPriceScale, stockName);
    };

    componentDidMount () {
        const chartDimensions = {
            width: 960,
            height: 500,
            margin: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 50
            }
        };

        this.drawChart = drawChart(this.refs.chart, chartDimensions);
        this.calculateChart = calculateChart(chartDimensions);

        this.updateChart(this.drawChart, this.calculateChart, this.props.trades, this.props.stockName);
    }

    shouldComponentUpdate (nextProps) {
        this.updateChart(this.drawChart, this.calculateChart, nextProps.trades, nextProps.stockName);

        return false;
    }

    render () {
        return <div ref='chart' className='chart'></div>;
    }
};
