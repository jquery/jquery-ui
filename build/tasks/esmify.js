var jscodeshift = require( "jscodeshift" );

/**
 * This turns AMD-module-style files into ES6 modules.
 */
function transform( source ) {
	var j = jscodeshift;
	var root = j( source );

	// Get the comment on top of every page
	var leadingComment = root.find( j.Program ).get( "body", 0 ).node.leadingComments;

	root
		.find( j.CallExpression, {
			callee: {
				type: "FunctionExpression",
				params: [ {
					name: "factory"
				} ]
			},
			arguments: [ { type: "FunctionExpression" } ]
		} )
		.forEach( function( amdRoot ) {

			// Paths to where we import modules from
			var importPaths = [];

			// Extract import paths from the AMD header.
			// Example: define(["jquery", "./foo", "./bar"], factory)
			j( amdRoot ).find( j.CallExpression, {
				callee: { name: "define" },
				arguments: [ {
					type: "ArrayExpression"
				}, {
					name: "factory"
				} ]
			} )
				.forEach( function( defineCall ) {
					importPaths = defineCall.value.arguments[ 0 ].elements;
				} );

			var definitionFunction = amdRoot.value.arguments[ 0 ];

			// Extract import identifiers from the AMD body function's parameters.
			// Example: function ($) { ...
			// which will transform into: import $ from "jquery"
			var imports = definitionFunction.params;

			// Replace the module's return statement with an export default statement.
			var moduleBody = definitionFunction.body.body.map( function( statement ) {

				if ( statement.type === "ReturnStatement" ) {
					return j.exportDeclaration( true, statement.argument );
				}
				return statement;

			} );

			// Combine import paths from define() with parameters from the factory,
			// to generate import statements.
			var importDeclarations = [];
			for ( var i = 0; i < importPaths.length; i++ ) {

				// Add .js extension to the import path (unless we import "jquery")
				var importPath = importPaths[ i ].value === "jquery" ?
					importPaths[ i ] : j.literal(  importPaths[ i ].value + ".js" );
				var specifier = i < imports.length ?
					[ j.importDefaultSpecifier( imports[ i ] ) ] : [];
				importDeclarations.push(
					j.importDeclaration( specifier, importPath )
				);
			}

			var moduleBodyWithImports = [].concat(
				importDeclarations,
				moduleBody
			);

			j( amdRoot.parent ).replaceWith( moduleBodyWithImports );

			// re-add comment to to the top
			root.get().node.comments = leadingComment;
		} );

	return root.toSource();
}

module.exports = function( grunt ) {
grunt.registerTask( "esmify", "", function() {
	grunt.file.recurse( "./ui", function callback( abspath, rootdir, subdir, filename ) {
		if ( !filename.endsWith( ".js" ) || filename.endsWith( "core.js" ) ) {
			return;
		}

		var code = grunt.file.read( abspath );
		var transformedCode = transform( code );
		grunt.file.write(
			"esm" + ( subdir ? "/" + subdir + "/" : "/" ) + filename,
			transformedCode
		);
	} );
} );
};
