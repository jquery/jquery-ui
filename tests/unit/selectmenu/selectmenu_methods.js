(function( $ ) {

module( "selectmenu: methods" );

test( "destroy", function() {
	expect( 1 );
	domEqual( "#speed", function() {
		$( "#speed" ).selectmenu().selectmenu( "destroy" );
	});
});


test( "open / close", function() {
	expect( 4 );
	
	var element = $("#speed").selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");
	
	element.selectmenu("open");
	ok( menu.is( ":visible" ), "menu visible" );
	equals( menu.find("ul").attr("aria-hidden"), "false", "menu aria-disabled" );
	
	element.selectmenu("close");
	ok( menu.is( ":hidden" ), "menu hidden" );
	equals( menu.find("ul").attr("aria-hidden"), "true", "menu aria-disabled" );
});


test("enable / disable", function () {
	expect(12);
	var element = $("#speed").selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var link = button.children("a");
	var menu = widget.filter(".ui-selectmenu-menu");
	
	element.selectmenu("disable")	
	ok( element.selectmenu("option", "disabled"), "disable: widget option" );
	equals( button.attr("aria-disabled"), "true", "disable: button wrapper ARIA" );
	equals( link.attr("aria-disabled"), "true", "disable: button ARIA" );
	equals( link.attr("tabindex"), -1, "disable: button tabindex" );
	equals( menu.attr("aria-disabled"), "true", "disable: menu wrapper ARIA" );
	equals( menu.children("ul").attr("aria-disabled"), "true", "disable: menu ARIA" );
	
	element.selectmenu("enable")
	ok( !element.selectmenu("option", "disabled"), "enable: widget option" );
	equals( button.attr("aria-disabled"), "false", "enable: button wrapper ARIA" );
	equals( link.attr("aria-disabled"), "false", "enable: button ARIA" );
	equals( link.attr("tabindex"), 0, "enable: button tabindex" );
	equals( menu.attr("aria-disabled"), "false", "enable: menu wrapper ARIA" );
	equals( menu.children("ul").attr("aria-disabled"), "false", "enable: menu ARIA" );
});


test("refresh - structure", function () {
	expect(3);
	var element = $("#number").selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");
	
	element.find("option").eq(2).remove();
	element.find("option").eq(3).remove();
	element.append('<option value="added_option">Added option</option>');
	element.find("option").first()
		.attr("value", "changed_value")
		.text("Changed value");
	element.selectmenu("refresh");
	
	equals( element.find("option").length, menu.find("li").not(".ui-selectmenu-optgroup").length, "menu item length" );	
	equals( element.find("option").last().text(), menu.find("li").not(".ui-selectmenu-optgroup").last().text(), "added item" );	
	equals( element.find("option").first().text(), menu.find("li").not(".ui-selectmenu-optgroup").first().text(), "chnaged item" );
});


test("refresh - disabled select", function () {
	expect(6);
	var element = $("#speed").selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");
	
	element.attr("disabled", "disabled");
	element.selectmenu("refresh");
	
	ok( element.selectmenu("option", "disabled"), "widget option" );
	equals( button.attr("aria-disabled"), "true", "button wrapper ARIA" );
	equals( button.children("a").attr("aria-disabled"), "true", "button ARIA" );
	equals( button.children("a").attr("tabindex"), -1, "button tabindex" );
	equals( menu.attr("aria-disabled"), "true", "menu wrapper ARIA" );
	equals( menu.children("ul").attr("aria-disabled"), "true", "mene ARIA" );
});

test("refresh - disabled option", function () {
	expect(2);
	var element = $("#speed").selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");
	
	element.attr("disabled", "disabled");
	element.find("option").eq(2).attr("disabled", "disabled");
	element.selectmenu("refresh");
	
	var disabledItem = menu.find("li").not(".ui-selectmenu-optgroup").eq(2);	
	ok( disabledItem.hasClass("ui-state-disabled"), "class" );
	ok( disabledItem.children("a").length <= 0, "has no link" );
});
	
test("refresh - disabled optgroup", function () {
	var element = $("#files").selectmenu();
	var widget = element.selectmenu("widget");
	var button = widget.filter(".ui-selectmenu-button");
	var menu = widget.filter(".ui-selectmenu-menu");
	
	var originalDisabledOptgroup = element.find("optgroup").first();
	var originalDisabledOptions = originalDisabledOptgroup.find("option");
	expect(2 + originalDisabledOptions.length * 2);
	
	originalDisabledOptgroup.attr("disabled", "disabled");
	element.selectmenu("refresh");
	
	var item = menu.find("li.ui-selectmenu-optgroup").first();
	ok( item.hasClass("ui-state-disabled"), "class" );
	
	equals( menu.find("li").not(".ui-selectmenu-optgroup").filter(".ui-state-disabled").length, originalDisabledOptions.length, "disabled options" );
	for ( var i = 0; i < originalDisabledOptions.length; i++ ) {
		item = item.next("li");
		ok( item.hasClass("ui-state-disabled"), "item #" + i + ": class" );
		ok( item.children("a").length <= 0, "item #" + i + ": has no link" );
	}
});


})( jQuery );
