(function( $ ) {

module( "selectmenu: core" );

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
