(function ( $ ) {

module( "selectmenu: events", {
	setup: function () {
		this.element = $( "#speed" );
	}
});

test( "change", function () {
	expect( 4 );
	
	var that = this;

	this.element.selectmenu({
		change: function ( event, ui ) {
			ok( event, "change event fired on change" );
			equal( event.type, "selectmenuchange", "event type set to selectmenuchange" );
			equal( ui.item.element[ 0 ], options.eq( ui.item.index )[ 0 ], "ui.item.element contains original option element" );
			equal( ui.item.value, options.eq( ui.item.index ).text(), "ui.item.value property updated correctly" );
		}
	});

	var button = this.element.selectmenu( "widget" ),
		menu = this.element.selectmenu( "menuWidget" ).parent(),
		options = this.element.find( "option" );

	button.simulate( "focus" ).simulate( "click" );
	menu.find( "a" ).first().simulate( "mouseover" ).simulate( "click" );
});


test( "close", function () {
	expect( 2 );

	this.element.selectmenu({
		close: function ( event, ui ) {
			ok( event, "close event fired on close" );
			equal( event.type, "selectmenuclose", "event type set to selectmenuclose" );
		}
	});

	this.element.selectmenu( "open" ).selectmenu( "close" );
});


test( "focus", function () {
	expect( 12 );

	var button, menu, links,
		optionIndex = this.element[ 0 ].selectedIndex + 1,
		options = this.element.find( "option" );

	this.element.selectmenu({
		focus: function ( event, ui ) {
			ok( event, "focus event fired on element #" + optionIndex + " mouseover" );
			equal( event.type, "selectmenufocus", "event type set to selectmenufocus" );
			equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ], "ui.item.element contains original option element" );
		}
	});

	button = this.element.selectmenu( "widget" ),
	menu = this.element.selectmenu( "menuWidget" );

	button
		.simulate( "focus" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	
	button.simulate( "click" );
	links = menu.find( "li.ui-menu-item a" );
	optionIndex = 0;
	links.eq( optionIndex ).simulate( "mouseover" );	
	optionIndex += 1;
	links.eq( optionIndex ).simulate( "mouseover" );

	// this tests for unwanted, additional focus event on close
	this.element.selectmenu( "close" );
});


test( "open", function () {
	expect( 2 );

	this.element.selectmenu({
		open: function ( event, ui ) {
			ok( event, "open event fired on open" );
			equal( event.type, "selectmenuopen", "event type set to selectmenuopen" );
		}
	});

	this.element.selectmenu( "open" );
});


test( "select", function () {
	expect( 3 );

	this.element.selectmenu({
		select: function ( event, ui ) {
			ok( event, "select event fired on item select" );
			equal( event.type, "selectmenuselect", "event type set to selectmenuselect" );
			equal( ui.item.element[ 0 ], options.eq( ui.item.index )[ 0 ], "ui.item.element contains original option element" );
		}
	});

	var button = this.element.selectmenu( "widget" ),
		menu = this.element.selectmenu( "menuWidget" ).parent(),
		options = this.element.find( "option" );

	button.simulate( "focus" ).simulate( "click" );
	menu.find( "a" ).first().simulate( "mouseover" ).simulate( "click" );
});

})(jQuery);
