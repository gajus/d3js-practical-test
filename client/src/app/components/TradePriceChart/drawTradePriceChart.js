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

    let drawTradeDataTimeAxis = (xScale, tickSizeInMinutes = 30) => {
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

    let drawTradeDataPriceAxis = (yScale, labelText) => {
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

    return {
        clean,
        drawHorizontalGrid,
        drawVerticalGrid,
        drawTradeDataTimeAxis,
        drawTradeDataPriceAxis,
        drawTradeLineChart
    };
};
