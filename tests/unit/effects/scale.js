define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/effects/effect-scale"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "effect.scale: Scale", { afterEach: helper.moduleAfterEach }  );

function run( position, v, h, vo, ho ) {
	var desc = "End Position Correct: " + position + " (" + v + "," + h + ") - origin: (" + vo + "," + ho + ")";
	QUnit.test( desc, function( assert ) {
		var ready = assert.async();
		assert.expect( 2 );
		function complete() {
			assert.close( parseInt( test.css( h ), 10 ), target[ h ], 1, "Horizontal Position Correct " + desc );
			assert.close( parseInt( test.css( v ), 10 ), target[ v ], 1, "Vertical Position Correct " + desc );
			ready();
		}
		var test = $( ".testScale" ),
			css = {
				position: position
			},
			effect = {
				effect: "scale",
				mode: "effect",
				percent: 200,
				origin: [ vo, ho ],
				complete: complete,
				duration: 1
			},
			target = {},
			relative = position === "relative";

		css[ h ] = 33;
		css[ v ] = 33;
		if ( h === ho ) {
			target[ h ] = css[ h ];
		} else if ( ho === "center" ) {
			target[ h ] = css[ h ] - 35;
		} else {
			target[ h ] = css[ h ] - 70;
		}
		if ( v === vo ) {
			target[ v ] = css[ v ];
		} else if ( vo === "middle" ) {
			target[ v ] = css[ v ] - 35;
		} else {
			target[ v ] = css[ v ] - 70;
		}
		if ( relative && h === "right" ) {
			target[ h ] += 70;
		}
		if ( relative && v === "bottom" ) {
			target[ v ] += 70;
		}
		test.css( css );
		test.effect( effect );
	} );
}

function suite( position ) {
	run( position, "top", "left", "top", "left" );
	run( position, "top", "left", "middle", "center" );
	run( position, "top", "left", "bottom", "right" );

	/* Firefox is currently not capable of supporting detection of bottom and right....
	run( position, "bottom", "right", "top", "left" );
	run( position, "bottom", "right", "middle", "center" );
	run( position, "bottom", "right", "bottom", "right" );
	*/
}

$( function() {
	suite( "absolute" );
	suite( "relative" );
	var fixedElem = $( "<div>" )
		.css( {
			position: "fixed",
			top: 10
		} )
		.appendTo( "body" );
	if ( fixedElem.offset().top === 10 ) {
		suite( "fixed" );
	}
} );

} );
