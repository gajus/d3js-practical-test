import _ from 'lodash';
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './../webpack.config';
import tradeData from './../tradeData.json';

let app,
    compiler;

const HOST = '127.0.0.1',
    PORT = 8000;

app = express();

compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.get('/data', (req, res) => {
    let trades;

    trades = _.map(tradeData.data, (trade) => {
        return _.pick(trade, [
            'stock',
            'exchange',
            'price',
            'time',
            'volume'
        ]);
    });

    res.json({
        stocks: tradeData.stocks,
        exchanges: tradeData.exchanges,
        trades: trades
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../endpoint/index.html'));
});

app.listen(PORT, HOST, (err) => {
    if (err) {
        /* eslint-disable no-console */
        console.log(err);
        /* eslint-enable no-console */

        return;
    }

    /* eslint-disable no-console */
    console.log('Listening at http://' + HOST + ':' + PORT);
    /* eslint-enable no-console */
});
