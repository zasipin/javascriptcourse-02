import gulp from "gulp";
import webpack from "webpack";
import chalk from "chalk";
import rimraf from "rimraf";
import { create as createServerConfig } from "./webpack.server";

const $ = require("gulp-load-plugins")();

// -------------------------------------------
// Public tasks

gulp.task("clean:server", cb => rimraf("/build", cb));
gulp.task("clean:client", cb => rimraf("/public/build", cb));
gulp.task("clean", gulp.parallel("clean:server", "clean:client"));

gulp.task("dev:server", gulp.series("clean:server", devServerBuild));

gulp.task("prod:server", gulp.series("clean:server", prodServerBuild));

// -------------------------------------------
// Private server tasks
const devServerWebpack = webpack(createServerConfig(false)); 

function devServerBuild(callback) {
	devServerWebpack.run((error, stats) => {
		outputWebpack("Dev:Server", error, stats);
		callback();
	}
}

function prodServerBuild(callback) {

}

// -------------------------------------------
// Helpers
function outputWebpack(label, error, stats) {
	console.log(stats.toString());
}
