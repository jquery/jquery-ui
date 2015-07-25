define( [
	"intern!qunit",
	"jquery",
	"lib/helper",
	"lib/css",
	"text!tests/unit/autocomplete/autocomplete.html",
	"ui/accordion",
	"jquery-simulate",
	"./common"
], function( QUnit, $, helper, cssjs, htmlContent ) {
cssjs( { module: "core menu autocomplete" } );

return $.extend( helper, {
	setupTeardown: function() {
		return {
			setup: function() {
				$("body").append(htmlContent);
			},
			teardown: function() {
				$("#qunit-fixture").remove();
			}
		};
	}
} );

} );
