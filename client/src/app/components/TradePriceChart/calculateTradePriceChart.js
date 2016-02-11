import d3 from 'd3';

export default (dimensions) => {
    const volumedimensionsHeight = 100;

    let getTradeDataTimeDomain = (trades) => {
        return d3.extent(trades, (trade) => {
            return trade.time;
        });
    };

    let getTradeDataPriceDomain = (trades) => {
        return d3.extent(trades, (trade) => {
            return trade.price;
        });
    };

    let getTradeDataTimeScales = (minTime, maxTime) => {
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

    let getTradeDataPriceScales = (minPrice, maxPrice) => {
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
