export function buildTestUrl( suite, { jquery, port, reportId } ) {
	if ( !port ) {
		throw new Error( "No port specified." );
	}

	const query = new URLSearchParams();

	if ( jquery ) {
		query.append( "jquery", jquery );
	}

	if ( reportId ) {
		query.append( "reportId", reportId );
	}

	return `http://localhost:${ port }/tests/unit/${ suite }/${ suite }.html?${ query }`;
}
