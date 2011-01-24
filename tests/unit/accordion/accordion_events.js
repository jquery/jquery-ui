(function( $ ) {

module( "accordion: events" );

// TODO: verify correct elements in ui properties
// TODO: add tests for switching between active panels (not collapsed)
// TODO: add tests for changestart
// TODO: move change/changestart to deprecated tests (add activate/beforeactivate)
test( "accordionchange event, open closed and close again", function() {
	expect( 8 );
	$( "#list1" )
		.accordion({
			active: false,
			collapsible: true
		})
		.one( "accordionchange", function( event, ui ) {
			equals( ui.oldHeader.size(), 0 );
			equals( ui.oldContent.size(), 0 );
			equals( ui.newHeader.size(), 1 );
			equals( ui.newContent.size(), 1 );
		})
		.accordion( "option", "active", 0 )
		.one( "accordionchange", function( event, ui ) {
			equals( ui.oldHeader.size(), 1 );
			equals( ui.oldContent.size(), 1 );
			equals( ui.newHeader.size(), 0 );
			equals( ui.newContent.size(), 0 );
		})
		.accordion( "option", "active", false );
});

}( jQuery ) );
