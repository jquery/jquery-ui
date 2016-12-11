define( [
	"qunit",
	"jquery",
	"ui/widgets/datepicker"
], function( QUnit, $ ) {

QUnit.module( "datepicker: events", {
	beforeEach: function() {
		this.element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		this.widget = this.element.datepicker( "widget" );
	},
	afterEach: function() {
		this.element.datepicker( "destroy" ).val( "" );
	}
} );

QUnit.test( "beforeOpen", function( assert ) {
	assert.expect( 3 );

	var that = this;

	this.element.datepicker( {
		beforeOpen: function() {
			assert.ok( true, "beforeOpen event fired before open" );
			assert.ok( that.element.datepicker( "widget" ).is( ":hidden" ), "calendar hidden on beforeOpen" );
		},
		open: function() {
			assert.ok( that.element.datepicker( "widget" ).is( ":visible" ), "calendar open on open" );
		}
	} );

	this.element
		.datepicker( "open" )
		.datepicker( "close" )
		.datepicker( "option", {
			beforeOpen: function() {
				return false;
			},
			open: function() {
				assert.ok( false, "calendar should not open when openBefore is canceled" );
			}
		} )
		.datepicker( "open" );
} );

QUnit.test( "change", function( assert ) {
	assert.expect( 6 );

	var shouldFire;

	this.element.datepicker( {
		change: function( event, ui ) {
			assert.ok( shouldFire, "change event fired" );
			assert.equal(
				event.type,
				"datepickerchange",
				"change event"
			);
			assert.equal( $.type( ui.value ), "date", "value is a date object" );
		}
	} );

	shouldFire = true;
	this.element.datepicker( "open" );
	this.widget.find( "tbody button" ).eq( 1 ).simulate( "mousedown" );

	shouldFire = false;
	this.element.datepicker( "open" );
	this.widget.find( "tbody button" ).eq( 1 ).simulate( "mousedown" );

	shouldFire = true;
	this.element.datepicker( "open" );
	this.widget.find( "tbody button" ).eq( 2 ).simulate( "mousedown" );
} );

QUnit.test( "close", function( assert ) {
	assert.expect( 4 );

	var shouldFire;

	this.element.datepicker( {
		close: function() {
			assert.ok( shouldFire, "close event fired" );
		}
	} );

	shouldFire = false;
	this.element.datepicker( "open" );
	shouldFire = true;
	this.element.datepicker( "close" );

	shouldFire = false;
	this.element.datepicker( "open" );
	shouldFire = true;
	$( "body" ).trigger( "mousedown" );

	shouldFire = false;
	this.element.datepicker( "open" );
	shouldFire = true;
	this.element.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );

	shouldFire = false;
	this.element.datepicker( "open" );
	shouldFire = true;
	this.widget.find( "tbody tr:first button:first" ).simulate( "mousedown" );
} );

QUnit.test( "open", function( assert ) {
	assert.expect( 2 );

	var that = this;

	this.element.datepicker( {
		open: function() {
			assert.ok( true, "open event fired on open" );
			assert.ok( that.widget.is( ":visible" ), "calendar open on open" );
		}
	} );

	this.element.datepicker( "open" );
} );

QUnit.test( "select", function( assert ) {
	var ready = assert.async();
	assert.expect( 6 );

	var message = "",
		that = this;

	this.element.datepicker( {
		select: function( event, ui ) {
			assert.ok( true, "select event fired " + message );
			assert.equal(
				event.originalEvent.type,
				"calendarselect",
				"select originalEvent " + message
			);
			assert.equal( $.type( ui.value ), "date", "value is a date object" );
		}
	} );

	function step1() {
		message = "on calendar cell click";
		that.element
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout( function() {
			that.widget.find( "tbody tr:first button:first" ).simulate( "mousedown" );
			that.element.datepicker( "close" );
			step2();
		}, 100 );
	}

	function step2() {
		message = "on calendar cell enter";
		that.element
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout( function() {
			$( document.activeElement )
				.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			that.element.datepicker( "close" );
			step3();
		}, 100 );
	}

	function step3() {
		message = "on calendar escape (not expected)";
		that.element
			.simulate( "focus" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			that.element.datepicker( "close" );
			ready();
		}, 100 );
	}

	step1();
} );

QUnit.test( "refresh", function( assert ) {
	assert.expect( 1 );

	var shouldFire;

	this.element.calendar( {
		refresh: function() {
			assert.ok( shouldFire, "refresh event fired" );
		}
	} );

	shouldFire = true;
	this.element.find( "button.ui-calendar-next" ).simulate( "click" );

	shouldFire = false;
	this.element.find( "table button:eq(1)" ).simulate( "click" );
} );

} );
