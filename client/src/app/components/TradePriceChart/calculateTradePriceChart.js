import d3 from 'd3';

export default (dimensions) => {
    const getTradeDataTimeDomain = (trades) => {
        return d3.extent(trades, (trade) => {
            return trade.time;
        });
    };

    const getTradeDataPriceDomain = (trades) => {
        return d3.extent(trades, (trade) => {
            return trade.price;
        });
    };

    const getTradeDataTimeScales = (minTime, maxTime) => {
        return d3
            .time
            .scale()
            .domain([
                minTime,
                maxTime
            ])
            .range([
                dimensions.margin.left,
                dimensions.width - dimensions.margin.right
            ]);
    };

    const getTradeDataPriceScales = (minPrice, maxPrice) => {
        return d3
            .scale
            .linear()
            .domain([
                minPrice,
                maxPrice
            ])
            .range([
                dimensions.height - dimensions.margin.bottom,
                dimensions.margin.top
            ]);
    };

    return {
        getTradeDataTimeDomain,
        getTradeDataPriceDomain,
        getTradeDataTimeScales,
        getTradeDataPriceScales
    };
};
