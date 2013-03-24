"use strict";

function CurrencyChart(options){
	options = options || {};
	options.grid = options.grid || {};
	options.line = options.line || {};
	options.grid.background = options.grid.background || "transparent";
	options.grid.vColor = options.grid.vColor || "#cccccc";
	options.grid.hColor = options.grid.hColor || "#cccccc";
	options.grid.xAxisColor = options.grid.xAxisColor || "#000000";
	options.grid.yAxisColor = options.grid.yAxisColor || "#000000";
	options.line.color = options.line.color || "rgba(26, 84, 136, 1)";
	options.secondsToShow = options.secondsToShow || 300;
	options.grid.vDensity = 5;
	options.grid.hDensity = 40;
	this.options = options;

	this.start = function(canvas, refershTime){
		this._initialize(canvas, refershTime);
	}
	this.stop = function(){
		this._stop();
	}
	this.refresh = function(options){
		this._refresh(options);
	}
}
CurrencyChart.prototype.RAFCompatibility = (function() {
	var lastTime = 0,
	requestAnimationFrame = function(callback, element) {
	var requestAnimationFrame =
		window.requestAnimationFrame        ||
		window.webkitRequestAnimationFrame  ||
		window.mozRequestAnimationFrame     ||
		window.oRequestAnimationFrame       ||
		window.msRequestAnimationFrame      ||
		function(callback, element) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() {
		  callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	  };
	return requestAnimationFrame.call(window, callback, element);
	},
	cancelAnimationFrame = function(id) {
		var cancelAnimationFrame =
			window.cancelAnimationFrame ||
			function(id) {
				clearTimeout(id);
			};
		return cancelAnimationFrame.call(window, id);
	};
	return {
		requestAnimationFrame: requestAnimationFrame,
		cancelAnimationFrame: cancelAnimationFrame
	};
})();


CurrencyChart.prototype._initialize = function(canvas, refershTime){
	this.canvas = canvas;
	this.refershTime = refershTime;
	this.utils = {};
	this.utils.add = 0;
	this.utils.lastX = 0;
	this.utils.lastY = 0;
	this.utils.gridMin = 0;
	this.utils.gridMax = 0;
	this.utils.startNowPoint = 0.95;
	this.utils.topGap = 10;
	this.utils.leftGap = 50;
	this.utils.rightGap = 10;
	this.utils.bottomGap = 50;
	this.utils.scale = this.canvas.clientHeight/2 - 100;
	this.utils.oldData = {
		x:[],
		y:[]
	};
	this.utils.dataCoords = {
		x:[],
		y:[]
	};
	this.options.pxToSecond = this.canvas.clientWidth*this.utils.startNowPoint / this.options.secondsToShow;
	console.log(this.options.pxToSecond);
	this.ctx = canvas.getContext("2d");
	this._start();
}

CurrencyChart.prototype._run = function(){
	this.process = this.RAFCompatibility.requestAnimationFrame(this._run.bind(this));
	this._render(this.canvas, new Date().getTime() - (this.refershTime || 0));
}
CurrencyChart.prototype._refresh = function(options){
	this._prepareDataCoords(options.data);
	this._renderStatic(this.canvas, new Date().getTime() - (this.refershTime || 0));
	//this._scrollToFit();
	this._run();
}
CurrencyChart.prototype._scrollToFit = function(){
	for (var i = 0; i < this.options.pxToSecond; i++) {
	//for (var i = 0; i < 50; i++) {
		this.ctx.translate(-1, 0);
		this._renderStatic(this.canvas, new Date().getTime() - (this.refershTime || 0));
	};
}
CurrencyChart.prototype._start = function(){
	if(!this.process){
		this._prepareGridlayer();
		this._prepareDataCoords(this.options.data);
		this._renderStatic(this.canvas, new Date().getTime() - (this.refershTime || 0));
		this._run();
		this.step = 0;
	}
}
CurrencyChart.prototype._stop = function(){
	if(this.process){
		this.RAFCompatibility.cancelAnimationFrame(this.process);
		this.process = null;
	}
}
CurrencyChart.prototype._render = function(canvas, delay){
	var ctx = this.ctx;
	var dataDiff = this.options.data.x.length - this.utils.oldData.x.length;
	if(dataDiff > 0) {
		this.step = 0;
		this.utils.oldData.x = this.options.data.x.slice(0);
		this.utils.oldData.y = this.options.data.y.slice(0);
	}
	if(window.qwe1 && window.qwe1 !== undefined) {
		//this.utils.add += 0.1;
		ctx.translate(qwe1, dimensions.top);
	}


	var xc = this.utils.dataCoords.x;
	var yc = this.utils.dataCoords.y;

	var xdiff = (xc[xc.length - 1] - (xc[xc.length - 2]));
	
	var k = (yc[yc.length - 1] - (yc[yc.length - 2]))/xdiff;
	if(this.step < xdiff){
		this.step = this.step +  (xdiff/30);
	}else{
		this.RAFCompatibility.cancelAnimationFrame(this.process);
	}
	ctx.clearRect(xc[xc.length - 2], yc[yc.length - 2],  xc[xc.length - 1] - xc[xc.length - 2], yc[yc.length - 1] - yc[yc.length - 2]);
	ctx.strokeStyle = this.options.line.color;
	ctx.lineWidth = 2;
	ctx.beginPath();

	ctx.moveTo(xc[xc.length - 2], yc[yc.length - 2]);
	ctx.lineCap = 'round';
	ctx.lineTo(xc[xc.length - 2] + this.step, yc[yc.length - 2] + this.step*k);

	//ctx.fillStyle = "rgba(142, 214, 255, "+ this.step +")";
	
	//ctx.fill();
	ctx.closePath();
	ctx.stroke();
}

