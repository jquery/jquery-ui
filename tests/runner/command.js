import yargs from "yargs/yargs";
import { browsers } from "./browsers.js";
import { suites } from "./suites.js";
import { run } from "./run.js";
import { jquery } from "./jquery.js";

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
	.option( "browser", {
		alias: "b",
		type: "array",
		choices: browsers,
		description:
			"Run tests in a specific browser.\n" +
			"Pass multiple browsers by repeating the option.",
		default: [ "chrome" ]
	} )
	.option( "headless", {
		alias: "h",
		type: "boolean",
		description:
			"Run tests in headless mode. Cannot be used with --debug.",
		conflicts: [ "debug" ]
	} )
	.option( "debug", {
		alias: "d",
		type: "boolean",
		description:
			"Leave the browser open for debugging. Cannot be used with --headless.",
		conflicts: [ "headless" ]
	} )
	.option( "concurrency", {
		alias: "c",
		type: "number",
		description: "Run tests in parallel in multiple browsers. Defaults to 8."
	} )
	.option( "run-id", {
		type: "string",
		description: "A unique identifier for this run."
	} )
	.option( "verbose", {
		alias: "v",
		type: "boolean",
		description: "Log additional information."
	} )
	.help().argv;

run( argv );
