import d3 from 'd3';

export default (element, dimensions) => {
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

    let drawVolumeHistogramDataSumAxis = (yScale, numberOfTicks = 5) => {
        let volumeChartYAxis = d3.svg
            .axis()
            .scale(yScale)
            .ticks(numberOfTicks)
            .orient('right')

        svg
            .append('g')
            .attr('class', 'axis volume')
            .attr('transform', 'translate(' + dimensions.margin.left + ', 0)')
            .call(volumeChartYAxis);
    };

    return {
        clean,
        drawVolumeHistogramChart,
        drawVolumeHistogramDataSumAxis
    };
};
