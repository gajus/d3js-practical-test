import CleanWebpackPlugin from 'clean-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

let distPath;

distPath = path.resolve(__dirname, './../dist');

export default {
    devtool: 'source-map',
    debug: true,
    context: __dirname,
    entry: {
        'app': [
            'webpack-hot-middleware/client',
            './app'
        ]
    },
    output: {
        path: distPath,
        filename: '[name].js',
        publicPath: '/static/'
    },
    plugins: [
        new CleanWebpackPlugin([
            distPath
        ], {
            root: path.resolve(distPath, '..')
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, './'),
                loader: 'babel'
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style',
                    'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
                    'sass',
                    'resolve-url'
                ]
            },

        ]
    }
};
