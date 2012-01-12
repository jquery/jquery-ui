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
	expect(9 + links.length * 2);
	
	equals( "true", link.attr("aria-haspopup"), "button link aria-haspopup" );
	equals( "button", link.attr("role"), "button link role" );
	equals( ul.attr("id"), link.attr("aria-owns"), "button link aria-owns" );
	equals( 0, link.attr("tabindex"), "button link tabindex" );		
	
	equals( "true", ul.attr("aria-hidden"), "menu aria-hidden" );
	equals( link.attr("id"), ul.attr("aria-labelledby"), "menu aria-labelledby" );
	equals( "menubox", ul.attr("role"), "menu role" );
	equals( 0, ul.attr("tabindex"), "menu tabindex" );
	equals( links.eq(element[0].selectedIndex).attr("id"), ul.attr("aria-activedescendant"), "menu aria-activedescendant" );
	$.each( links, function(index){
		equals( "option", $(this).attr("role"), "menu link #" + index +" role" );
		equals( -1, $(this).attr("tabindex"), "menu link #" + index +" tabindex" );
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
		expect(5);
		var element = $(settings.selector).selectmenu();
		var widget = element.selectmenu("widget");
		var button = widget.filter(".ui-selectmenu-button");
		var menu = widget.filter(".ui-selectmenu-menu");
		var link = button.find("a");
		var selected = element.find("option:selected");
		
		equals( button.text(), selected.text(), "inital button text" );		
		
		link.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );			
		equals( element.find("option:selected").val(), selected.next("option").val() , "after keydown original select state" );	
		equals( button.text(), selected.next("option").text(), "after keydown button text" );
		
		link.simulate( "click" );
		menu.find("a").last().simulate( "mouseover" ).simulate( "click" );
		equals( element.find("option:selected").val(), element.find("option").last().val(), "after click original select state" );	
		equals( button.text(), element.find("option").last().text(), "after click button text" );
	});
});


})( jQuery );