CurrencyChart.prototype._renderStatic = function(canvas, delay){
	// render previous static elements
	var options = this.options;
	var ctx = this.ctx;
	var dimensions = this.utils.dimensions = {top: 0, left: 0, width: canvas.clientWidth, height: canvas.clientHeight};
	
	ctx.beginPath();
	ctx.rect(0, 0, dimensions.width, dimensions.height);
	ctx.clip();

	ctx.fillStyle = options.grid.background;
	ctx.clearRect(0, 0, dimensions.width, dimensions.height);
	ctx.fillRect(0, 0, dimensions.width, dimensions.height);

	this._drawGrid();
	this._drawXaxis();
	this._drawYaxis();

	var xc = this.utils.dataCoords.x;
	var yc = this.utils.dataCoords.y;

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.strokeStyle = this.options.line.color;
	for (var i = 0, m = xc.length - 2; i <= m; i++) {
		ctx.lineTo(xc[i], yc[i]);
	};
	ctx.stroke();

	ctx.beginPath();
	ctx.rect(50,10, dimensions.width, dimensions.height);
	ctx.clip();
}
CurrencyChart.prototype._getBounds = function(){
	this.utils.gridMin = Math.min.apply( this, this.options.data.y );
	this.utils.gridMax = Math.max.apply( this, this.options.data.y );
}
CurrencyChart.prototype._prepareGridlayer = function(){
	// create the canvas element to draw the drid
	if(this.gridLayer !== undefined) return;
	this.gridLayer = $('<canvas id="grid-layer" class="grid-canvas" width="'+this.canvas.clientWidth+'" height="'+this.canvas.clientHeight+'">Your browser does not support HTML5 Canvas.</canvas>');
	$(this.canvas).parent().append(this.gridLayer);
}
CurrencyChart.prototype._drawGrid = function(){
	var ctx = this.gridLayer.get(0).getContext("2d");
	ctx.lineWidth = 0.5;
	var vStep = this.options.grid.hDensity;
	var hStep = this.options.grid.vDensity;
	
	ctx.clearRect(0,0, this.gridLayer.get(0).clientWidth, this.gridLayer.get(0).clientWidth);
	
	//draw vertical grid lines
	ctx.strokeStyle = this.options.grid.vColor;
	ctx.save();
	ctx.translate(this.utils.leftGap, this.utils.topGap);
	var linestep = (this.utils.dimensions.width - (this.utils.rightGap - this.utils.leftGap))/vStep;
	
	for (var i = 0; i < vStep-1; i++) {
		ctx.beginPath();
		ctx.moveTo(linestep * i, 0);
		ctx.lineTo(linestep * i, this.utils.dimensions.height - this.utils.bottomGap - this.utils.topGap);
		ctx.stroke();
	};
	ctx.restore();

	//draw horizontal grid lines
	ctx.strokeStyle = this.options.grid.hColor;	
	linestep = (this.utils.dimensions.height - this.utils.bottomGap - this.utils.topGap)/hStep;
	ctx.save();
	ctx.translate(this.utils.leftGap, this.utils.topGap);
	for (var i = 0; i < hStep; i++) {
		ctx.beginPath();
		ctx.moveTo(0, linestep * i);
		ctx.lineTo(this.utils.dimensions.width - this.utils.rightGap - this.utils.leftGap, linestep * i);
		ctx.stroke();
	};
	ctx.restore();

	ctx.beginPath();
	ctx.rect(this.utils.leftGap - 1, this.utils.topGap - 1, this.utils.dimensions.width, this.utils.dimensions.width);
	ctx.clip();
}
CurrencyChart.prototype._drawYaxis = function(){
	var ctx = this.gridLayer.get(0).getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle = this.options.grid.xAxisColor;
	ctx.lineWidth = 2;
	ctx.moveTo(this.utils.leftGap, this.canvas.height - this.utils.bottomGap);
	ctx.lineTo(this.utils.leftGap, this.utils.topGap);
	ctx.moveTo(this.canvas.width - this.utils.rightGap, this.utils.topGap);
	ctx.lineTo(this.canvas.width - this.utils.rightGap, this.canvas.height - this.utils.bottomGap);
	ctx.stroke();


	
}
CurrencyChart.prototype._drawXaxis = function(){
	var ctx = this.gridLayer.get(0).getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle = this.options.grid.yAxisColor;
	ctx.lineWidth = 2;
	ctx.moveTo(this.utils.leftGap, this.canvas.height - this.utils.bottomGap);
	ctx.lineTo(this.canvas.width - this.utils.rightGap, this.canvas.height - this.utils.bottomGap);
	ctx.moveTo(this.utils.leftGap, this.utils.topGap);
	ctx.lineTo(this.canvas.width - this.utils.rightGap, this.utils.topGap);
	ctx.stroke();
}
CurrencyChart.prototype._prepareData = function(data){
	var m1 = [];
	for (var i = 0, m = data.length; i<m;  i++) {
		m1.push(data[i]*this.utils.scale);
	};
	return m1.slice(0);
}
CurrencyChart.prototype._prepareDataCoords = function(data){
	this._getBounds();
	this.utils.dataCoords = {
		x:[],
		y:[]
	};
	for (var i = 0, m = data.x.length; i<m;  i++) {
		this.utils.dataCoords.y.push(data.y[i]*this.utils.scale + this.utils.topGap*2);
		var secDiff = Math.floor((new Date().getTime() - new Date(data.x[i]).getTime()) / 1000);
		this.utils.dataCoords.x.push(this.utils.startNowPoint * this.canvas.clientWidth - secDiff*this.options.pxToSecond);
	}
	
}