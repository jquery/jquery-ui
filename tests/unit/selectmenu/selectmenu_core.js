(function( $ ) {

module( "selectmenu: core" );


test("markup structure", function () {
	expect(5);	
	var element = $('#speed').selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");

	equals( button.length, 1, "button wrapper found");	
	equals( button.children("a").length, 1, "button link found");
		
	equals( menu.length, 1, "menu wrapper found");
	equals( menu.children("ul").length, 1, "menu found");	
	
	equals( menu.find("ul li.ui-menu-item").length, element.find("option").length, "menu li's found");
});

test("accessibility", function () {
	var element = $('#speed').selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");
	var link = button.children("a");
	var ul = menu.children("ul")
	var links = ul.find("li.ui-menu-item a");
	expect(6 + links.length);
				
	equals( button.attr("aria-disabled"), "false", "button aria-disabled");
	equals( link.attr("aria-disabled"), "false", "button link aria-disabled");
	equals( link.attr("aria-haspopup"), "true", "button link aria-haspopup");
	equals( link.attr("role"), "button", "button link role");
	equals( link.attr("aria-owns"), ul.attr("id"), "button link aria-owns");
	equals( link.attr("tabindex"), 0, "button link tabindex");
		
	$.each( links, function(index){
		equals( $(this).attr("role"), "option", "menu link #" + index +" role");
	});
});

})( jQuery );
