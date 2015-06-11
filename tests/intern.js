
define({
	proxyPort: 9000,
	proxyUrl: "http://localhost:9000/",
	capabilities: {},
	environments: [
		{ browserName: "chrome" },
		{ browserName: "internet explorer", version: [ "11", "10", "9" ] },
		// TODO: Firefox 35 is broken for Browserstack, fix when they have Selenium 2.46
		{ browserName: "firefox", version: [ "34" ] }
	],
	maxConcurrency: 2,
	tunnel: "BrowserStackTunnel",
	loaders: {
	"host-node": "requirejs",
	"host-browser": "external/requirejs/require.js"
	},
	loaderOptions: {
		paths: {
			"globalize": "external/globalize/globalize",
			"globalize/ja-JP": "external/globalize/globalize.culture.ja-JP",
			"jquery": jqueryUrl(),
			"jquery-simulate": "external/jquery-simulate/jquery.simulate",
			"jshint": "external/jshint/jshint",
			"lib": "tests/lib",
			"phantom-bridge": "node_modules/grunt-contrib-qunit/phantomjs/bridge",
			"qunit-assert-classes": "external/qunit-assert-classes/qunit-assert-classes",
			"qunit-assert-close": "external/qunit-assert-close/qunit-assert-close",
			"qunit": "external/qunit/qunit",
			"testswarm": "http://swarm.jquery.org/js/inject.js?" + (new Date()).getTime(),
			"text": "external/requirejs-text/text",
			"ui": "ui"
		},
		shim: {
			"globalize/ja-JP": [ "globalize" ],
			"jquery-simulate": [ "jquery" ],
			"qunit-assert-close": [ "qunit" ],
			"testswarm": [ "qunit" ]
		}
	},
	suites: [
	"test/unit/all",
	],
	excludeInstrumentation: /^(?:node_modules|test)\//
});
