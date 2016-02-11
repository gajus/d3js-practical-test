# d3.js Practical Test

This chart displays:

* A single stock price over time
* Using a separate line chart to represent trade price in every exchange (useless, I know)
* An aggregate trade volume

I wouldn't call this a "reusable" chart library. A lot of the logic depends on the dataset and it is abstracted at a relatively high level. Turning individual chart components into reusable, testable components and detaching them from the dataset would require more time.

All of the chart drawing logic is in [`./client/src/app/components/TradeChart/makeChart.js`](./client/src/app/components/TradeChart/makeChart.js)

Most of the time I have spent (in that order):

* learning/ remembering how to use d3.js
* attempting to detach data from the implementation
* researching different visualizations and their applications
* and then did the react/ flux/ server bits in 15 minutes.

What I don't like about my implementation is that all scales depend on having access to `chartWidth`, `chartHeight` and `chartMargin`. This severely restricts re-usability of the functions and adds addition complexity to testing. A better approach would have been to explicitly pass container dimensions to these functions (without margin), wrap elements that require margin in a group and translate position of the group.

The redrawing logic is far from optimal. Not all calculations are needed on every redraw.

## Prerequisites

```sh
npm install babel-cli -g
```

## Starting Client Application

```sh
cd ./client

npm install
npm start
```

This will start the HTTP server on port 8000.
