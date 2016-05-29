define( [
	"jquery",
	"ui/widgets/datepicker"
], function( $ ) {

module( "datepicker: events", {
	setup: function() {
		this.element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		this.widget = this.element.datepicker( "widget" );
	},
	teardown: function() {
		this.element.datepicker( "destroy" ).val( "" );
	}
} );

test( "beforeOpen", function() {
	expect( 3 );

	var that = this;

	this.element.datepicker( {
		beforeOpen: function() {
			ok( true, "beforeOpen event fired before open" );
			ok( that.element.datepicker( "widget" ).is( ":hidden" ), "calendar hidden on beforeOpen" );
		},
		open: function() {
			ok( that.element.datepicker( "widget" ).is( ":visible" ), "calendar open on open" );
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
				ok( false, "calendar should not open when openBefore is canceled" );
			}
		} )
		.datepicker( "open" );
} );

test( "change", function() {
	expect( 4 );

	var shouldFire;

	this.element.datepicker( {
		change: function( event ) {
			ok( shouldFire, "change event fired" );
			equal(
				event.type,
				"datepickerchange",
				"change event"
			);
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

test( "close", function() {
	expect( 4 );

	var shouldFire;

	this.element.datepicker( {
		close: function() {
			ok( shouldFire, "close event fired" );
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

test( "open", function() {
	expect( 2 );

	var that = this;

	this.element.datepicker( {
		open: function() {
			ok( true, "open event fired on open" );
			ok( that.widget.is( ":visible" ), "calendar open on open" );
		}
	} );

	this.element.datepicker( "open" );
} );

asyncTest( "select", function() {
	expect( 4 );

	var message = "",
		that = this;

	this.element.datepicker( {
		select: function( event ) {
			ok( true, "select event fired " + message );
			equal(
				event.originalEvent.type,
				"calendarselect",
				"select originalEvent " + message
			);
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
			start();
		}, 100 );
	}

	step1();
} );

} );
