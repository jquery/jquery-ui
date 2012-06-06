(function( $ ) {

module( "selectmenu: core" );

test("accessibility", function () {
	var links,
		element = $('#speed').selectmenu(),
		button = element.selectmenu("widget"),
		menu = element.selectmenu("menuWidget"),
		selected = element.find("option:selected");

	button.simulate( "focus" );
	links = menu.find("li.ui-menu-item a");

	expect(12 + links.length * 2);

	equal( button.attr("role"), "combobox", "button link role" );
	equal( button.attr("aria-haspopup"), "true", "button link aria-haspopup" );
	equal( button.attr("aria-expanded"), "false", "button link  aria-expanded" );
	equal( button.attr("aria-autocomplete"), "list", "button link  aria-autocomplete" );
	equal( button.attr("aria-owns"), menu.attr("id"), "button link aria-owns" );
	equal( button.attr("tabindex"), 0, "button link tabindex" );

	equal( menu.attr("role"), "listbox", "menu role" );
	equal( menu.attr("aria-labelledby"), button.attr("id"), "menu aria-labelledby" );
	equal( menu.attr("aria-hidden"), "true", "menu aria-hidden" );
	equal( menu.attr("tabindex"), 0, "menu tabindex" );
	equal( menu.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "menu aria-activedescendant" );
	$.each( links, function(index){
		equal( $(this).attr("role"), "option", "menu link #" + index +" role" );
		equal( $(this).attr("tabindex"), -1, "menu link #" + index +" tabindex" );
	});
	equal( links.eq(element[0].selectedIndex).attr("aria-selected"), "true", "selected menu link aria-selected" );
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
		expect(8);

		var links,
			element = $(settings.selector).selectmenu(),
			button = element.selectmenu("widget"),
			menu = element.selectmenu("menuWidget"),
			selected = element.find("option:selected");

		button.simulate( "focus" );
		links = menu.find("li.ui-menu-item a");

		button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equal( menu.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "after keydown menu aria-activedescendant" );
		equal( links.eq(element[0].selectedIndex).attr("aria-selected"), "true", "after keydown selected menu link aria-selected" );
		equal( element.find("option:selected").val(), selected.next("option").val() , "after keydown original select state" );
		equal( button.text(), selected.next("option").text(), "after keydown button text" );

		button.simulate( "click" );
		menu.find("a").last().simulate( "mouseover" ).trigger( "click" );
		equal( menu.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "after click menu aria-activedescendant" );
		equal( links.eq(element[0].selectedIndex).attr("aria-selected"), "true", "after click selected menu link aria-selected" );
		equal( element.find("option:selected").val(), element.find("option").last().val(), "after click original select state" );
		equal( button.text(), element.find("option").last().text(), "after click button text" );
	});
});

})( jQuery );
