import crypto from "node:crypto";

export function generateHash( string ) {
	const hash = crypto.createHash( "md5" );
	hash.update( string );

	// QUnit hashes are 8 characters long
	// We use 10 characters to be more visually distinct
	return hash.digest( "hex" ).slice( 0, 10 );
}
