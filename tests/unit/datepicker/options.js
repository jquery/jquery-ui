define( [
	"qunit",
	"jquery",
	"ui/widgets/datepicker"
], function( QUnit, $ ) {

QUnit.module( "datepicker: options", {
	beforeEach:  function() {
		this.element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		this.widget = this.element.datepicker( "widget" );
	},
	afterEach: function() {
		this.element.datepicker( "destroy" ).val( "" );
	}
} );

QUnit.test( "appendTo", function( assert ) {
	assert.expect( 6 );

	var container = this.widget.parent()[ 0 ],
		detached = $( "<div>" );

	assert.equal( container, document.body, "defaults to body" );
	this.element.datepicker( "destroy" );

	this.element.datepicker( { appendTo: "#qunit-fixture" } );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	assert.equal( container, $( "#qunit-fixture" )[ 0 ], "child of specified element" );
	this.element.datepicker( "destroy" );

	this.element.datepicker( { appendTo: "#does-not-exist" } );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	assert.equal( container, document.body, "set to body if element does not exist" );
	this.element.datepicker( "destroy" );

	this.element.datepicker()
		.datepicker( "option", "appendTo", "#qunit-fixture" );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	assert.equal( container, $( "#qunit-fixture" )[ 0 ], "modified after init" );
	this.element.datepicker( "destroy" );

	this.element.datepicker( { appendTo: detached } );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	assert.equal( container, detached[ 0 ], "detached jQuery object" );
	this.element.datepicker( "destroy" );

	this.element.datepicker( { appendTo: detached[ 0 ] } );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	assert.equal( container, detached[ 0 ], "detached DOM element" );
} );

QUnit.test( "min / max", function( assert ) {
	assert.expect( 10 );

	var min, max;

	this.element.datepicker( "option", { min: "10/20/08", max: "10/25/08" } );
	assert.dateEqual( this.element.datepicker( "option", "min" ), new Date( 2008, 10 - 1, 20 ), "Set min option as string" );
	assert.dateEqual( this.element.datepicker( "option", "max" ), new Date( 2008, 10 - 1, 25 ), "Set max option as string" );

	min = new Date( 2009, 10 - 1, 20 );
	max = new Date( 2009, 10 - 1, 25 );
	this.element.datepicker( "option", { min: min, max: max } );
	assert.dateEqual( this.element.datepicker( "option", "min" ), min, "Set min option as date object" );
	assert.dateEqual( this.element.datepicker( "option", "max" ), max, "Set max option as date object" );

	this.element
		.datepicker( "destroy" )
		.attr( "min", "2010-10-20" )
		.attr( "max", "2010-10-25" )
		.datepicker();
	assert.dateEqual( this.element.datepicker( "option", "min" ), new Date( 2010, 10 - 1, 20 ), "Set min option as attribute" );
	assert.dateEqual( this.element.datepicker( "option", "max" ), new Date( 2010, 10 - 1, 25 ), "Set max option as attribute" );

	min = new Date( 2011, 10 - 1, 20 );
	max = new Date( 2011, 10 - 1, 25 );
	this.element
		.datepicker( "destroy" )
		.datepicker( { min: min, max: max } );
	assert.dateEqual( this.element.datepicker( "option", "min" ), new Date( 2011, 10 - 1, 20 ), "Set min option as date object on init" );
	assert.dateEqual( this.element.datepicker( "option", "max" ), new Date( 2011, 10 - 1, 25 ), "Set max option as date object on init" );

	this.element
		.datepicker( "destroy" )
		.datepicker( { min: "10/20/12", max: "10/25/12" } );
	assert.dateEqual( this.element.datepicker( "option", "min" ), new Date( 2012, 10 - 1, 20 ), "Set min option as string on init" );
	assert.dateEqual( this.element.datepicker( "option", "max" ), new Date( 2012, 10 - 1, 25 ), "Set max option as string on init" );

} );

QUnit.test( "Pass-through options", function( assert ) {
	assert.expect( 11 );

	var options = {
			buttons: { "Test": $.noop },
			dateFormat: { date: "full" },
			disabled: true,
			eachDay: function( day ) { day; },
			locale: "de",
			max: new Date( 2000, 0, 1 ),
			min: new Date( 2000, 0, 2 ),
			numberOfMonths: 3,
			showWeek: true
		},
		input = $( "<input>" ).val( "1/1/14" ).appendTo( "#qunit-fixture" ).datepicker(),
		instance = input.datepicker( "instance" );

	$.each( options, function( key, value ) {
		input.datepicker( "option", key, value );

		assert.deepEqual(
			instance.calendar.calendar( "option", key ),
			value,
			"option " + key + ": correct value"
		);

		if ( key === "dateFormat" ) {
			assert.equal( input.val(), "Wednesday, January 1, 2014", "option " + key + ": updated format" );
		}

		if ( key === "locale" ) {
			assert.equal( input.val(), "Mittwoch, 1. Januar 2014", "option " + key + ": updated locale" );
		}
	} );
} );

QUnit.test( "position", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	var input = $( "<input>" ).datepicker().appendTo( "body" ).css( {
			position: "absolute",
			top: 0,
			left: 0
		} ),
		container = input.datepicker( "widget" );

	input.datepicker( "open" );
	setTimeout( function() {
		assert.close( input.offset().left, container.offset().left, 1, "left sides line up by default" );
		assert.close( container.offset().top, input.offset().top + input.outerHeight(), 1,
			"datepicker directly under input by default" );

		// Change the position option using option()
		input.datepicker( "option", "position", {
			my: "left top",
			at: "right bottom"
		} );
		assert.close( container.offset().left, input.offset().left + input.outerWidth(), 1,
			"datepicker on right hand side of input after position change" );

		input.remove();
		ready();
	} );
} );

QUnit.test( "Stop datepicker from appearing with beforeOpen event handler - nothing", function( assert ) {
	assert.expect( 1 );

	this.element.datepicker( {
		beforeOpen: function() {}
	} );

	this.element.datepicker( "open" );
	assert.ok( this.element.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns nothing" );
} );

QUnit.test( "Stop datepicker from appearing with beforeOpen event handler - true", function( assert ) {
	assert.expect( 1 );

	this.element.datepicker( {
		beforeOpen: function() {
			return true;
		}
	} );
	this.element.datepicker( "open" );
	assert.ok( this.element.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns true" );
} );

QUnit.test( "Stop datepicker from appearing with beforeOpen event handler - false", function( assert ) {
	assert.expect( 1 );

	this.element.datepicker( {
		beforeOpen: function() {
			return false;
		}
	} );
	this.element.datepicker( "open" );
	assert.ok( !this.element.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns false" );
} );

} );
