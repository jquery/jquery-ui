define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/datepicker"
], function( QUnit, $, testHelper ) {

var beforeAfterEach = testHelper.beforeAfterEach;

QUnit.module( "datepicker: methods", beforeAfterEach()  );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 35 );
	var inl,
		inp = testHelper.init( "#inp" ),
		dp = $( "#ui-datepicker-div" );

	// Destroy and clear active reference
	inp.datepicker( "show" );
	assert.equal( dp.css( "display" ), "block", "Datepicker - visible" );
	inp.datepicker( "hide" ).datepicker( "destroy" );
	assert.ok( $.datepicker._curInst == null, "Datepicker - destroyed and cleared reference" );

	inp = testHelper.init( "#inp" );
	assert.ok( inp.is( ".hasDatepicker" ), "Default - marker class set" );
	assert.ok( $.data( inp[ 0 ], testHelper.PROP_NAME ), "Default - instance present" );
	assert.ok( inp.next().is( "#alt" ), "Default - button absent" );
	inp.datepicker( "destroy" );
	inp = $( "#inp" );
	assert.ok( !inp.is( ".hasDatepicker" ), "Default - marker class cleared" );
	assert.ok( !$.data( inp[ 0 ], testHelper.PROP_NAME ), "Default - instance absent" );
	assert.ok( inp.next().is( "#alt" ), "Default - button absent" );

	// With button
	inp = testHelper.init( "#inp", { showOn: "both" } );
	assert.ok( inp.is( ".hasDatepicker" ), "Button - marker class set" );
	assert.ok( $.data( inp[ 0 ], testHelper.PROP_NAME ), "Button - instance present" );
	assert.ok( inp.next().text() === "...", "Button - button added" );
	inp.datepicker( "destroy" );
	inp = $( "#inp" );
	assert.ok( !inp.is( ".hasDatepicker" ), "Button - marker class cleared" );
	assert.ok( !$.data( inp[ 0 ], testHelper.PROP_NAME ), "Button - instance absent" );
	assert.ok( inp.next().is( "#alt" ), "Button - button removed" );

	// With append text
	inp = testHelper.init( "#inp", { appendText: "Testing" } );
	assert.ok( inp.is( ".hasDatepicker" ), "Append - marker class set" );
	assert.ok( $.data( inp[ 0 ], testHelper.PROP_NAME ), "Append - instance present" );
	assert.ok( inp.next().text() === "Testing", "Append - append text added" );
	inp.datepicker( "destroy" );
	inp = $( "#inp" );
	assert.ok( !inp.is( ".hasDatepicker" ), "Append - marker class cleared" );
	assert.ok( !$.data( inp[ 0 ], testHelper.PROP_NAME ), "Append - instance absent" );
	assert.ok( inp.next().is( "#alt" ), "Append - append text removed" );

	// With both
	inp = testHelper.init( "#inp", { showOn: "both", buttonImageOnly: true,
		buttonImage: "images/calendar.gif", appendText: "Testing" } );
	assert.ok( inp.is( ".hasDatepicker" ), "Both - marker class set" );
	assert.ok( $.data( inp[ 0 ], testHelper.PROP_NAME ), "Both - instance present" );
	assert.ok( inp.next()[ 0 ].nodeName.toLowerCase() === "img", "Both - button added" );
	assert.ok( inp.next().next().text() === "Testing", "Both - append text added" );
	inp.datepicker( "destroy" );
	inp = $( "#inp" );
	assert.ok( !inp.is( ".hasDatepicker" ), "Both - marker class cleared" );
	assert.ok( !$.data( inp[ 0 ], testHelper.PROP_NAME ), "Both - instance absent" );
	assert.ok( inp.next().is( "#alt" ), "Both - button and append text absent" );

	// Inline
	inl = testHelper.init( "#inl" );
	assert.ok( inl.is( ".hasDatepicker" ), "Inline - marker class set" );
	assert.ok( inl.html() !== "", "Inline - datepicker present" );
	assert.ok( $.data( inl[ 0 ], testHelper.PROP_NAME ), "Inline - instance present" );
	assert.ok( inl.next().length === 0 || inl.next().is( "p" ), "Inline - button absent" );
	inl.datepicker( "destroy" );
	inl = $( "#inl" );
	assert.ok( !inl.is( ".hasDatepicker" ), "Inline - marker class cleared" );
	assert.ok( inl.html() === "", "Inline - datepicker absent" );
	assert.ok( !$.data( inl[ 0 ], testHelper.PROP_NAME ), "Inline - instance absent" );
	assert.ok( inl.next().length === 0 || inl.next().is( "p" ), "Inline - button absent" );
} );

