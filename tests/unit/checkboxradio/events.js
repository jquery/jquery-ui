define( [
	"jquery",
	"ui/checkboxradio"
], function( $ ) {

module( "Checkboxradio: events" );

asyncTest( "form reset / click", function( assert ) {
	expect( 35 );

	var radios = [
			$( "#radio11" ).checkboxradio(),
			$( "#radio12" ).checkboxradio(),
			$( "#radio13" ).checkboxradio()
		],
		widgets = [
			radios[ 0 ].checkboxradio( "widget" ),
			radios[ 1 ].checkboxradio( "widget" ),
			radios[ 2 ].checkboxradio( "widget" )
		],
		form1 = $( "#form1" ),
		form2 = $( "#form2" );

	// Checkes that only the specified radio is checked in the group
	function assertChecked( checked ) {
		$.each( widgets, function( index ) {
			var method = index === checked ? "hasClasses" : "lacksClasses";

			assert[ method ]( widgets[ index ], "ui-checkboxradio-checked ui-state-active" );
		} );
	}

	// Checks the form count on each form
	function assertFormCount( count ) {
		equal( form1.data( "uiCheckboxradioCount" ), count, "Form1 has a count of " + count );
		equal( form2.data( "uiCheckboxradioCount" ), 3, "Form2 has a count of 3" );
	}

	// Run the tests
	function testForms( current, start ) {
		assertChecked( 2 );

		if ( !start && current !== 0 ) {
			radios[ current - 1 ].checkboxradio( "destroy" );
		}

		assertFormCount( 3 - current );

		radios[ current ].prop( "checked", true );
		radios[ current ].trigger( "change" );
		assertChecked( current );

		form1.trigger( "reset" );
	}

	// Recoursivly run the tests in a setTimeout with call back for the resets
	function iterate( i ) {
		setTimeout( function() {
			if ( i < 3 ) {
				testForms( i );
				iterate( i + 1 );
				return;
			}
			radios[ 2 ].checkboxradio( "destroy" );
			assertChecked( false );
			start();
		} );
	}

	$( "#form2 input" ).checkboxradio();

	// Check the starting state then kick everything off
	testForms( 0, true );
	iterate( 0 );

} );

asyncTest(
	"Resetting a checkbox's form should refresh the visual state of the checkbox",
	function( assert ) {
		expect( 2 );
		var form = $( "<form>" +
			"<label for='c1'></label><input id='c1' type='checkbox' checked>" +
			"</form>" ),
			checkbox = form.find( "input[type=checkbox]" ).checkboxradio(),
			widget = checkbox.checkboxradio( "widget" );

		checkbox.prop( "checked", false ).checkboxradio( "refresh" );
		assert.lacksClasses( widget, "ui-state-active" );

		form.get( 0 ).reset();

		setTimeout(function() {
			assert.hasClasses( widget, "ui-state-active" );
			start();
		}, 1 );
	}
);

asyncTest( "Checkbox shows focus when using keyboard navigation", function( assert ) {
		expect( 2 );
		var check = $( "#check" ).checkboxradio(),
			label = $( "label[for='check']" );
		assert.lacksClasses( label, "ui-state-focus" );
		check.focus();
		setTimeout(function() {
			assert.hasClasses( label, "ui-state-focus" );
			start();
		} );
	}
);

} );
