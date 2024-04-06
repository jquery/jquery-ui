import { readFile } from "node:fs/promises";
import bodyParser from "body-parser";
import express from "express";
import bodyParserErrorHandler from "express-body-parser-error-handler";

export async function createTestServer( report ) {
	const app = express();

	// Redirect home to test page
	app.get( "/", ( _req, res ) => {
		res.redirect( "/tests/" );
	} );

	// Redirect to trailing slash
	app.use( ( req, res, next ) => {
		if ( req.path === "/tests" ) {
			const query = req.url.slice( req.path.length );
			res.redirect( 301, `${ req.path }/${ query }` );
		} else {
			next();
		}
	} );

	// Add a script tag to HTML pages to load the QUnit listeners
	app.use( /\/tests\/unit\/([^/]+)\/\1\.html$/, async( req, res ) => {
		const html = await readFile(
			`tests/unit/${ req.params[ 0 ] }/${ req.params[ 0 ] }.html`,
			"utf8"
		);
		res.send(
			html.replace(
				"</head>",
				"<script src=\"/tests/runner/listeners.js\"></script></head>"
			)
		);
	} );

	// Bind the reporter
	app.post(
		"/api/report",
		bodyParser.json( { limit: "50mb" } ),
		async( req, res ) => {
			if ( report ) {
				const response = await report( req.body );
				if ( response ) {
					res.json( response );
					return;
				}
			}
			res.sendStatus( 204 );
		}
	);

	// Handle errors from the body parser
	app.use( bodyParserErrorHandler() );

	// Serve static files
	app.use( "/dist", express.static( "dist" ) );
	app.use( "/src", express.static( "src" ) );
	app.use( "/tests", express.static( "tests" ) );
	app.use( "/ui", express.static( "ui" ) );
	app.use( "/themes", express.static( "themes" ) );
	app.use( "/external", express.static( "external" ) );

	return app;
}
