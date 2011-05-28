(function( $ ) {

module( "tooltip: methods" );

test( "destroy", function() {
	domEqual( "#tooltipped1", function() {
		$( "#tooltipped1" ).tooltip().tooltip( "destroy" );
	});
});

test( "open/close", function() {
	expect( 3 );
	$.fx.off = true;
	var element = $( "#tooltipped1" ).tooltip();
	equal( $( ".ui-tooltip" ).length, 0, "no tooltip on init" );
$( ".ui-tooltip" ).each(function() {
	console.log( $( this ).html() );
});
	element.tooltip( "open" );
	var tooltip = $( "#" + element.attr( "aria-describedby" ) );
	ok( tooltip.is( ":visible" ) );
	element.tooltip( "close" );
	ok( tooltip.is( ":hidden" ) );
	$.fx.off = false;
});

/*
TODO currently tooltip doesn't override widget
can't return anything useful if no element is kept around and there's no useful reference
test("widget", function() {
	var tooltip = $("#tooltipped1").tooltip();
	same(tooltip.tooltip("widget")[0], $(".ui-tooltip")[0]);
	same(tooltip.tooltip("widget").end()[0], tooltip[0]);
});
*/

}( jQuery ) );
