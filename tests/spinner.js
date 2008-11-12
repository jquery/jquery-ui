/*
 * spinner unit tests
 */
(function($) {
//
// Spinner Test Helper Functions
//

var defaults = {
	currency: false,
	decimals: 0,
	disabled: false,
	format: "%",
	group: "",
	incremental: true,
	items: null,
	max: null,
	min: null,
	point: ".",
	start: 0,
	stepping: 1
};

var el;

// Spinner Tests
module("spinner");

test("init", function() {
	expect(2);

	$("<div></div>").appendTo('body').spinner().remove();
	ok(true, '.spinner() called on element');

	$('<input id="spinner_dis">').spinner().remove();
	ok(true, '.spinner() called on disconnected element');

});

test("destroy", function() {
	expect(2);

	$("<div></div>").appendTo('body').spinner().spinner("destroy").remove();
	ok(true, '.spinner("destroy") called on element');

	$('<input id="spinner_dis">').spinner().spinner("destroy").remove();
	ok(true, '.spinner().spinner("destroy") called on disconnected element');

});

test("defaults", function() {
	el = $('<div></div>').spinner();
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".spinner"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

test("re-attach", function() {
	expect(2);

	el = $("#spin").spinner().spinner("destroy").spinner();
	ok(true, '.spinner().spinner("destroy").spinner() called on element');

	$('<input id="spinner_dis">').spinner().spinner("destroy").spinner().remove();
	ok(true, '.spinner().spinner("destroy").spinner() called on disconnected element');

});

test("disable", function() {
	expect(1);

	$("#spin").spinner().spinner("disable");
	ok(true, '.spinner("disable") called on element');

});

test("enable", function() {
	expect(1);

	$("#spin").spinner().spinner("disable").spinner("enable");
	ok(true, '.spinner("enable") called on element');

});

test("defaults", function() {
	expect(12);
	el = $("#spin").spinner();

	equals(el.data("currency.spinner"), false, "currency");
	equals(el.data("disabled.spinner"), false, "disabled");
	equals(el.data("incremental.spinner"), true, "incremental");
	equals(el.data("max.spinner"), undefined, "max");
	equals(el.data("min.spinner"), undefined, "min");
	equals(el.data("start.spinner"), 0, "start");
	equals(el.data("stepping.spinner"), 1, "stepping");
	equals(el.data("decimals.spinner"), 0, "decimals");
	equals(el.data("format.spinner"), '%', "format");
	equals(el.data("items.spinner"), false, "items");
	equals(el.data("group.spinner"), '', "group");
	equals(el.data("point.spinner"), '.', "point");

});

test("set defaults on init", function() {
	expect(7);
	el = $("#spin").spinner({ currency:"гд", disabled:true, incremental:false, max:200, min:-100, start:50, stepping:2 });

	equals(el.data("currency.spinner"), "гд", "currency");
	equals(el.data("disabled.spinner"), true, "disabled");
	equals(el.data("incremental.spinner"), false, "incremental");
	equals(el.data("max.spinner"), 200, "max");
	equals(el.data("min.spinner"), -100, "min");
	equals(el.data("start.spinner"), 50, "start");
	equals(el.data("stepping.spinner"), 2, "stepping");

});

test("keydown on input", function() {
	expect(6);
	el = $("#spin").spinner();

	equals(el.val(), 0, "start number");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP})
		.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), 1, "Up key");

	el.simulate("keydown",{keyCode:$.simulate.VK_RIGHT})
		.simulate("keyup",{keyCode:$.simulate.VK_RIGHT});

	equals(el.val(), 1, "Right key");

	el.simulate("keydown",{keyCode:$.simulate.VK_HOME})
		.simulate("keyup",{keyCode:$.simulate.VK_HOME});

	equals(el.val(), 0, "Home key to start");

	el.simulate("keydown",{keyCode:$.simulate.VK_DOWN})
		.simulate("keyup",{keyCode:$.simulate.VK_DOWN});

	equals(el.val(), -1, "Down Key");

	el.simulate("keydown",{keyCode:$.simulate.VK_LEFT})
		.simulate("keyup",{keyCode:$.simulate.VK_LEFT});

	equals(el.val(), -1, "Left Key");

});

test("keydown on input with options", function() {
	expect(4);

	el = $("#spin").spinner({ incremental:false, max:200, min:-100, start:50, stepping:10 });

	equals(el.val(), 50, "start number");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP})
		.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), 60, "stepping 10 on 50");

	el.simulate("keydown",{keyCode:$.simulate.VK_END})
		.simulate("keyup",{keyCode:$.simulate.VK_END});

	equals(el.val(), 200, "End key to max");

	el.simulate("keydown",{keyCode:$.simulate.VK_HOME})
		.simulate("keyup",{keyCode:$.simulate.VK_HOME});

	equals(el.val(), -100, "Home key to min");


});

