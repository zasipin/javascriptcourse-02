import "source-map-support/register";
 
import express from "express";
import http from "http";
import socketIo from "socket.io";

const isDevelopment = process.env.NODE_ENV !== "production"; 

// -------------------
// setup
const app = express();
const server = http.Server(app);
const io = socketIo(server);



// -------------------
// Client webpack 

// -------------------
// Configure Express
app.set("view engine", "jade");
app.use(express.static("public"));

const useExternalStyles = !isDevelopment;
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

