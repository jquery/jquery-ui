/*
 * spinner unit tests
 */
(function($) {

// Spinner Tests
module("spinner");

test("init", function() {
	expect(1);

	el = $("#spin").spinner();
	ok(true, '.spinner() called on element');

});

test("destroy", function() {
	expect(1);

	$("#spin").spinner().spinner("destroy");	
	ok(true, '.spinner("destroy") called on element');

});

test("defaults", function() {
	expect(5);
	el = $("#spin").spinner();

	equals(el.data("incremental.spinner"), true, "incremental");
	equals(el.data("max.spinner"), undefined, "max");
	equals(el.data("min.spinner"), undefined, "min");
	equals(el.data("start.spinner"), 0, "start");
	equals(el.data("stepping.spinner"), 1, "stepping");

});

test("set defaults on init", function() {
	expect(5);
	el = $("#spin").spinner({ incremental:false, max:200, min:-100, start:50, stepping:2 });

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

	equals(el.val(), 2, "Right key");

	el.simulate("keydown",{keyCode:$.simulate.VK_HOME})
		.simulate("keyup",{keyCode:$.simulate.VK_HOME});

	equals(el.val(), 0, "Home key to start");

	el.simulate("keydown",{keyCode:$.simulate.VK_DOWN})
		.simulate("keyup",{keyCode:$.simulate.VK_DOWN});

	equals(el.val(), -1, "Down Key");

	el.simulate("keydown",{keyCode:$.simulate.VK_LEFT})
		.simulate("keyup",{keyCode:$.simulate.VK_LEFT});

	equals(el.val(), -2, "Left Key");

});

test("keydown on input with options", function() {
	expect(4);

	el = $("#spin").spinner({ incremental:false, max:200, min:-100, start:50, stepping:10 });

	equals(el.val(), 50, "start number");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP})
		.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(el.val(), 60, "Stepping 10 on 50");

	el.simulate("keydown",{keyCode:$.simulate.VK_END})
		.simulate("keyup",{keyCode:$.simulate.VK_END});

	equals(el.val(), 200, "End key to max");

	el.simulate("keydown",{keyCode:$.simulate.VK_HOME})
		.simulate("keyup",{keyCode:$.simulate.VK_HOME});

	equals(el.val(), -100, "Home key to min");


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

	$("div.ui-spinner-up").trigger("mousedown").trigger("mouseup");

	equals(el.val(), 1, "Mouse click to up");

	$("div.ui-spinner-up").trigger("dblclick");

	equals(el.val(), 2, "Mouse double click to up");

	$("div.ui-spinner-down").trigger("mousedown").trigger("mouseup");

	equals(el.val(), 1, "Mouse click to down");

	$("div.ui-spinner-down").trigger("dblclick");

	equals(el.val(), 0, "Mouse double click to down");


});

test("callback", function() {
	expect(2);

	var s = 0,
		c = 0;

	el = $("#spin").spinner({
		spin: function(){
			s++;
		},
		change: function(){
			c++;
		}
	});

	for ( var i = 1 ; i<=10 ; i++ ) {
		el.simulate("keydown",{keyCode:$.simulate.VK_UP});
	}

	el.simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(s, 10, "Spin 10 times");

	el.simulate("keydown",{keyCode:$.simulate.VK_UP}).simulate("keyup",{keyCode:$.simulate.VK_UP});

	equals(c, 2, "Change 2 times");

});

test("mouse wheel on input", function() {
	expect(0);


});

})(jQuery);
