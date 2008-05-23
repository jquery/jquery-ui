$.fn.triggerKeydown = function(keyCode) {
	return this.trigger("keydown", [$.event.fix({event:"keydown", keyCode: keyCode, target: this[0]})]);
}

function assertChange(stepping, start, result, action) {
	return function() {
		expect(1);
		var slider = $("#slider3").slider({
			stepping: stepping,
			startValue: start,
			min: 0,
			max: 1000,
			change: function(e, ui) {
				equals(ui.value, result, "changed to " + ui.value);
			}
		});
		action.apply(slider);
	}
}

module("slider: single handle")

test("change one step via keydown", assertChange(1, undefined, 1, function() {
	this.find("a").triggerKeydown("39");
}))
test("change - 10 steps via keydown", assertChange(10, 20, 10, function() {
	this.find("a").triggerKeydown("37");
}))
test("change +10 steps via keydown", assertChange(10, 20, 30, function() {
	this.find("a").triggerKeydown("39");
}))

test("moveTo, absolute value", assertChange(1, 1, 10, function() {
	this.slider("moveTo", 10);
}))

test("moveTo, absolute value as string", assertChange(1, 1, 10, function() {
	this.slider("moveTo", "10");
}))

test("moveTo, absolute value, below min", assertChange(1, 1, 0, function() {
	this.slider("moveTo", -10);
}))

test("moveTo, relative positive value", assertChange(1, 1, 11, function() {
	this.slider("moveTo", "+=10");
}))

test("moveTo, relative positive value, above max", assertChange(1, 10, 1000, function() {
	this.slider("moveTo", "+=2000");
}))

test("moveTo, relative negative value", assertChange(1, 20, 10, function() {
	this.slider("moveTo", "-=10");
}))

test("options update min/max", function() {
	expect(2);
	var slider = $("#slider3").slider({
		stepping: 1,
		startValue: 1
	});
	slider.slider("moveTo", "-=10");
	equals(slider.slider("value"), 0);
	slider.data("min.slider", -10);
	slider.slider("moveTo", "-=20");
	equals(slider.slider("value"), -10);
})

module("slider: setup and teardown");

test("destroy and recreate", function() {
	expect(3)
	var slider = $("#slider3").slider();
	slider.slider("moveTo", "+=20");
	equals(slider.slider("value"), 20);
	slider.slider("destroy");
	
	slider.slider("moveTo", "+=30");
	ok(true, "nothing happens after slider is destroyed");
	
	slider.slider().slider("moveTo", "30");
	
	equals(Math.round(slider.slider("value")), 30);
})

test("handle creation", function() {
	var slider = $("#slider1");
	equals(slider.children().size(), 0);
	slider.slider({
		handles: [
			{ start: 0 },
			{ start: 10 }
		]
	});
	equals(slider.children().size(), 2);
	var instance = $.data(slider[0], "slider")
	equals(instance.handle.length, 2);
	ok(instance.handle.jquery, "handle must be a jquery object")
})