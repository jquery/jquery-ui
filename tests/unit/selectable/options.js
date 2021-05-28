define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/selectable"
], function( QUnit, $, helper ) {

QUnit.module( "selectable: options", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "autoRefresh", function( assert ) {
	assert.expect( 3 );

	var actual = 0,
		el = $( "#selectable1" ),
		sel = $( "*", el ),
		selected = function() { actual += 1; };

	el = $( "#selectable1" ).selectable( { autoRefresh: false,	selected: selected } );
	sel.hide();
	el.simulate( "drag", {
		dx: 1000,
		dy: 1000
	} );
	assert.equal( actual, sel.length );
	el.selectable( "destroy" );

	actual = 0;
	sel.show();
	el = $( "#selectable1" ).selectable( { autoRefresh: true,	selected: selected } );
	sel.hide();
	el.simulate( "drag", {
		dx: 1000,
		dy: 1000
	} );
	assert.equal( actual, 0 );

	sel.show();
	$( sel[ 0 ] ).simulate( "drag", {
		dx: 1000,
		dy: 1000
	} );
	assert.equal( actual, sel.length );

	el.selectable( "destroy" );
	sel.show();
} );

QUnit.test( "filter", function( assert ) {
	assert.expect( 2 );

	var actual = 0,
		el = $( "#selectable1" ),
		sel = $( "*", el ),
		selected = function() { actual += 1; };

	el = $( "#selectable1" ).selectable( { filter: ".special", selected: selected } );
	el.simulate( "drag", {
		dx: 1000,
		dy: 1000
	} );
	assert.ok( sel.length !== 1, "this test assumes more than 1 selectee" );
	assert.equal( actual, 1 );
	el.selectable( "destroy" );
} );

} );
