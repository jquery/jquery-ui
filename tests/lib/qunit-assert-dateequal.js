/*
 * Assertion for comparing Date objects by day, month and year.
 */
define( [
	"qunit"
], function( QUnit ) {

QUnit.assert.dateEqual = function( value, expected, message ) {

	if ( !value || !expected ) {
		this.push( false, value, expected,
			"dateEqual failed, missing date object, message was: " + message );
		return;
	}

	var newValue = new Date( value.getFullYear(), value.getMonth(), value.getDate() ),
		newExpected = new Date( expected.getFullYear(), expected.getMonth(), expected.getDate() );

	this.push( ( newValue.toString() === newExpected.toString() ), value, expected, message );
};

} );
