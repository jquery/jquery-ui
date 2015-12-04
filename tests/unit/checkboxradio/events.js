define( [
	"jquery",
	"ui/widgets/checkboxradio"
], function( $ ) {

module( "Checkboxradio: events" );

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

		setTimeout( function() {
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
	setTimeout( function() {
		assert.hasClasses( label, "ui-state-focus" );
		start();
	} );
} );

} );
