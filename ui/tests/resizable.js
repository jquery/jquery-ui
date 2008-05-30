var console = console || {
	log: function(l) {
		$('#log').append(l + '<br/>').get(0).scrollTop = 10000;
	}
};

var animateClick = function(co) {
	var img = $("<img src='images/click.png' width='1'>").appendTo("body")
					.css({ position: "absolute", zIndex: 1000, left: co.x, top: co.y })
					.animate({ width: 80, height: 80, left: co.x-40, top: co.y-40, opacity: 'hide' }, 1000, function() { $(this).remove(); });
	};

var num = function(i) {
	return parseInt(i, 10);
};

$(document).ready(function() {


	$('#resizable1').resizable({
		resize: function() {
			//console.log('resize')			
		}
	});
	
	$('.ui-resizable-se').userAction("drag", 100);
	$('.ui-resizable-se').userAction("drag", 200, 50);
	$('.ui-resizable-se').userAction("drag", 400);
	$('.ui-resizable-se').userAction("drag", -600, -30);
	
	return;

	module("resizable: simple resize");
	
	test("simple resize x", function() {

		$('#resizable1').resizable({
			resize: function() {
				console.log('resize')			
			}
		});
		
		$('.ui-resizable-e').userAction("drag", 100);
		$('.ui-resizable-e').userAction("drag", 200);
		$('.ui-resizable-e').userAction("drag", 200);
		
		//expect(2);
		//ok(false, "Resize element on the same position");
		
		
	});
	
	/*test("autoheight", function() {
		$('#navigation').accordion({ header: '.head', autoheight: false });
		equals( 90, $('#navigation ul:first').height() );
		equals( 126, $('#navigation ul:eq(1)').height() );
		equals( 54, $('#navigation ul:last').height() );
		$('#navigation').accordion("destroy").accordion({ header: '.head',autoheight: true });
		equals( 126, $('#navigation ul:first').height() );
		equals( 126, $('#navigation ul:eq(1)').height() );
		equals( 126, $('#navigation ul:last').height() );
	});*/

});