test("currency and decimal options", function() {
	expect(5);

	el = $("#spin").spinner({ currency:"$", incremental:false, max:120, min:-50, stepping:0.3 });

	equals(el.val(), "$0.00", "start number");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP})
		.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), "$0.30", "stepping 0.30");

	el.simulate("keydown",{keyCode:$.simulate.VK_END})
		.simulate("keyup",{keyCode:$.simulate.VK_END});

	equals(el.val(), "$120.00", "End key to max");

	el.simulate("keydown",{keyCode:$.simulate.VK_HOME})
		.simulate("keyup",{keyCode:$.simulate.VK_HOME});

	equals(el.val(), "-$50.00", "Home key to min");

	for ( var i = 1 ; i<=120 ; i++ ) {
		el.simulate("keydown",{keyCode:$.simulate.VK_UP});
	}

	el.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), "-$14.00", "keydown 120 times");

});

test("decimal options", function() {
	expect(3);

	el = $("#spin").spinner({ currency:false, incremental:false, stepping:0.7 });

	equals(el.val(), "0.0", "start number");

	el.simulate("keydown",{keyCode:$.simulate.VK_DOWN})
		.simulate("keyup",{keyCode:$.simulate.VK_DOWN});

	equals(el.val(), "-0.7", "stepping 0.7");

	for ( var i = 1 ; i<=11 ; i++ ) {
		el.simulate("keydown",{keyCode:$.simulate.VK_UP});
	}

	el.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), "7.0", "keydown 11 times");
	
});

test("spin without auto-incremental stepping", function() {
	expect(2);

	el = $("#spin").spinner({ incremental:false });

	for ( var i = 1 ; i<=120 ; i++ ) {
		el.simulate("keydown",{keyCode:$.simulate.VK_UP});
	}

	el.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), 120, "keydown 120 times");

	for ( var i = 1 ; i<=210 ; i++ ) {
		el.simulate("keydown",{keyCode:$.simulate.VK_DOWN});
	}

	el.simulate("keyup",{keyCode:$.simulate.VK_DOWN});

	equals(el.val(), -90, "keydown 210 times");

});

test("spin with auto-incremental stepping", function() {
	expect(2);

	el = $("#spin").spinner();

	for ( var i = 1 ; i<=120 ; i++ ) {
		el.simulate("keydown",{keyCode:$.simulate.VK_UP});
	}

	el.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), 300, "keydown 120 times (100+20*10)");

	for ( var i = 1 ; i<=210 ; i++ ) {
		el.simulate("keydown",{keyCode:$.simulate.VK_DOWN});
	}

	el.simulate("keyup",{keyCode:$.simulate.VK_DOWN});

	equals(el.val(), -1800, "keydown 210 times (300-100-100*10-10*100)");

});

test("mouse click on buttons", function() {
	expect(4);
	el = $("#spin").spinner();

	$(".ui-spinner-up").trigger("mousedown").trigger("mouseup");

	equals(el.val(), 1, "mouse click to up");

	$(".ui-spinner-up").trigger("dblclick");

	equals(el.val(), 2, "mouse double click to up");

	$(".ui-spinner-down").trigger("mousedown").trigger("mouseup");

	equals(el.val(), 1, "mouse click to down");

	$(".ui-spinner-down").trigger("dblclick");

	equals(el.val(), 0, "mouse double click to down");

});

test("callback", function() {
	expect(4);

	var s = c = d = u = 0;

	el = $("#spin").spinner({
		spin: function(){
			s++;
		},
		change: function(){
			c++;
		},
		up: function(){
			u++;
		},
		down: function(){
			d++;
		}
	});

	el.simulate("keydown",{keyCode:$.simulate.VK_UP}).simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(u, 1, "Up 1 time");

	el.simulate("keydown",{keyCode:$.simulate.VK_DOWN}).simulate("keyup",{keyCode:$.simulate.VK_DOWN});

	equals(d, 1, "Down 1 time");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP}).simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(s, 3, "Spin 3 times");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP}).simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(c, 4, "Change 4 times");

});

test("mouse wheel on input", function() {
	expect(0);

});

test("currency formats", function() {
	expect(8);

	// default
	
	el = $("#spin").spinner({ currency: 'HK$', stepping: 1500.50, start: 1000 });

	equals(el.val(), "HK$1,000.00", "Hong Kong Dollar");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP})
		.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), "HK$2,500.50", "Hong Kong Dollar step-up once");

	// space and comma
	
	el.spinner('destroy').val('').spinner({ currency: '$', group: ' ', point: '.', stepping: 1500.50, start: 1000 });

	equals(el.val(), "$1 000.00", "Australian Dollar");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP})
		.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), "$2 500.50", "Australian Dollar step-up once");

	// apos and point
	
	el.spinner('destroy').val('').spinner({ currency: 'Fr ', group: "'", point: '.', stepping: 1500.50, start: 1000 });

	equals(el.val(), "Fr 1'000.00", "Swiss Franc");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP})
		.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), "Fr 2'500.50", "Swiss Franc step-up once");
	
	// point and comma
	
	el.spinner('destroy').val('').spinner({ currency: 'RUB', group: ".", point: ',', stepping: 1.5, start: 1000 });

	equals(el.val(), "RUB1.000,00", "Russian Ruble");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP})
		.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), "RUB1.001,50", "Russian Ruble step-up once");
	

});

})(jQuery);
