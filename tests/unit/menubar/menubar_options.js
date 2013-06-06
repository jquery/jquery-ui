(function( $ ) {

var log = TestHelpers.menubar.log,
	logOutput = TestHelpers.menubar.logOutput,
	click = TestHelpers.menubar.click;

module( "menubar: options", {
	setup: function() {
		TestHelpers.menubar.clearLog();
	}
});

test( "menus and items", function() {
	expect( 2 );
	var element = $( "#bar2" ).menubar({
		items: ".menubarItem",
		menus: ".menuElement"
	});
	var fileItem = element.find( ">:eq(1)>a:first" );
	var fileMenu = fileItem.next();
	ok( fileMenu.is(":hidden") );
	fileItem.click();
	ok( fileMenu.is(":visible") );
});

test( "icons: default", function() {
	expect( 1 );
	var element = $( "#bar1" ).menubar();
	equal( element.find(".ui-icon").length, 5 );
});

test( "icons: none", function() {
	expect( 1 );
	var element = $( "#bar1" ).menubar({
		icons: null
	});
	equal( element.find(".ui-icon").length, 2 );
});

test( "icons: custom", function() {
	expect( 1 );
	var element = $( "#bar1" ).menubar({
		icons: {
			menu: "custom-icon-class"
		}
	});
	equal( element.find(".custom-icon-class").length, 3 );
});

})( jQuery );
