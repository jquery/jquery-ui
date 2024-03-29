import chalk from "chalk";
import { asyncExitHook, gracefulExit } from "exit-hook";
import { reportEnd, reportTest } from "./reporter.js";
import { createTestServer } from "./createTestServer.js";
import { buildTestUrl } from "./lib/buildTestUrl.js";
import { generateHash } from "./lib/generateHash.js";
import { getBrowserString } from "./lib/getBrowserString.js";
import { suites as allSuites } from "./suites.js";
import { cleanupAllBrowsers, touchBrowser } from "./selenium/browsers.js";
import { addRun, getNextBrowserTest, retryTest, runAll } from "./selenium/queue.js";

const EXIT_HOOK_WAIT_TIMEOUT = 60 * 1000;

/**
 * Run test suites in parallel in different browser instances.
 */
export async function run( {
	browser: browserNames = [],
	concurrency,
	debug,
	headless,
	jquery: jquerys = [],
	migrate,
	retries = 0,
	suite: suites = [],
	verbose
} ) {
	if ( !browserNames.length ) {
		browserNames = [ "chrome" ];
	}
	if ( !suites.length ) {
		suites = allSuites;
	}
	if ( !jquerys.length ) {
		jquerys = [ "3.7.1" ];
	}
	if ( headless && debug ) {
		throw new Error(
			"Cannot run in headless mode and debug mode at the same time."
		);
	}

	const errorMessages = [];
	const pendingErrors = {};

	// Convert browser names to browser objects
	let browsers = browserNames.map( ( b ) => ( { browser: b } ) );

	// Create the test app and
	// hook it up to the reporter
	const reports = Object.create( null );
	const app = await createTestServer( async( message ) => {
		switch ( message.type ) {
			case "testEnd": {
				const reportId = message.id;
				const report = reports[ reportId ];
				touchBrowser( report.browser );
				const errors = reportTest( message.data, reportId, report );
				pendingErrors[ reportId ] ??= Object.create( null );
				if ( errors ) {
					pendingErrors[ reportId ][ message.data.name ] = errors;
				} else {
					const existing = pendingErrors[ reportId ][ message.data.name ];

					// Show a message for flakey tests
					if ( existing ) {
						console.log();
						console.warn(
							chalk.italic(
								chalk.gray( existing.replace( "Test failed", "Test flakey" ) )
							)
						);
						console.log();
						delete pendingErrors[ reportId ][ message.data.name ];
					}
				}
				break;
			}
			case "runEnd": {
				const reportId = message.id;
				const report = reports[ reportId ];
				touchBrowser( report.browser );
				const { failed, total } = reportEnd(
					message.data,
					message.id,
					reports[ reportId ]
				);
				report.total = total;

				// Handle failure
				if ( failed ) {
					const retry = retryTest( reportId, retries );

					// Retry if retryTest returns a test
					if ( retry ) {
						return retry;
					}

					errorMessages.push( ...Object.values( pendingErrors[ reportId ] ) );
				}

				// Run the next test
				return getNextBrowserTest( reportId );
			}
			case "ack": {
				const report = reports[ message.id ];
				touchBrowser( report.browser );
				break;
			}
			default:
				console.warn( "Received unknown message type:", message.type );
		}
	} );

	// Start up local test server
	let server;
	let port;
	await new Promise( ( resolve ) => {

		// Pass 0 to choose a random, unused port
		server = app.listen( 0, () => {
			port = server.address().port;
			resolve();
		} );
	} );

	if ( !server || !port ) {
		throw new Error( "Server not started." );
	}

	if ( verbose ) {
		console.log( `Server started on port ${ port }.` );
	}

	function stopServer() {
		return new Promise( ( resolve ) => {
			server.close( () => {
				if ( verbose ) {
					console.log( "Server stopped." );
				}
				resolve();
			} );
		} );
	}

	asyncExitHook(
		async() => {
			await cleanupAllBrowsers( { verbose } );
			await stopServer();
		},
		{ wait: EXIT_HOOK_WAIT_TIMEOUT }
	);

	function queueRuns( suite, browser ) {
		const fullBrowser = getBrowserString( browser, headless );

		for ( const jquery of jquerys ) {
			const reportId = generateHash( `${ suite } ${ fullBrowser }` );
			reports[ reportId ] = { browser, headless, jquery, migrate, suite };

			const url = buildTestUrl( suite, {
				jquery,
				migrate,
				port,
				reportId
			} );

			const options = {
				debug,
				headless,
				jquery,
				migrate,
				reportId,
				suite,
				verbose
			};

			addRun( url, browser, options );
		}
	}

	for ( const browser of browsers ) {
		for ( const suite of suites ) {
			queueRuns( suite, browser );
		}
	}

	try {
		await runAll( { concurrency, verbose } );
	} catch ( error ) {
		console.error( error );
		if ( !debug ) {
			gracefulExit( 1 );
		}
	} finally {
		console.log();
		if ( errorMessages.length === 0 ) {
			let stop = false;
			for ( const report of Object.values( reports ) ) {
				if ( !report.total ) {
					stop = true;
					console.error(
						chalk.red(
							`No tests were run for ${ report.suite } in ${ getBrowserString(
								report.browser
							) }`
						)
					);
				}
			}
			if ( stop ) {
				return gracefulExit( 1 );
			}
			console.log( chalk.green( "All tests passed!" ) );

			if ( !debug ) {
				gracefulExit( 0 );
			}
		} else {
			console.error( chalk.red( `${ errorMessages.length } tests failed.` ) );
			console.log(
				errorMessages.map( ( error, i ) => `\n${ i + 1 }. ${ error }` ).join( "\n" )
			);

			if ( debug ) {
				console.log();
				console.log( "Leaving browsers open for debugging." );
				console.log( "Press Ctrl+C to exit." );
			} else {
				gracefulExit( 1 );
			}
		}
	}
}
