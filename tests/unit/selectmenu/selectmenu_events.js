(function ( $ ) {

module( "selectmenu: events", {
	setup: function () {
		this.element = $( "#speed" );
	}
});

asyncTest( "change", function () {
	expect( 5 );

	var optionIndex = 1,
		button, menu, options;

	this.element.selectmenu({
		change: function ( event, ui ) {
			ok( event, "change event fired on change" );
			equal( event.type, "selectmenuchange", "event type set to selectmenuchange" );
			equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ], "ui.item.element contains original option element" );
			equal( ui.item.value, options.eq( optionIndex ).text(), "ui.item.value property updated correctly" );
		}
	});

	button = this.element.selectmenu( "widget" );
	menu = this.element.selectmenu( "menuWidget" ).parent();
	options = this.element.find( "option" );

	button.simulate( "focus" );

	setTimeout(function() {
		button.trigger( "click" );
		menu.find( "li" ).eq( optionIndex ).simulate( "mouseover" ).trigger( "click" );
		start();
	}, 1 );
});


test( "close", function () {
	expect( 4 );

	this.element.selectmenu({
		close: function ( event ) {
			ok( event, "close event fired on close" );
			equal( event.type, "selectmenuclose", "event type set to selectmenuclose" );
		}
	});

	this.element.selectmenu( "open" ).selectmenu( "close" );

	this.element.selectmenu( "open" );
	$( "body" ).trigger( "mousedown" );
});


asyncTest( "focus", function () {
	expect( 12 );

	var that = this,
		optionIndex = this.element[ 0 ].selectedIndex + 1,
		options = this.element.find( "option" ),
		button, menu, links;

	this.element.selectmenu({
		focus: function ( event, ui ) {
			ok( event, "focus event fired on element #" + optionIndex + " mouseover" );
			equal( event.type, "selectmenufocus", "event type set to selectmenufocus" );
			equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ], "ui.item.element contains original option element" );
		}
	});

	button = this.element.selectmenu( "widget" );
	menu = this.element.selectmenu( "menuWidget" );

	button.simulate( "focus" );

	setTimeout(function() {
		button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		button.trigger( "click" );
		links = menu.find( "li.ui-menu-item" );
		optionIndex = 0;
		links.eq( optionIndex ).simulate( "mouseover" );
		optionIndex += 1;
		links.eq( optionIndex ).simulate( "mouseover" );

		// this tests for unwanted, additional focus event on close
		that.element.selectmenu( "close" );
		start();
	}, 1 );
});


test( "open", function () {
	expect( 2 );

	this.element.selectmenu({
		open: function ( event ) {
			ok( event, "open event fired on open" );
			equal( event.type, "selectmenuopen", "event type set to selectmenuopen" );
		}
	});

	this.element.selectmenu( "open" );
});


asyncTest( "select", function () {
	expect( 4 );

	this.element.selectmenu({
		select: function ( event, ui ) {
			ok( event, "select event fired on item select" );
			equal( event.type, "selectmenuselect", "event type set to selectmenuselect" );
			equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ], "ui.item.element contains original option element" );
		}
	});

	var button = this.element.selectmenu( "widget" ),
		menu = this.element.selectmenu( "menuWidget" ).parent(),
		options = this.element.find( "option" ),
		optionIndex = 1;

	button.simulate( "focus" );

	setTimeout(function() {
		button.trigger( "click" );
		menu.find( "li" ).eq( optionIndex ).simulate( "mouseover" ).trigger( "click" );
		start();
	}, 1 );
});

})(jQuery);
