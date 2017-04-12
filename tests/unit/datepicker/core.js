define( [
	"qunit",
	"jquery",
	"../calendar/helper",
	"ui/widgets/datepicker"
], function( QUnit, $, testHelper ) {

QUnit.module( "datepicker: core", {
	beforeEach: function() {
		this.element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		this.widget = this.element.datepicker( "widget" );
	},
	afterEach: function() {
		this.element.datepicker( "destroy" ).val( "" );
	}
} );

QUnit.test( "input's value determines starting date", function( assert ) {
	assert.expect( 3 );

	this.element = $( "<input>" ).appendTo( "#qunit-fixture" );
	this.element.val( "1/1/14" ).datepicker();
	this.widget = this.element.datepicker( "widget" );

	this.element.datepicker( "open" );

	assert.equal( this.widget.find( ".ui-calendar-month" ).html(), "January", "correct month displayed" );
	assert.equal( this.widget.find( ".ui-calendar-year" ).html(), "2014", "correct year displayed" );
	assert.equal( this.widget.find( ".ui-state-active" ).html(), "1", "correct day highlighted" );
} );

QUnit.test( "base structure", function( assert ) {
	var ready = assert.async();
	assert.expect( 5 );

	var that = this;

	this.element.focus();

	setTimeout( function() {
		assert.ok( that.widget.is( ":visible" ), "Datepicker visible" );
		assert.equal( that.widget.children().length, 3, "Child count" );
		assert.ok( that.widget.is( ".ui-calendar" ), "Class ui-calendar" );
		assert.ok( that.widget.is( ".ui-datepicker" ), "Class ui-datepicker" );
		assert.ok( that.widget.is( ".ui-front" ), "Class ui-front" );

		that.element.datepicker( "close" );
		ready();
	}, 50 );
} );

QUnit.test( "Keyboard handling: focus", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var that = this;

	assert.ok( !this.widget.is( ":visible" ), "datepicker closed" );

	this.element.focus();
	setTimeout( function() {
		assert.ok( that.widget.is( ":visible" ), "Datepicker opens when receiving focus" );
		ready();
	}, 100 );
} );

QUnit.test( "Keyboard handling: keystroke up", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var that = this;

	assert.ok( !this.widget.is( ":visible" ), "datepicker closed" );

	this.element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	setTimeout( function() {
		assert.ok( that.widget.is( ":visible" ), "Keystroke up opens datepicker" );
		ready();
	}, 100 );
} );

QUnit.test( "Keyboard handling: input", function( assert ) {
	assert.expect( 6 );

	var that = this,
		instance = that.element.datepicker( "instance" );

	// Enter = Select preset date
	that.element
		.val( "1/1/14" )
		.datepicker( "refresh" )
		.datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	assert.dateEqual( that.element.datepicker( "valueAsDate" ), testHelper.createDate( 2014, 0, 1 ),
		"Keystroke enter - preset" );

	that.element
		.val( "" )
		.datepicker( "open" );
	assert.ok( instance.isOpen, "datepicker is open before escape" );

	that.element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	assert.ok( !instance.isOpen, "escape closes the datepicker" );

	that.element
		.val( "1/1/14" )
		.datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	assert.dateEqual( that.element.datepicker( "valueAsDate" ), testHelper.createDate( 2014, 0, 1 ),
		"Keystroke esc - preset" );

	that.element
		.val( "1/1/14" )
		.datepicker( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	assert.dateEqual( that.element.datepicker( "valueAsDate" ), testHelper.createDate( 2014, 0, 1 ),
		"Keystroke esc - abandoned" );

	that.element
		.val( "1/2/14" )
		.simulate( "keyup" );
	assert.dateEqual( that.element.datepicker( "valueAsDate" ), testHelper.createDate( 2014, 0, 2 ),
		"Picker updated as user types into input" );
} );

QUnit.test( "ARIA", function( assert ) {
	assert.expect( 4 );

	var widget = this.element.datepicker( "widget" ),
		id = widget.attr( "id" );

	assert.equal( this.element.attr( "aria-haspopup" ), "true",
		"Input aria-haspopup attribute" );
	assert.equal( this.element.attr( "aria-owns" ), id, "ARIA owns attribute" );

	assert.equal( widget.attr( "aria-hidden" ), "true",
		"Widget ARIA hidden attribute" );
	assert.equal( widget.attr( "aria-expanded" ), "false",
		"Widget ARIA expanded attribute" );
} );

QUnit.test( "mouse", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );

	var that = this;

	this.element.datepicker( "open" );

	setTimeout( function() {
		that.element.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		$( ".ui-calendar-calendar tbody button:contains(12)", that.widget ).simulate( "mousedown", {} );
		assert.dateEqual(
			that.element.datepicker( "valueAsDate" ),
			testHelper.createDate( 2008, 4 - 1, 12 ),
			"Mouse click - preset"
		);

		that.element.val( "" ).datepicker( "refresh" );
		that.element.simulate( "click" );
		assert.strictEqual( that.element.datepicker( "valueAsDate" ), null, "Mouse click - close" );

		that.element.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		that.element.simulate( "click" );
		assert.dateEqual(
			that.element.datepicker( "valueAsDate" ),
			testHelper.createDate( 2008, 4 - 1, 4 ),
			"Mouse click - close + preset"
		);

		that.element.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		that.widget.find( "a.ui-calendar-prev" ).simulate( "click" );
		that.element.simulate( "click" );
		assert.dateEqual(
			that.element.datepicker( "valueAsDate" ),
			testHelper.createDate( 2008, 4 - 1, 4 ),
			"Mouse click - abandoned"
		);

		ready();
	}, 100 );
} );

} );
