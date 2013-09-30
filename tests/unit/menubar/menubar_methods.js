(function( $ ) {

var log = TestHelpers.menubar.log,
	logOutput = TestHelpers.menubar.logOutput,
	click = TestHelpers.menubar.click;

module( "menubar: methods", {
	setup: function() {
		TestHelpers.menubar.clearLog();
	}
});

test ( "_destroy should successfully unwrap 'span.ui-button-text' elements" , function() {
  expect(1);

	var containedButtonTextSpans,
    element = $( "#bar1" ).menubar();

  element.menubar( "destroy" );
  containedButtonTextSpans = element.find( "span.ui-button-text" ).length
  equal( containedButtonTextSpans, 0, "All 'span.ui-button-text'  should be removed by destroy" );
});

})( jQuery );
