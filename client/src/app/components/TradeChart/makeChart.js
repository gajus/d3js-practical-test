export default (element) => {
    const chartWidth = 960;
    const chartHeight = 500;
    const chartMargin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
    };

    const volumeChartHeight = chartHeight / 4;

    const body = d3
        .select(element);

    const svg = body
        .append('svg')
        .attr({
            width: chartWidth,
            height: chartHeight
        });

    let clean = () => {
        svg.selectAll('*').remove();
    };

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
                chartMargin.left,
                chartWidth - chartMargin.right
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
                chartHeight - chartMargin.bottom,
                chartMargin.top
            ]);
    };

    let drawHorizontalGrid = (xScale, yScale, numberOfTicks = 10) => {
        let horizontalGridGroup = svg
            .append('g')
            .attr('class', 'grid-horizontal');

        horizontalGridGroup
            .selectAll('line')
            .data(yScale.ticks(numberOfTicks))
            .enter()
            .append('line')
            .attr({
                x1: chartMargin.left,
                x2: chartWidth - chartMargin.right,
                y1: (tick) => {
                    return yScale(tick);
                },
                y2: (tick) => {
                    return yScale(tick);
                }
            });
    };

    let drawVerticalGrid = (xScale, yScale, numberOfTicks = 10) => {
        let verticalGridGroup = svg
            .append('g')
            .attr('class', 'grid-vertical');

        verticalGridGroup
            .selectAll('line')
            .data(xScale.ticks(numberOfTicks))
            .enter()
            .append('line')
            .attr({
                x1: (tick) => {
                    return xScale(tick);
                },
                x2: (tick) => {
                    return xScale(tick);
                },
                y1: chartMargin.top,
                y2: chartHeight - chartMargin.bottom
            });
    };

    let drawTradeDataTimeAxis = (xScale, yScale, tickSizeInMinutes = 30) => {
        let xAxis = d3.svg
            .axis()
            .scale(xScale)
            .orient('top')
            .ticks(d3.time.minute, tickSizeInMinutes);

        let xAxisGroup = svg
            .append('g')
            .attr('class', 'axis time')
            .attr('transform', 'translate(0, ' + (chartHeight - chartMargin.bottom) + ')')
            .call(xAxis);
    };

    let drawTradeDataPriceAxis = (xScale, yScale, labelText) => {
        let yAxis = d3.svg
            .axis()
            .scale(yScale)
            .orient('left');

        let yAxisGroup = svg
            .append('g')
            .attr('class', 'axis price')
            .attr('transform', 'translate(' + chartMargin.left + ', 0)')
            .call(yAxis);

        let yAxisLabel = yAxisGroup
            .append('text')
            .attr({
                x: 10,
                y: chartMargin.top,
                dy: '1em',
                class: 'label'
            })
            .text(labelText);
    };

    let drawTradeLineChart = (className, tradeData, xScale, yScale) => {
        let tradeLineGroup = svg
            .append('g')
            .attr('class', 'line-chart ' + className);

        let lineFunction = d3
            .svg
            .line()
            .x((trade) => {
                return xScale(trade.time);
            })
            .y((trade) => {
                return yScale(trade.price)
            })
            .interpolate('linear');

        tradeLineGroup
            .append('path')
            .attr('d', lineFunction(tradeData));
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
                volumeChartHeight - chartMargin.bottom,
                0
            ]);
    };

    let drawVolumeHistogramChart = (volumeHistogramData, xScale, yScale) => {
        let volumeGraph = svg
            .append('g')
            .attr('class', 'volume-graph');

        let bar = volumeGraph
            .selectAll('rect')
            .data(volumeHistogramData)
            .enter()
            .append('rect');

        bar
            .attr({
                x: (tradeBin) => {
                    return xScale(tradeBin.x);
                },
                y: (tradeBin) => {
                    return chartHeight - chartMargin.bottom - yScale(tradeBin.volumeSum);
                },
                width: (tradeBin) => {
                    return xScale(new Date(tradeBin.x.getTime() + tradeBin.dx)) - xScale(tradeBin.x) - 1;
                },
                height: (tradeBin) => {
                    return yScale(tradeBin.volumeSum);
                },
                class: (tradeBin) => {
                    let volumeBarClassName = 'volume-bar';

                    if (tradeBin.change === -1) {
                        volumeBarClassName += ' change-down';
                    } else if (tradeBin.change === 1) {
                        volumeBarClassName += ' change-up';
                    }

                    return volumeBarClassName;
                }
            });
    };

    let drawVolumeHistogramDataSumAxis = (yScale) => {
        let volumeChartYAxis = d3.svg
            .axis()
            .scale(yScale)
            .ticks(2)
            .orient('right')

        svg
            .append('g')
            .attr('class', 'axis volume')
            .attr('transform', 'translate(' + chartMargin.left + ', ' + (chartHeight - volumeChartHeight) + ')')
            .call(volumeChartYAxis);
    };

    return {
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
    };
};
