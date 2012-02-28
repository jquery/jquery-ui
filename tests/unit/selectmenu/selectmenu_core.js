(function( $ ) {

module( "selectmenu: core" );

test("accessibility", function () {
	var element = $('#speed').selectmenu(),
		button = element.selectmenu("widget"),
		menu = element.selectmenu("menuWidget"),
		selected = element.find("option:selected");

	button.simulate( "focus" );
	var links = menu.find("li.ui-menu-item a");

	expect(12 + links.length * 2);

	equals( button.attr("role"), "combobox", "button link role" );
	equals( button.attr("aria-haspopup"), "true", "button link aria-haspopup" );
	equals( button.attr("aria-expanded"), "false", "button link  aria-expanded" );
	equals( button.attr("aria-autocomplete"), "list", "button link  aria-autocomplete" );
	equals( button.attr("aria-owns"), menu.attr("id"), "button link aria-owns" );
	equals( button.attr("tabindex"), 0, "button link tabindex" );

	equals( menu.attr("role"), "listbox", "menu role" );
	equals( menu.attr("aria-labelledby"), button.attr("id"), "menu aria-labelledby" );
	equals( menu.attr("aria-hidden"), "true", "menu aria-hidden" );
	equals( menu.attr("tabindex"), 0, "menu tabindex" );
	equals( menu.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "menu aria-activedescendant" );
	$.each( links, function(index){
		equals( $(this).attr("role"), "option", "menu link #" + index +" role" );
		equals( $(this).attr("tabindex"), -1, "menu link #" + index +" tabindex" );
	});
	equals( links.eq(element[0].selectedIndex).attr("aria-selected"), "true", "selected menu link aria-selected" );
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

		var element = $(settings.selector).selectmenu(),
			button = element.selectmenu("widget"),
			menu = element.selectmenu("menuWidget"),
			selected = element.find("option:selected");

		button.simulate( "focus" )
		var links = menu.find("li.ui-menu-item a");

		button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equals( menu.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "after keydown menu aria-activedescendant" );
		equals( links.eq(element[0].selectedIndex).attr("aria-selected"), "true", "after keydown selected menu link aria-selected" );
		equals( element.find("option:selected").val(), selected.next("option").val() , "after keydown original select state" );
		equals( button.text(), selected.next("option").text(), "after keydown button text" );

		button.simulate( "click", { clientX: 1, clientY: 1 } );
		menu.find("a").last().simulate( "mouseover", { clientX: 1, clientY: 1 } ).trigger( "click" );
		equals( menu.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "after click menu aria-activedescendant" );
		equals( links.eq(element[0].selectedIndex).attr("aria-selected"), "true", "after click selected menu link aria-selected" );
		equals( element.find("option:selected").val(), element.find("option").last().val(), "after click original select state" );
		equals( button.text(), element.find("option").last().text(), "after click button text" );
	});
});

})( jQuery );
