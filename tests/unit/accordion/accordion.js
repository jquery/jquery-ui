define([
	"./accordion_common",
	"./accordion_core",
	"./accordion_events" ,
	"./accordion_methods",
	"./accordion_options"
], function( common, core, events, methods, options ) {

	common();
	core();
	events();
	methods();
	options();

});
