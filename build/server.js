/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	__webpack_require__(1);
	
	var _express = __webpack_require__(2);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _http = __webpack_require__(3);
	
	var _http2 = _interopRequireDefault(_http);
	
	var _socket = __webpack_require__(4);
	
	var _socket2 = _interopRequireDefault(_socket);
	
	var _chalk = __webpack_require__(5);
	
	var _chalk2 = _interopRequireDefault(_chalk);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var isDevelopment = process.env.NODE_ENV !== "production";
	
	// -------------------
	// setup
	var app = (0, _express2.default)();
	var server = _http2.default.Server(app);
	var io = (0, _socket2.default)(server);
	
	// -------------------
	// Client webpack 
	if (process.env.USE_WEBPACK === "true") {
		var webpackMiddleware = __webpack_require__(6),
		    webpack = __webpack_require__(7),
		    clientConfig = __webpack_require__(8),
		    webpackHotMiddleware = __webpack_require__(11);
		var compiler = webpack(clientConfig);
		app.use(webpackMiddleware(compiler, {
			pablickPath: "/build/",
			stats: {
				colors: true,
				chunks: false,
				assets: false,
				modules: false,
				hash: false,
				version: false
			}
		}));
	
		app.use(webpackHotMiddleware(compiler));
	
		console.log(_chalk2.default.bgRed("Using WebPack Dev Middleware! THIS IS FOR DEV ONLY"));
	}
	
	// -------------------
	// Configure Express
	app.set("view engine", "jade");
	app.use(_express2.default.static("public"));
	
	var useExternalStyles = !isDevelopment;
	app.get("/", function (req, res) {
		res.render("index", {
			useExternalStyles: useExternalStyles
		});
	});
	
	// -------------------
	// Modules
	
	
	// -------------------
	// Socket
	io.on("connection", function (socket) {
		console.log("got connection from " + socket.request.connection.remoteAddress);
	});
	
	// -------------------
	// Starting
	
	
	var port = process.env.PORT || 3000;
	
	function startServer() {
		server.listen(port, function () {
			console.log("Started http server on " + port + " port");
		});
	}
	
	startServer();

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("source-map-support/register");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("chalk");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("webpack-dev-middleware");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("webpack");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var path = __webpack_require__(9),
	    webpack = __webpack_require__(7),
	    ExtractTextPlugin = __webpack_require__(10);
	
	var dirname = path.resolve("./");
	
	var vendorModules = ["jquery", "lodash"];
	
	function createConfig(isDebug) {
	    var devTool = isDebug ? "eval-source-map" : "source-map";
	    var plugins = [new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js")];
	
	    var cssLoader = { test: /\.css$/, loader: "style!css" };
	    var sassLoader = { test: /\.scss$/, loader: "style!css!sass" };
	    var appEntry = ["./src/client/application.js"];
	
	    if (!isDebug) {
	        // plugins.push(new webpack.optimize.UglifyJsPlugin());
	        plugins.push(new ExtractTextPlugin("[name].css"));
	
	        cssLoader.loader = ExtractTextPlugin.extract("style", "css");
	        sassLoader.loader = ExtractTextPlugin.extract("style", "css!sass");
	    } else {
	        plugins.push(new webpack.HotModuleReplacementPlugin());
	        appEntry.splice(0, 0, "webpack-hot-middleware/client");
	    }
	
	    // WEBPACK CONFIG
	    return {
	        devtool: devTool,
	        entry: {
	            // ["webpack-hot-middleware/client", "./src/client/application.js"]
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
	            loaders: [{ test: /\.js$/, loader: "babel", exclude: /node_modules/ }, { test: /\.js$/, loader: "eslint", exclude: /node_modules/ }, { test: /\.(png|jpg|jpeg|gif|woff|ttf|svg|eot|woff2)$/, loader: "url-loader?limit=512" }, cssLoader, sassLoader]
	        },
	        plugins: plugins
	    };
	}
	
	module.exports = createConfig(true);
	module.exports.create = createConfig;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("extract-text-webpack-plugin");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("webpack-hot-middleware");

/***/ }
/******/ ]);
//# sourceMappingURL=server.js.map