QUnit.test( "enableDisable", function( assert ) {
	assert.expect( 33 );
	var inl, dp,
		inp = testHelper.init( "#inp" );
	assert.ok( !inp.datepicker( "isDisabled" ), "Enable/disable - initially marked as enabled" );
	assert.ok( !inp[ 0 ].disabled, "Enable/disable - field initially enabled" );
	inp.datepicker( "disable" );
	assert.ok( inp.datepicker( "isDisabled" ), "Enable/disable - now marked as disabled" );
	assert.ok( inp[ 0 ].disabled, "Enable/disable - field now disabled" );
	inp.datepicker( "enable" );
	assert.ok( !inp.datepicker( "isDisabled" ), "Enable/disable - now marked as enabled" );
	assert.ok( !inp[ 0 ].disabled, "Enable/disable - field now enabled" );
	inp.datepicker( "destroy" );

	// With a button
	inp = testHelper.init( "#inp", { showOn: "button" } );
	assert.ok( !inp.datepicker( "isDisabled" ), "Enable/disable button - initially marked as enabled" );
	assert.ok( !inp[ 0 ].disabled, "Enable/disable button - field initially enabled" );
	assert.ok( !inp.next( "button" )[ 0 ].disabled, "Enable/disable button - button initially enabled" );
	inp.datepicker( "disable" );
	assert.ok( inp.datepicker( "isDisabled" ), "Enable/disable button - now marked as disabled" );
	assert.ok( inp[ 0 ].disabled, "Enable/disable button - field now disabled" );
	assert.ok( inp.next( "button" )[ 0 ].disabled, "Enable/disable button - button now disabled" );
	inp.datepicker( "enable" );
	assert.ok( !inp.datepicker( "isDisabled" ), "Enable/disable button - now marked as enabled" );
	assert.ok( !inp[ 0 ].disabled, "Enable/disable button - field now enabled" );
	assert.ok( !inp.next( "button" )[ 0 ].disabled, "Enable/disable button - button now enabled" );
	inp.datepicker( "destroy" );

	// With an image button
	inp = testHelper.init( "#inp", { showOn: "button", buttonImageOnly: true,
		buttonImage: "images/calendar.gif" } );
	assert.ok( !inp.datepicker( "isDisabled" ), "Enable/disable image - initially marked as enabled" );
	assert.ok( !inp[ 0 ].disabled, "Enable/disable image - field initially enabled" );
	assert.ok( parseFloat( inp.next( "img" ).css( "opacity" ) ) === 1, "Enable/disable image - image initially enabled" );
	inp.datepicker( "disable" );
	assert.ok( inp.datepicker( "isDisabled" ), "Enable/disable image - now marked as disabled" );
	assert.ok( inp[ 0 ].disabled, "Enable/disable image - field now disabled" );
	assert.ok( parseFloat( inp.next( "img" ).css( "opacity" ) ) !== 1, "Enable/disable image - image now disabled" );
	inp.datepicker( "enable" );
	assert.ok( !inp.datepicker( "isDisabled" ), "Enable/disable image - now marked as enabled" );
	assert.ok( !inp[ 0 ].disabled, "Enable/disable image - field now enabled" );
	assert.ok( parseFloat( inp.next( "img" ).css( "opacity" ) ) === 1, "Enable/disable image - image now enabled" );
	inp.datepicker( "destroy" );

	// Inline
	inl = testHelper.init( "#inl", { changeYear: true } );
	dp = $( ".ui-datepicker-inline", inl );
	assert.ok( !inl.datepicker( "isDisabled" ), "Enable/disable inline - initially marked as enabled" );
	assert.ok( !dp.children().is( ".ui-state-disabled" ), "Enable/disable inline - not visually disabled initially" );
	assert.ok( !dp.find( "select" ).prop( "disabled" ), "Enable/disable inline - form element enabled initially" );
	inl.datepicker( "disable" );
	assert.ok( inl.datepicker( "isDisabled" ), "Enable/disable inline - now marked as disabled" );
	assert.ok( dp.children().is( ".ui-state-disabled" ), "Enable/disable inline - visually disabled" );
	assert.ok( dp.find( "select" ).prop( "disabled" ), "Enable/disable inline - form element disabled" );
	inl.datepicker( "enable" );
	assert.ok( !inl.datepicker( "isDisabled" ), "Enable/disable inline - now marked as enabled" );
	assert.ok( !dp.children().is( ".ui-state-disabled" ), "Enable/disable inline - not visiually disabled" );
	assert.ok( !dp.find( "select" ).prop( "disabled" ), "Enable/disable inline - form element enabled" );
	inl.datepicker( "destroy" );
} );

} );
