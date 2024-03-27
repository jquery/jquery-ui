export function buildTestUrl( suite, { jquery, migrate, port, reportId } ) {
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

	return `http://localhost:${ port }/tests/unit/${ suite }/${ suite }.html?${ query }`;
}
