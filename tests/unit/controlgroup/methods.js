define( [
	"jquery",
	"ui/widgets/controlgroup",
	"ui/widgets/checkboxradio",
	"ui/widgets/selectmenu",
	"ui/widgets/button"
], function( $ ) {

module( "Controlgroup: methods" );

test( "destroy", function( assert ) {
	expect( 1 );
	assert.domEqual( ".controlgroup", function() {
		$( ".controlgroup" ).controlgroup().controlgroup( "destroy" );
	} );
} );

test( "disable", function( assert ) {
	expect( 2 );
	var element = $( ".controlgroup" ).controlgroup().controlgroup( "disable" );
	assert.lacksClasses( element, "ui-state-disabled",
		"The widget does not get the disabled class, because we disable each child widget" );
	strictEqual( element.find( ".ui-state-disabled" ).length, 6,
		"Child widgets are disabled" );
} );

test( "enable", function( assert ) {
	expect( 2 );
	var element = $( ".controlgroup" ).controlgroup().controlgroup( "enable" );
	assert.lacksClasses( element, "ui-state-disabled",
		"ui-state-disabled is not present on widget after enabling" );
	strictEqual( element.find( "ui-state-disabled" ).length, 0,
		"Child widgets are disabled" );
} );

var tests = {
		"checkboxradio": "<input type='checkbox'>",
		"selectmenu": "<select><option>foo</option></select>",
		"button": "<button>button text</button>"
	},
	orientations = {
		"horizontal": [
			"ui-corner-left",
			false,
			false,
			"ui-corner-right"
		],
		"vertical": [
			"ui-corner-top",
			false,
			false,
			"ui-corner-bottom"
		]
	};

// Iterate through supported element markup
$.each( tests, function( widget, html ) {

	// Check in both horizontal and vertical orientations
	$.each( orientations, function( name, classes ) {

		test( "refresh: " + widget + ": " + name, function( assert ) {
			expect( 41 );

			var i, control, currentClasses,
				controls = [],
				element = $( "<div>" ).controlgroup( {
					direction: name
				} ).appendTo( "body" );

			// checks the elements with in the controlgroup against the expected class list
			function checkCornerClasses( classList ) {
				for ( var j = 0; j < 4; j++ ) {
					if ( classList[ j ] ) {
						assert.hasClasses( controls[ j ][ widget ]( "widget" ), classList[ j ] );
					} else {
						assert.lacksClassStart( controls[ j ][ widget ]( "widget" ), "ui-corner" );
					}
				}
			}

			function showElements( index, value ) {
				$( value )[ widget ]( "widget" ).show();
			}

			// Hide each element and check the corner classes
			function iterateHidden( onlyVisible ) {
				for ( i = 0; i < 4; i++ ) {

					$( controls ).each( showElements );

					controls[ i ][ widget ]( "widget" ).hide();

					currentClasses = classes.slice( 0 );
					if ( onlyVisible ) {
						if ( i === 0 ) {
							currentClasses[ i + 1 ] = classes[ i ];
							currentClasses[ i ] = false;
						} else if ( i === 3 ) {
							currentClasses[ i - 1 ] = classes[ i ];
							currentClasses[ i ] = false;
						}
					}
					element.controlgroup( "refresh" );
					checkCornerClasses( currentClasses );
				}
			}

			// Add a label for each element and then append the element to the control group
			for ( i = 0; i < 4; i++ ) {
				control = $( html ).attr( "id", "id" + i )
					.add( $( "<label>label text</label>" ).clone().attr( "for", "id" + i ) );

				controls.push( control );
				element.append( control );
			}

			// Refresh the controlgroup now that its populated
			element.controlgroup( "refresh" );
			for ( i = 0; i < 4; i++ ) {
				strictEqual( controls[ i ].is( ":ui-" + widget ), true,
					name + ": " + widget + " " + i + ": is a " + widget + " widget" );
			}

			// Check that we have the right classes
			checkCornerClasses( classes );

			// hide each element and then check its classes
			iterateHidden( true );

			// Set the exclude option to false so we no longer care about hidden
			element.controlgroup( "option", "onlyVisible", false );

			// Iterate hiding the elements again and check their corner classes
			iterateHidden();

			// Disable the first control
			controls[ 0 ].prop( "disabled", true );

			element.controlgroup( "refresh" );

			assert.hasClasses( controls[ 0 ][ widget ]( "widget" ), "ui-state-disabled" );

			// remove the controlgroup before we start the next set
			element.remove();
		} );
	} );
} );

} );
