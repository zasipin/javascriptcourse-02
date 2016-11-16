import "source-map-support/register";
 
import express from "express";
import http from "http";
import socketIo from "socket.io";
import chalk from "chalk";

const isDevelopment = process.env.NODE_ENV !== "production"; 

// -------------------
// setup
const app = express();
const server = http.Server(app);
const io = socketIo(server);



// -------------------
// Client webpack 
if(process.env.USE_WEBPACK === "true"){
	var webpackMiddleware = require("webpack-dev-middleware"),
		webpack = require("webpack"),
		clientConfig = require("../../webpack.client"),
		webpackHotMiddleware = require("webpack-hot-middleware");
	const compiler = webpack(clientConfig);
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
	
	console.log(chalk.bgRed("Using WebPack Dev Middleware! THIS IS FOR DEV ONLY"));
}

// -------------------
// Configure Express
app.set("view engine", "jade");
app.use(express.static("public"));

const useExternalStyles = isDevelopment;
app.get("/", (req, res)=> {
	res.render("index", {
		useExternalStyles
	});
});

// -------------------
// Modules


// -------------------
// Socket
io.on("connection", (socket) => {
	console.log(`got connection from ${socket.request.connection.remoteAddress}`);
});

// -------------------
// Starting


const port = process.env.PORT || 3000;

function startServer(){
	server.listen(port, () => {
		console.log(`Started http server on ${port} port`);
	});
}

startServer();

