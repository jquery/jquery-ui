(function( $ ) {

module( "tooltip: options" );

test( "items", function() {
	var event = $.Event( "mouseenter" );
	event.target = $( "[data-tooltip]" )[ 0 ];
	var element = $( "#qunit-fixture" ).tooltip({
		items: "[data-tooltip]",
		content: function() {
			return $( this ).attr( "data-tooltip" );
		}
	}).tooltip( "open", event );
	same( $( "#" + $( "#fixture-span" ).attr( "aria-describedby" ) ).text(), "text" );
	element.tooltip( "destroy" );
});

test( "content: default", function() {
	var element = $( "#tooltipped1" ).tooltip().tooltip( "open" );
	same( $( "#" + element.attr( "aria-describedby" ) ).text(), "anchortitle" );
});

test( "content: return string", function() {
	var element = $( "#tooltipped1" ).tooltip({
		content: function() {
			return "customstring";
		}
	}).tooltip( "open" );
	same( $( "#" + element.attr( "aria-describedby" ) ).text(), "customstring" );
});

test( "content: return jQuery", function() {
	var element = $( "#tooltipped1" ).tooltip({
		content: function() {
			return $( "<div>" ).html( "cu<b>s</b>tomstring" );
		}
	}).tooltip( "open" );
	same( $( "#" + element.attr( "aria-describedby" ) ).text(), "customstring" );
});

/*
TODO broken, probably related to async content
test("content: callback string", function() {
	stop();
	$("#tooltipped1").tooltip({
		content: function(response) {
			response("customstring2");
			setTimeout(function() {
				//console.log($("#tooltipped1").attr("aria-describedby"))
				same( $( "#" + $("#tooltipped1").attr("aria-describedby") ).text(), "customstring2" );
				start();
			}, 100)
		}
	}).tooltip("open");
	
});
*/

}( jQuery ) );
