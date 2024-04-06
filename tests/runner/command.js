import yargs from "yargs/yargs";
import { browsers } from "./flags/browsers.js";
import { getPlan, listBrowsers, stopWorkers } from "./browserstack/api.js";
import { buildBrowserFromString } from "./browserstack/buildBrowserFromString.js";
import { jquery } from "./flags/jquery.js";
import { suites } from "./flags/suites.js";
import { run } from "./run.js";

const argv = yargs( process.argv.slice( 2 ) )
	.version( false )
	.strict()
	.command( {
		command: "[options]",
		describe: "Run jQuery tests in a browser"
	} )
	.option( "suite", {
		alias: "s",
		type: "array",
		choices: suites,
		description:
			"Run tests for a specific test suite.\n" +
			"Pass multiple test suites by repeating the option.\n" +
			"Defaults to all suites."
	} )
	.option( "jquery", {
		alias: "j",
		type: "array",
		choices: jquery,
		description:
			"Run tests against a specific jQuery version.\n" +
			"Pass multiple versions by repeating the option.",
		default: [ "3.7.1" ]
	} )
	.option( "migrate", {
		type: "boolean",
		description:
			"Run tests with jQuery Migrate enabled.",
		default: false
	} )
	.option( "browser", {
		alias: "b",
		type: "array",
		choices: browsers,
		description:
			"Run tests in a specific browser." +
			"Pass multiple browsers by repeating the option." +
			"If using BrowserStack, specify browsers using --browserstack.",
		default: [ "chrome" ]
	} )
	.option( "headless", {
		alias: "h",
		type: "boolean",
		description:
			"Run tests in headless mode. Cannot be used with --debug or --browserstack.",
		conflicts: [ "debug", "browserstack" ]
	} )
	.option( "concurrency", {
		alias: "c",
		type: "number",
		description:
			"Run tests in parallel in multiple browsers. " +
			"Defaults to 8 in normal mode. In browserstack mode, " +
			"defaults to the maximum available under your BrowserStack plan."
	} )
	.option( "debug", {
		alias: "d",
		type: "boolean",
		description:
			"Leave the browser open for debugging. Cannot be used with --headless.",
		conflicts: [ "headless" ]
	} )
	.option( "retries", {
		alias: "r",
		type: "number",
		description: "Number of times to retry failed tests by refreshing the URL."
	} )
	.option( "hard-retries", {
		type: "number",
		description:
			"Number of times to retry failed tests by restarting the worker. " +
			"This is in addition to the normal retries " +
			"and are only used when the normal retries are exhausted."
	} )
	.option( "verbose", {
		alias: "v",
		type: "boolean",
		description: "Log additional information."
	} )
	.option( "browserstack", {
		type: "array",
		description:
			"Run tests in BrowserStack.\n" +
			"Requires BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables.\n" +
			"The value can be empty for the default configuration, or a string in the format of\n" +
			"\"browser_[browserVersion | :device]_os_osVersion\" (see --list-browsers).\n" +
			"Pass multiple browsers by repeating the option.\n" +
			"The --browser option is ignored when --browserstack has a value.\n" +
			"Otherwise, the --browser option will be used, " +
			"with the latest version/device for that browser, on a matching OS."
	} )
	.option( "run-id", {
		type: "string",
		description: "A unique identifier for the run in BrowserStack."
	} )
	.option( "list-browsers", {
		type: "string",
		description:
			"List available BrowserStack browsers and exit.\n" +
			"Leave blank to view all browsers or pass " +
			"\"browser_[browserVersion | :device]_os_osVersion\" with each parameter " +
			"separated by an underscore to filter the list (any can be omitted).\n" +
			"\"latest\" can be used in place of \"browserVersion\" to find the latest version.\n" +
			"\"latest-n\" can be used to find the nth latest browser version.\n" +
			"Use a colon to indicate a device.\n" +
			"Examples: \"chrome__windows_10\", \"safari_latest\", " +
			"\"Mobile Safari\", \"Android Browser_:Google Pixel 8 Pro\".\n" +
			"Use quotes if spaces are necessary."
	} )
	.option( "stop-workers", {
		type: "boolean",
		description:
			"WARNING: This will stop all BrowserStack workers that may exist and exit," +
			"including any workers running from other projects.\n" +
			"This can be used as a failsafe when there are too many stray workers."
	} )
	.option( "browserstack-plan", {
		type: "boolean",
		description: "Show BrowserStack plan information and exit."
	} )
	.help().argv;

if ( typeof argv.listBrowsers === "string" ) {
	listBrowsers( buildBrowserFromString( argv.listBrowsers ) );
} else if ( argv.stopWorkers ) {
	stopWorkers();
} else if ( argv.browserstackPlan ) {
	console.log( await getPlan() );
} else {
	run( argv );
}
