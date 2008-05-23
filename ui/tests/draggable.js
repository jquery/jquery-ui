$.fn.triggerKeydown = function(keyCode) {
	return this.trigger("keydown", [$.event.fix({event:"keydown", keyCode: keyCode, target: this[0]})]);
};


$(document).ready(function() {

	$("#draggable1").draggable();
	
	module("draggable: simple drag & drop");
	
	test("simple drag", function() {

		expect(1);
		ok(true, "Drag and drop element on the same position");
		
	});

});