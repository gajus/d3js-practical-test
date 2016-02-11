import _ from 'lodash';
import React from 'react';
import d3 from 'd3';
import './styles.scss';
import makeChart from './makeChart';

export default class extends React.Component {
    drawChart = (chart, tradeData) => {
        let {
            clean,
            getTradeDataTimeDomain,
            getTradeDataPriceDomain,
            getTradeDataTimeScales,
            getTradeDataPriceScales,
            drawHorizontalGrid,
            drawVerticalGrid,
            drawTradeDataTimeAxis,
            drawTradeDataPriceAxis,
            drawTradeLineChart,
            getVolumeHistogramData,
            getVolumeHistogramDataSumDomain,
            getVolumeHistogramDataSumScale,
            drawVolumeHistogramChart,
            drawVolumeHistogramDataSumAxis
        } = chart;

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

        drawTradeDataTimeAxis(tradeDataTimeScale, tradeDataPriceScale);
        drawTradeDataPriceAxis(tradeDataTimeScale, tradeDataPriceScale, 'GOG');

        let volumeHistogramData = getVolumeHistogramData(tradeData, minTime, maxTime);
        let volumeHistogramDataSumDomain = getVolumeHistogramDataSumDomain(volumeHistogramData);
        let volumeHistogramDataSumScale = getVolumeHistogramDataSumScale(volumeHistogramDataSumDomain);

        drawVolumeHistogramChart(volumeHistogramData, tradeDataTimeScale, volumeHistogramDataSumScale);

        drawVolumeHistogramDataSumAxis(volumeHistogramDataSumScale);

        let tradesGoupedByExchange = _.groupBy(tradeData, 'exchange');

        _.forEach(tradesGoupedByExchange, (tradesInExchange, exchangeName) => {
            drawTradeLineChart('exchange-' + exchangeName.toLowerCase(), tradesInExchange, tradeDataTimeScale, tradeDataPriceScale);
        });
    };

    componentDidMount () {
        this.chart = makeChart(this.refs.chart);

        this.drawChart(this.chart, this.props.trades);
    }

    shouldComponentUpdate () {
        this.drawChart(this.chart, this.props.trades);

        return false;
    }

    render () {
        return <div ref='chart' className='chart'></div>;
    }
};
