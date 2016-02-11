import d3 from 'd3';

export default (element, dimensions) => {
    const volumedimensionsHeight =  100;

    const body = d3
        .select(element);

    const svg = body
        .append('svg')
        .attr({
            width: dimensions.width,
            height: dimensions.height
        });

    let clean = () => {
        svg.selectAll('*').remove();
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
                x1: dimensions.margin.left,
                x2: dimensions.width - dimensions.margin.right,
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
                y1: dimensions.margin.top,
                y2: dimensions.height - dimensions.margin.bottom
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
            .attr('transform', 'translate(0, ' + (dimensions.height - dimensions.margin.bottom) + ')')
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
            .attr('transform', 'translate(' + dimensions.margin.left + ', 0)')
            .call(yAxis);

        let yAxisLabel = yAxisGroup
            .append('text')
            .attr({
                x: 10,
                y: dimensions.margin.top,
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
                    return dimensions.height - dimensions.margin.bottom - yScale(tradeBin.volumeSum);
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
            .attr('transform', 'translate(' + dimensions.margin.left + ', ' + (dimensions.height - volumedimensionsHeight) + ')')
            .call(volumeChartYAxis);
    };

    return {
        clean,
        drawHorizontalGrid,
        drawVerticalGrid,
        drawTradeDataTimeAxis,
        drawTradeDataPriceAxis,
        drawTradeLineChart,
        drawVolumeHistogramChart,
        drawVolumeHistogramDataSumAxis
    };
};
