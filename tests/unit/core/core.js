/*
 * core unit tests
 */
(function($) {

module('core - jQuery extensions');

test('focus - original functionality', function() {
	expect(1);
	
	$('#inputTabindex0')
		.focus(function() {
			ok(true, 'event triggered');
		})
		.focus();
});

asyncTest('focus', function() {
	expect(2);
	$('#inputTabindex0')
		.focus(function() {
			ok(true, 'event triggered');
		})
		.focus(500, function() {
			ok(true, 'callback triggered');
			$(this).unbind('focus');
			start();
		});
});

test('zIndex', function() {
	var el = $('#zIndexAutoWithParent'),
		parent = el.parent();
	equals(el.zIndex(), 100, 'zIndex traverses up to find value');
	equals(parent.zIndex(200), parent, 'zIndex setter is chainable');
	equals(el.zIndex(), 200, 'zIndex setter changed zIndex');
	
	el = $('#zIndexAutoWithParentViaCSS');
	equals(el.zIndex(), 0, 'zIndex traverses up to find CSS value, not found because not positioned');
	
	el = $('#zIndexAutoWithParentViaCSSPositioned');
	equals(el.zIndex(), 100, 'zIndex traverses up to find CSS value');
	el.parent().zIndex(200);
	equals(el.zIndex(), 200, 'zIndex setter changed zIndex, overriding CSS');
	
	equals($('#zIndexAutoNoParent').zIndex(), 0, 'zIndex never explicitly set in hierarchy');
});

test( "innerWidth - getter", function() {
	var el = $( "#dimensions" );

	equals( el.innerWidth(), 122, "getter passthru" );
	el.hide();
	equals( el.innerWidth(), 122, "getter passthru when hidden" );
});

test( "innerWidth - setter", function() {
	var el = $( "#dimensions" );

	el.innerWidth( 120 );
	equals( el.width(), 98, "width set properly" );
	el.hide();
	el.innerWidth( 100 );
	equals( el.width(), 78, "width set properly when hidden" );
});

test( "innerHeight - getter", function() {
	var el = $( "#dimensions" );

	equals( el.innerHeight(), 70, "getter passthru" );
	el.hide();
	equals( el.innerHeight(), 70, "getter passthru when hidden" );
});

test( "innerHeight - setter", function() {
	var el = $( "#dimensions" );

	el.innerHeight( 60 );
	equals( el.height(), 40, "height set properly" );
	el.hide();
	el.innerHeight( 50 );
	equals( el.height(), 30, "height set properly when hidden" );
});

test( "outerWidth - getter", function() {
	var el = $( "#dimensions" );

	equals( el.outerWidth(), 140, "getter passthru" );
	el.hide();
	equals( el.outerWidth(), 140, "getter passthru when hidden" );
});

test( "outerWidth - setter", function() {
	var el = $( "#dimensions" );

	el.outerWidth( 130 );
	equals( el.width(), 90, "width set properly" );
	el.hide();
	el.outerWidth( 120 );
	equals( el.width(), 80, "width set properly when hidden" );
});

test( "outerWidth(true) - getter", function() {
	var el = $( "#dimensions" );

	equals( el.outerWidth(true), 154, "getter passthru w/ margin" );
	el.hide();
	equals( el.outerWidth(true), 154, "getter passthru w/ margin when hidden" );
});

test( "outerWidth(true) - setter", function() {
	var el = $( "#dimensions" );

	el.outerWidth( 130, true );
	equals( el.width(), 76, "width set properly" );
	el.hide();
	el.outerWidth( 120, true );
	equals( el.width(), 66, "width set properly when hidden" );
});

test( "outerHeight - getter", function() {
	var el = $( "#dimensions" );

	equals( el.outerHeight(), 86, "getter passthru" );
	el.hide();
	equals( el.outerHeight(), 86, "getter passthru when hidden" );
});

test( "outerHeight - setter", function() {
	var el = $( "#dimensions" );

	el.outerHeight( 80 );
	equals( el.height(), 44, "height set properly" );
	el.hide();
	el.outerHeight( 70 );
	equals( el.height(), 34, "height set properly when hidden" );
});

test( "outerHeight(true) - getter", function() {
	var el = $( "#dimensions" );

	equals( el.outerHeight(true), 98, "getter passthru w/ margin" );
	el.hide();
	equals( el.outerHeight(true), 98, "getter passthru w/ margin when hidden" );
});

test( "outerHeight(true) - setter", function() {
	var el = $( "#dimensions" );

	el.outerHeight( 90, true );
	equals( el.height(), 42, "height set properly" );
	el.hide();
	el.outerHeight( 80, true );
	equals( el.height(), 32, "height set properly when hidden" );
});

})(jQuery);
