export function buildTestUrl( suite, { browserstack, jquery, migrate, port, reportId } ) {
	if ( !port ) {
		throw new Error( "No port specified." );
	}

	const query = new URLSearchParams();

	if ( jquery ) {
		query.append( "jquery", jquery );
	}

	if ( migrate ) {
		query.append( "migrate", "true" );
	}

	if ( reportId ) {
		query.append( "reportId", reportId );
	}

	// BrowserStack supplies a custom domain for local testing,
	// which is especially necessary for iOS testing.
	const host = browserstack ? "bs-local.com" : "localhost";
	return `http://${ host }:${ port }/tests/unit/${ suite }/${ suite }.html?${ query }`;
}
