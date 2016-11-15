var path = require("path"),
    webpack = require("webpack"),
    ExtractTextPlugin    = require("extract-text-webpack-plugin");

const dirname = path.resolve("./");

const vendorModules = ["jquery", "lodash"];

function createConfig(isDebug) {
    const devTool = isDebug ? "eval-source-map" : "source-map";
    const plugins = [new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")];

    const cssLoader = {test: /\.css$/, loader: "style!css"};
    const sassLoader = {test: /\.scss$/, loader: "style!css!sass"};
    const appEntry = ["./src/client/application.js"];

    if(!isDebug) {
        // plugins.push(new webpack.optimize.UglifyJsPlugin());
        plugins.push(new ExtractTextPlugin("[name].css"));

        cssLoader.loader = ExtractTextPlugin.extract("style", "css");
        sassLoader.loader = ExtractTextPlugin.extract("style", "css!sass");
    }

    // WEBPACK CONFIG
    return {
        devtool: devTool,
        entry: {
            application: appEntry,
            vendor: vendorModules
        },
        output: {
            path: path.join(dirname, "public", "build"),
            filename: "[name].js",
            publicPath: "/build/"
        },
        resolve: {
            alias: {
                shared: path.join(dirname, "src", "shared")
            }
        },
        modules: {
            loaders: [
                {test: /\.js$/, loader: "babel", exclude: /node_modules/},
                {test: /\.js$/, loader: "eslint", exclude: /node_modules/},
                {test: /\.(png|jpg|jpeg|gif|woff|ttf|svg|eot|woff2)$/, loader: "url-loader?limit=512"},
                cssLoader,
                sassLoader
            ]
        },
        plugins: plugins
    };
}

module.exports = createConfig(true);
module.exports.create = createConfig;