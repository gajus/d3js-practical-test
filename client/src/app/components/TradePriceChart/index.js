/* eslint-disable one-var, init-declarations */

import _ from 'lodash';
import React from 'react';
import drawTradePriceChart from './drawTradePriceChart';
import calculateTradePriceChart from './calculateTradePriceChart';

export default class extends React.Component {
    updateChart = (drawnTradePriceChart, calculateTradePriceChart, tradeData, stockName) => {
        let {
            clean,
            drawHorizontalGrid,
            drawVerticalGrid,
            drawTradeDataTimeAxis,
            drawTradeDataPriceAxis,
            drawTradeLineChart,
            drawVolumeHistogramChart,
            drawVolumeHistogramDataSumAxis
        } = drawnTradePriceChart;

        let {
            getTradeDataTimeDomain,
            getTradeDataPriceDomain,
            getTradeDataTimeScales,
            getTradeDataPriceScales
        } = calculateTradePriceChart;

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

        let tradesGoupedByExchange = _.groupBy(tradeData, 'exchange');

        _.forEach(tradesGoupedByExchange, (tradesInExchange, exchangeName) => {
            drawTradeLineChart('exchange-' + exchangeName.toLowerCase(), tradesInExchange, tradeDataTimeScale, tradeDataPriceScale);
        });

        drawTradeDataTimeAxis(tradeDataTimeScale);
        drawTradeDataPriceAxis(tradeDataPriceScale, stockName);
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

        this.drawnTradePriceChart = drawTradePriceChart(this.refs.chart, chartDimensions);
        this.calculatedTradePriceChart = calculateTradePriceChart(chartDimensions);

        this.updateChart(this.drawnTradePriceChart, this.calculatedTradePriceChart, this.props.trades, this.props.stockName);
    }

    shouldComponentUpdate (nextProps) {
        this.updateChart(this.drawnTradePriceChart, this.calculatedTradePriceChart, nextProps.trades, nextProps.stockName);

        return false;
    }

    render () {
        return <div ref='chart' className='chart'></div>;
    }
};
