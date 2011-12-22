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
	expect(12 + links.length * 2);
				
	equals( button.attr("aria-disabled"), "false", "button aria-disabled" );
	equals( link.attr("aria-disabled"), "false", "button link aria-disabled" );
	equals( link.attr("aria-haspopup"), "true", "button link aria-haspopup" );
	equals( link.attr("role"), "button", "button link role" );
	equals( link.attr("aria-owns"), ul.attr("id"), "button link aria-owns" );
	equals( link.attr("tabindex"), 0, "button link tabindex" );		
	
	equals( ul.attr("aria-hidden"), "true", "menu aria-hidden" );
	equals( ul.attr("aria-disabled"), "false", "menu aria-disabled" );
	equals( ul.attr("aria-labelledby"), link.attr("id"), "menu aria-labelledby" );
	equals( ul.attr("role"), "menubox", "menu role" );
	equals( ul.attr("tabindex"), 0, "menu tabindex" );
	equals( ul.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "menu aria-activedescendant" );
	$.each( links, function(index){
		equals( $(this).attr("role"), "option", "menu link #" + index +" role" );
		equals( $(this).attr("tabindex"), -1, "menu link #" + index +" tabindex" );
	});
});


$.each([
	{
		type: "default",
		selector: "#speed"
	},
	{
		type: "optgroups",
		selector: "#files"
	}
], function( i, settings ) {
	test("state synchronization - " + settings.type, function () {
		expect(6);
		var element = $(settings.selector).selectmenu();
		var widget = element.selectmenu("widget");
		var button = widget.filter(".ui-selectmenu-button");
		var menu = widget.filter(".ui-selectmenu-menu");
		
		equals( element[0].value, element.selectmenu("option", "value"), "inital value" );	
		equals( element.find("option:selected").text(), button.text(), "inital button text" );		
		
		button.find("a").simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equals( element[0].value, element.selectmenu("option", "value"), "after keydown value" );	
		equals( element.find("option:selected").text(), button.text(), "after keydown button text" );
		
		button.find("a").simulate( "click" );
		menu.find("a").last().simulate( "click" );
		equals( element[0].value, element.selectmenu("option", "value"), "after click value" );	
		equals( element.find("option:selected").text(), button.text(), "after click button text" );		
	});
});

})( jQuery );
