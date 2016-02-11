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

    let getVolumeHistogramData = (tradeData, minTime, maxTime, tradeVolumeBinSizeInMinutes = 5) => {
        let bindsByInterval = d3
            .time
            .scale()
            .domain([
                minTime,
                maxTime
            ])
            .clamp(true)
            .ticks(d3.time.minute, tradeVolumeBinSizeInMinutes);

        let histogramFunction = d3
            .layout
            .histogram()
            .value((trade) => {
                return trade.time;
            })
            .bins(bindsByInterval);

        let histogramData = histogramFunction(tradeData);

        histogramData = _.map(histogramData, (tradeBin) => {
            return {
                ...tradeBin,
                volumeSum: _.sum(_.map(tradeBin, 'volume'))
            };
        });

        histogramData = _.map(histogramData, (tradeBin, i) => {
            let change;

            if (!histogramData[i - 1] || histogramData[i - 1].volumeSum === tradeBin.volumeSum) {
                change = 0;
            } else {
                change = histogramData[i - 1].volumeSum > tradeBin.volumeSum ? -1 : 1;
            }

            return {
                ...tradeBin,
                change
            };
        });

        return histogramData;
    };

    let getVolumeHistogramDataSumDomain = (volumeHistogramData) => {
        return [
            0,
            d3.max(volumeHistogramData, (tradeBin) => {
                return tradeBin.volumeSum;
            })
        ];
    };

    let getVolumeHistogramDataSumScale = (histogramDataSumDomain) => {
        return d3
            .scale
            .linear()
            .domain(histogramDataSumDomain)
            .range([
                volumedimensionsHeight - dimensions.margin.bottom,
                0
            ]);
    };

    return {
        getTradeDataTimeDomain,
        getTradeDataPriceDomain,
        getTradeDataTimeScales,
        getTradeDataPriceScales,
        getVolumeHistogramData,
        getVolumeHistogramDataSumDomain,
        getVolumeHistogramDataSumScale
    };
};
