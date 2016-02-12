import d3 from 'd3';

export default (dimensions) => {
    const getVolumeHistogramData = (tradeData, minTime, maxTime, tradeVolumeBinSizeInMinutes = 5) => {
        const bindsByInterval = d3
            .time
            .scale()
            .domain([
                minTime,
                maxTime
            ])
            .clamp(true)
            .ticks(d3.time.minute, tradeVolumeBinSizeInMinutes);

        const histogramFunction = d3
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

    const getVolumeHistogramDataSumDomain = (volumeHistogramData) => {
        return [
            0,
            d3.max(volumeHistogramData, (tradeBin) => {
                return tradeBin.volumeSum;
            })
        ];
    };

    const getVolumeHistogramDataSumScale = (histogramDataSumDomain) => {
        return d3
            .scale
            .linear()
            .domain(histogramDataSumDomain)
            .range([
                dimensions.height - dimensions.margin.top - dimensions.margin.bottom,
                0
            ]);
    };

    return {
        getVolumeHistogramData,
        getVolumeHistogramDataSumDomain,
        getVolumeHistogramDataSumScale
    };
};
