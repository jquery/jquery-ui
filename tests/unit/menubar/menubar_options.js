(function( $ ) {

var log = TestHelpers.menubar.log,
	logOutput = TestHelpers.menubar.logOutput,
	click = TestHelpers.menubar.click;

module( "menubar: options", {
	setup: function() {
		TestHelpers.menubar.clearLog();
	}
});

test( "menuElement and items", function() {
	expect( 2 );
	var element = $( "#bar2" ).menubar({
		items: ".menubarItem",
		menuElement: ".menuElement"
	});
	var fileItem = element.find( ">:eq(1)>a:first" );
	var fileMenu = fileItem.next();
	ok( fileMenu.is(":hidden") );
	fileItem.click();
	ok( fileMenu.is(":visible") );
});

})( jQuery );
