import $ from "jquery";
import _ from "lodash";
import {blegh} from "shared/test";
import "./application.scss";

blegh();

setTimeout(()=>{
	$("body").html("asd");	
}, 1000);

console.log(_);

if(module.hot){
	module.hot.accept();
}