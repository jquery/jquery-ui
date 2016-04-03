define( [
	"qunit",
	"jquery",
	"ui/widgets/checkboxradio"
], function( QUnit, $ ) {

QUnit.module( "Checkboxradio: events" );

QUnit.test(
	"Resetting a checkbox's form should refresh the visual state of the checkbox",
	function( assert ) {
		var ready = assert.async();
		assert.expect( 2 );
		var form = $( "<form>" +
			"<label for='c1'></label><input id='c1' type='checkbox' checked>" +
			"</form>" ),
			checkbox = form.find( "input[type=checkbox]" ).checkboxradio(),
			widget = checkbox.checkboxradio( "widget" );

		checkbox.prop( "checked", false ).checkboxradio( "refresh" );
		assert.lacksClasses( widget, "ui-state-active" );

		form.get( 0 ).reset();

		setTimeout( function() {
			assert.hasClasses( widget, "ui-state-active" );
			ready();
		}, 1 );
	}
);

QUnit.test( "Checkbox shows focus when using keyboard navigation", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var check = $( "#check" ).checkboxradio(),
		label = $( "label[for='check']" );
	assert.lacksClasses( label, "ui-state-focus" );
	check.focus();
	setTimeout( function() {
		assert.hasClasses( label, "ui-state-focus" );
		ready();
	} );
} );

} );
