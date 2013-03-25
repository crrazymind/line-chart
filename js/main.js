"use strict"
jQuery(function(){
	var data = {
		x : [],
		y: []
	}
	for (var i = 500; i >= 0; i--) {
		data.x.push(new Date().setSeconds(new Date().getSeconds() - i));
		data.y.push(Math.random());
	};

	var options = {
		secondsToShow : 350,
		data : data
	}
	var chart = new CurrencyChart(options);
	var el = document.getElementById('chart-element');
	chart.start(el, 1000);

	setInterval(function(){
		var val = Math.random()*0.5;
		options.data.y.push(val);
		options.data.x.push(new Date().getTime());
		chart.refresh(options);
	},1000);
	var sel = $(".period-choose");
	sel.on('change', function(){
		options.secondsToShow = $(this).val();
		chart.refresh(options);
	});
});