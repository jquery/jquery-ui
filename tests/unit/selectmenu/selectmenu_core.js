(function( $ ) {

module( "selectmenu: core" );

test("accessibility", function () {
	var element = $('#speed').selectmenu(),
		button = element.selectmenu("widget").parent(),
		menu = element.selectmenu("menuWidget").parent(),
		link = button.find("a"),
		selected = element.find("option:selected"),
		ul = menu.children("ul");

	link.simulate( "focus" );
	var links = ul.find("li.ui-menu-item a");

	expect(12 + links.length * 2);

	equals( link.attr("role"), "combobox", "button link role" );
	equals( link.attr("aria-haspopup"), "true", "button link aria-haspopup" );
	equals( link.attr("aria-expanded"), "false", "button link  aria-expanded" );
	equals( link.attr("aria-autocomplete"), "list", "button link  aria-autocomplete" );
	equals( link.attr("aria-owns"), ul.attr("id"), "button link aria-owns" );
	equals( link.attr("tabindex"), 0, "button link tabindex" );

	equals( ul.attr("role"), "listbox", "menu role" );
	equals( ul.attr("aria-labelledby"), link.attr("id"), "menu aria-labelledby" );
	equals( ul.attr("aria-hidden"), "true", "menu aria-hidden" );
	equals( ul.attr("tabindex"), 0, "menu tabindex" );
	equals( ul.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "menu aria-activedescendant" );
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
			button = element.selectmenu("widget").parent(),
			menu = element.selectmenu("menuWidget").parent(),
			link = button.find("a"),
			ul = menu.children("ul"),
			selected = element.find("option:selected");

		link.simulate( "focus" )
		var links = ul.find("li.ui-menu-item a");

		link.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		equals( ul.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "after keydown menu aria-activedescendant" );
		equals( links.eq(element[0].selectedIndex).attr("aria-selected"), "true", "after keydown selected menu link aria-selected" );
		equals( element.find("option:selected").val(), selected.next("option").val() , "after keydown original select state" );
		equals( button.text(), selected.next("option").text(), "after keydown button text" );

		link.simulate( "click" );
		menu.find("a").last().simulate( "mouseover" ).trigger( "click" );
		equals( ul.attr("aria-activedescendant"), links.eq(element[0].selectedIndex).attr("id"), "after click menu aria-activedescendant" );
		equals( links.eq(element[0].selectedIndex).attr("aria-selected"), "true", "after click selected menu link aria-selected" );
		equals( element.find("option:selected").val(), element.find("option").last().val(), "after click original select state" );
		equals( button.text(), element.find("option").last().text(), "after click button text" );
	});
});


// test("mass", function () {
	// for (var i = 0; i < 100; i++) {
		// var element = $('#speed').selectmenu();
		// var widget = element.selectmenu("destroy");
		// expect(0);
	// }
// });



})( jQuery );
