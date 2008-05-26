var console = console || {
	log: function(l) {
		$('log').append(l + '<br/>');
	}
};

var num = function(i) {
	return parseInt(i, 10);
};


$(document).ready(function() {

	$("#resizable1").resizable({
		
		//maxHeight: 200,
		
		start: function(e, ui) {
			//console.log('start: [' + e.pageX + ', ' + e.pageY + ']' )
			//console.log(ui.instance.size, ui.instance.position)
		},
		
		stop: function(e, ui) {
			//console.log('stop: [' + e.pageX + ', ' + e.pageY + ']' )
			//console.log(ui.instance.size, ui.instance.position)
		},
		
		resize: function(e) {
			//console.log(e);
		}
	});
	
	
	return; 
	
	module("resizable: simple resize");
	
	test("simple drag", function() {

		expect(1);
		ok(true, "Resize element on the same position");
		
	});

});