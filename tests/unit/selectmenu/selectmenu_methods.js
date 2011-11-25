(function( $ ) {

module( "selectmenu: methods" );

test( "destroy", function() {
	expect( 1 );
	domEqual( "#speed", function() {
		$( "#speed" ).selectmenu().selectmenu( "destroy" );
	});
});


test( "open", function() {
	expect( 2 );
	
	var element = $("#speed").selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");
	
	element.selectmenu("open");
	ok( menu.is( ":visible" ), "menu visible" );
	equals( menu.find("ul").attr("aria-hidden"), "false", "menu aria-disabled" );
});


test( "close", function() {
	expect( 2 );
	
	var element = $("#speed").selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");
	
	element.selectmenu("open");
	element.selectmenu("close");
	ok( menu.is( ":hidden" ), "menu hidden" );
	equals( menu.find("ul").attr("aria-hidden"), "true", "menu aria-disabled" );
});


$.each([
	{
		type: "default",
		selector: "#speed",
		options: null
	},
	{
		type: "pop-up",
		selector: "#number",
		options: {
			dropdown: false
		}
	},
	{
		type: "optgroups",
		selector: "#files",
		options: null
	}
], function( i, settings ) {
	test("refresh - " + settings.type, function () {
		// expect(6);
		var element = $(settings.selector).selectmenu(settings.options);
		var widget = element.selectmenu("widget");
		var button = widget.filter(".ui-selectmenu-button");
		var menu = widget.filter(".ui-selectmenu-menu");
		
		element.selectmenu("refresh");
	});
});


})( jQuery );
