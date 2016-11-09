define( [
	"qunit",
	"jquery",
	"ui/widget"
], function( QUnit, $ ) {

QUnit.module( "widget animation", ( function() {
	var show = $.fn.show,
		fadeIn = $.fn.fadeIn,
		slideDown = $.fn.slideDown;
	return {
		beforeEach: function() {
			$.widget( "ui.testWidget", {
				_create: function() {
					this.element.hide();
				},
				show: function( fn ) {
					this._show( this.element, this.options.show, fn );
				}
			} );
			$.effects = { effect: { testEffect: $.noop } };
		},
		afterEach: function() {
			delete $.ui.testWidget;
			delete $.effects.effect.testEffect;
			$.fn.show = show;
			$.fn.fadeIn = fadeIn;
			$.fn.slideDown = slideDown;
		}
	};
}() ) );

QUnit.test( "show: null", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );

	var element = $( "#widget" ).testWidget(),
		hasRun = false;
	$.fn.show = function() {
		assert.ok( true, "show called" );
		assert.equal( arguments.length, 0, "no args passed to show" );
	};

	element
		.delay( 50 )
		.queue( function( next ) {
			assert.ok( !hasRun, "queue before show" );
			next();
		} )
		.testWidget( "show", function() {
			hasRun = true;
		} )
		.queue( function( next ) {
			assert.ok( hasRun, "queue after show" );
			ready();
			next();
		} );
} );

QUnit.test( "show: true", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );

	var element = $( "#widget" ).testWidget( {
			show: true
		} ),
		hasRun = false;
	$.fn.fadeIn = function( duration, easing, complete ) {
		return this.queue( function( next ) {
			assert.strictEqual( duration, undefined, "duration" );
			assert.strictEqual( easing, undefined, "easing" );
			complete();
			next();
		} );
	};

	element
		.delay( 50 )
		.queue( function( next ) {
			assert.ok( !hasRun, "queue before show" );
			next();
		} )
		.testWidget( "show", function() {
			hasRun = true;
		} )
		.queue( function( next ) {
			assert.ok( hasRun, "queue after show" );
			ready();
			next();
		} );
} );

QUnit.test( "show: number", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );

	var element = $( "#widget" ).testWidget( {
		show: 123
	} ),
	hasRun = false;
	$.fn.fadeIn = function( duration, easing, complete ) {
		return this.queue( function( next ) {
			assert.strictEqual( duration, 123, "duration" );
			assert.strictEqual( easing, undefined, "easing" );
			complete();
			next();
		} );
	};

	element
		.delay( 50 )
		.queue( function( next ) {
			assert.ok( !hasRun, "queue before show" );
			next();
		} )
		.testWidget( "show", function() {
			hasRun = true;
		} )
		.queue( function( next ) {
			assert.ok( hasRun, "queue after show" );
			ready();
			next();
		} );
} );

QUnit.test( "show: core animation", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );

	var element = $( "#widget" ).testWidget( {
		show: "slideDown"
	} ),
	hasRun = false;
	$.fn.slideDown = function( duration, easing, complete ) {
		return this.queue( function( next ) {
			assert.strictEqual( duration, undefined, "duration" );
			assert.strictEqual( easing, undefined, "easing" );
			complete();
			next();
		} );
	};

	element
		.delay( 50 )
		.queue( function( next ) {
			assert.ok( !hasRun, "queue before show" );
			next();
		} )
		.testWidget( "show", function() {
			hasRun = true;
		} )
		.queue( function( next ) {
			assert.ok( hasRun, "queue after show" );
			ready();
			next();
		} );
} );

QUnit.test( "show: effect", function( assert ) {
	var ready = assert.async();
	assert.expect( 5 );

	var element = $( "#widget" ).testWidget( {
		show: "testEffect"
	} ),
	hasRun = false;
	$.fn.show = function( options ) {
		return this.queue( function( next ) {
			assert.equal( options.effect, "testEffect", "effect" );
			assert.ok( !( "duration" in options ), "duration" );
			assert.ok( !( "easing" in options ), "easing" );
			options.complete();
			next();
		} );
	};

	element
		.delay( 50 )
		.queue( function( next ) {
			assert.ok( !hasRun, "queue before show" );
			next();
		} )
		.testWidget( "show", function() {
			hasRun = true;
		} )
		.queue( function( next ) {
			assert.ok( hasRun, "queue after show" );
			ready();
			next();
		} );
} );

QUnit.test( "show: object(core animation)", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );

	var element = $( "#widget" ).testWidget( {
		show: {
			effect: "slideDown",
			duration: 123,
			easing: "testEasing"
		}
	} ),
	hasRun = false;
	$.fn.slideDown = function( duration, easing, complete ) {
		return this.queue( function( next ) {
			assert.equal( duration, 123, "duration" );
			assert.equal( easing, "testEasing", "easing" );
			complete();
			next();
		} );
	};

	element
		.delay( 50 )
		.queue( function( next ) {
			assert.ok( !hasRun, "queue before show" );
			next();
		} )
		.testWidget( "show", function() {
			hasRun = true;
		} )
		.queue( function( next ) {
			assert.ok( hasRun, "queue after show" );
			ready();
			next();
		} );
} );

QUnit.test( "show: object(effect)", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	var element = $( "#widget" ).testWidget( {
		show: {
			effect: "testEffect",
			duration: 123,
			easing: "testEasing"
		}
	} ),
	hasRun = false;
	$.fn.show = function( options ) {
		return this.queue( function( next ) {
			assert.deepEqual( options, {
				effect: "testEffect",
				duration: 123,
				easing: "testEasing",
				complete: options.complete
			} );
			options.complete();
			next();
		} );
	};

	element
		.delay( 50 )
		.queue( function( next ) {
			assert.ok( !hasRun, "queue before show" );
			next();
		} )
		.testWidget( "show", function() {
			hasRun = true;
		} )
		.queue( function( next ) {
			assert.ok( hasRun, "queue after show" );
			ready();
			next();
		} );
} );

} );
