var webpack = require('webpack'),
    path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    debug: true,
    entry: {
        main: './src/app/app.js'
    },
    output:{
        path:path.join(__dirname,'dist'),
        filename:'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        },{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        },{
            test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
            loader: 'file?prefix=public/fonts/'
        },{
            test: /\.png|\.jpg/,
            loader: 'file?prefix=public/assets/'
        },{
            test: /\.html$/,
            loader: 'raw'
        },
            {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader"
            }]
    },
    plugins : [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        })
    ]
};
