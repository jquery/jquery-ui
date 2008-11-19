/*
 * common UI unit tests
 */
(function($) {

var plugins = [
	"accordion",
	"datepicker",
	"dialog",
	"draggable",
	"droppable",
	"progressbar",
	"resizable",
	"selectable",
	"slider",
	"sortable",
	"tabs"
];

module("version");

test("core", function() {
	equals($.ui.version, "@VERSION", "$.ui.version");
});

$(plugins).each(function() {
	var pluginName = this;
	test(pluginName, function() {
		if ($.ui[pluginName])
			equals($.ui[pluginName].version, "@VERSION", "$.ui." + pluginName + ".version");
		else
			ok(false, "$.ui." + pluginName + " undefined.");
	});
});

})(jQuery);
