(function ($) {

module("selectmenu: options");

test("appendTo another element", function () {
	expect( 8 );
	
	var detached = $( "<div>" ),
		element = $("#speed").selectmenu();
	equal( element.selectmenu( "menuWidget" ).parent().parent()[0], document.body, "defaults to body" );
	element.selectmenu( "destroy" );

	element.selectmenu({
		appendTo: ".sm-wrap"
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[0], $( "#sm-wrap1" )[0], "first found element" );
	equal( $( "#sm-wrap2 .ui-selectmenu" ).length, 0, "only appends to one element" );
	element.selectmenu( "destroy" );

	$( "#sm-wrap2" ).addClass( "ui-front" );
	element.selectmenu();
	equal( element.selectmenu( "menuWidget" ).parent().parent()[0], $( "#sm-wrap2" )[0], "null, inside .ui-front" );
	element.selectmenu( "destroy" );
	$( "#sm-wrap2" ).removeClass( "ui-front" );

	element.selectmenu().selectmenu( "option", "appendTo", "#sm-wrap1" );
	equal( element.selectmenu( "menuWidget" ).parent().parent()[0], $( "#sm-wrap1" )[0], "modified after init" );
	element.selectmenu( "destroy" );

	element.selectmenu({
		appendTo: detached
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[0], detached[0], "detached jQuery object" );
	element.selectmenu( "destroy" );

	element.selectmenu({
		appendTo: detached[0]
	});
	equal( element.selectmenu( "menuWidget" ).parent().parent()[0], detached[0], "detached DOM element" );
	element.selectmenu( "destroy" );

	element.selectmenu().selectmenu( "option", "appendTo", detached );
	equal( element.selectmenu( "menuWidget" ).parent().parent()[0], detached[0], "detached DOM element via option()" );
	element.selectmenu( "destroy" );
});


test("CSS styles", function () {
	expect(2);

	var element = $("#speed").selectmenu(),
		button = element.selectmenu("widget"),
		menu = element.selectmenu("menuWidget");

	element.selectmenu("open");
	ok( button.hasClass("ui-corner-top") && !button.hasClass("ui-corner-all") && button.find("span.ui-icon").hasClass("ui-icon-triangle-1-s"), "button styles dropdown");
	ok( menu.hasClass("ui-corner-bottom") && !menu.hasClass("ui-corner-all"), "menu styles dropdown");
});

})(jQuery);
