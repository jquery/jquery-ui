define( [
	"qunit",
	"jquery",
	"ui/widgets/checkboxradio"
], function( QUnit, $ ) {

QUnit.module( "Checkboxradio: core" );

QUnit.test( "Checkbox - Initial class structure", function( assert ) {
	assert.expect( 2 );
	var input = $( "#check" ),
		label = $( "label[for=check]" );

	input.checkboxradio();
	assert.hasClasses( input, "ui-helper-hidden-accessible ui-checkboxradio" );
	assert.hasClasses( label, "ui-button ui-widget ui-checkboxradio-label ui-corner-all" );
} );

QUnit.test( "Radios - Initial class structure", function( assert ) {
	assert.expect( 6 );
	var inputs = $( "#radio0 input" ),
		labels = $( "#radio0 label" );

	inputs.checkboxradio();
	inputs.each( function() {
		assert.hasClasses( this, "ui-helper-hidden-accessible" );
	} );
	labels.each( function() {
		assert.hasClasses( this, "ui-button" );
	} );
} );

QUnit.test( "Ensure checked after single click on checkbox label button", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	$( "#check2" ).checkboxradio().change( function() {
		var label = $( this ).checkboxradio( "widget" );
		assert.ok( this.checked, "checked ok" );

		assert.hasClasses( label, "ui-state-active" );
	} );

	// Support: Opera
	// Opera doesn't trigger a change event when this is done synchronously.
	// This seems to be a side effect of another test, but until that can be
	// tracked down, this delay will have to do.
	setTimeout( function() {
		$( "#check2" ).checkboxradio( "widget" ).simulate( "click" );
		ready();
	} );
} );

QUnit.test( "Handle form association via form attribute", function( assert ) {
	assert.expect( 4 );

	var radio1 = $( "#crazy-form-1" ).checkboxradio();
	var radio1Label = radio1.checkboxradio( "widget" );
	var radio2 = $( "#crazy-form-2" ).checkboxradio();
	var radio2Label = radio2.checkboxradio( "widget" );

	radio2.change( function() {
		assert.ok( this.checked, "#2 checked" );
		assert.ok( !radio1[ 0 ].checked, "#1 not checked" );

		assert.hasClasses( radio2Label, "ui-state-active" );
		assert.lacksClasses( radio1Label, "ui-state-active" );
	} );

	radio2Label.simulate( "click" );
} );

QUnit.test( "Checkbox creation requires a label, and finds it in all cases", function( assert ) {
	assert.expect( 7 );
	var groups = [
		"<span><label for='t7092a'></label><input type='checkbox' id='t7092a'></span>",
		"<span><input type='checkbox' id='t7092b'><label for='t7092b'></label></span>",
		"<span><span><input type='checkbox' id='t7092c'></span><label for='t7092c'></label></span>",
		"<span><input type='checkbox' id='t7092d'></span><span><label for='t7092d'></label></span>",
		"<span><input type='checkbox' id='t7092e'><span><label for='t7092e'></label></span></span>",
		"<span><label><input type='checkbox' id='t7092f'></label></span>",
		"<span><input type='checkbox' id='check:7534'><label for='check:7534'>Label</label></span>"
	];

	$.each( groups, function( index, markup ) {
		var group = $( markup );

		group.find( "input[type=checkbox]" ).checkboxradio();
		assert.hasClasses( group.find( "label" ), "ui-button" );
	} );
} );

QUnit.test( "Calling checkboxradio on an unsupported element throws an error", function( assert ) {
	assert.expect( 2 );

	var errorMessage =
		"Can't create checkboxradio on element.nodeName=div and element.type=undefined";
	var error = new Error( errorMessage );
	assert.raises(
		function() {
			$( "<div>" ).checkboxradio();
		},

		// Support: jQuery 1.7.0 only
		$.fn.jquery === "1.7" ? errorMessage : error,
		"Proper error thrown"
	);

	errorMessage = "Can't create checkboxradio on element.nodeName=input and element.type=button";
	error = new Error( errorMessage );
	assert.raises(
		function() {
			$( "<input type='button'>" ).checkboxradio();
		},

		// Support: jQuery 1.7.0 only
		$.fn.jquery === "1.7" ? errorMessage : error,
		"Proper error thrown"
	);
} );

QUnit.test( "Calling checkboxradio on an input with no label throws an error", function( assert ) {
	assert.expect( 1 );

	var errorMessage = "No label found for checkboxradio widget";
	var error = new Error( errorMessage );
	assert.raises(
		function() {
			$( "<input type='checkbox'>" ).checkboxradio();
		},

		// Support: jQuery 1.7.0 only
		$.fn.jquery === "1.7" ? errorMessage : error,
		"Proper error thrown"
	);
} );

} );
