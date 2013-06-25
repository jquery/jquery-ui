var categories, flatten, manifest, pkg;

categories = {
	core: {
		name: "ui.{plugin}",
		title: "jQuery UI {Plugin}"
	},
	widget: {
		name: "ui.{plugin}",
		title: "jQuery UI {Plugin}",
		dependencies: [ "core", "widget" ]
	},
	interaction: {
		name: "ui.{plugin}",
		title: "jQuery UI {Plugin}",
		dependencies: [ "core", "widget", "mouse" ]
	},
	effect: {
		name: "ui.effect-{plugin}",
		title: "jQuery UI {Plugin} Effect",
		keywords: [ "effect", "show", "hide" ],
		homepage: "http://jqueryui.com/effect/",
		demo: "http://jqueryui.com/effect/",
		docs: "http://api.jqueryui.com/{plugin}-effect/",
		dependencies: [ "effect" ]
	}
};

flatten = function( flat, arr ) {
	return flat.concat( arr );
};

pkg = require( "../package.json" );

manifest = function() {
	return Object.keys( categories ).map(function( category ) {
		var baseManifest = categories[ category ],
			plugins = require( "./" + category );

		return Object.keys( plugins ).map(function( plugin ) {
			var manifest,
				data = plugins[ plugin ],
				name = plugin.charAt( 0 ).toUpperCase() + plugin.substr( 1 );

			function replace( str ) {
				return str.replace( "{plugin}", plugin ).replace( "{Plugin}", name );
			}

			manifest = {
				name: data.name || replace( baseManifest.name ),
				title: data.title || replace( baseManifest.title ),
				description: data.description,
				keywords: [ "ui", plugin ]
					.concat( baseManifest.keywords || [] )
					.concat( data.keywords || [] ),
				version: pkg.version,
				author: pkg.author,
				maintainers: pkg.maintainers,
				licenses: pkg.licenses,
				bugs: pkg.bugs,
				homepage: data.homepage || replace( baseManifest.homepage ||
					"http://jqueryui.com/{plugin}/" ),
				demo: data.demo || replace( baseManifest.demo ||
					"http://jqueryui.com/{plugin}/" ),
				docs: data.docs || replace( baseManifest.docs ||
					"http://api.jqueryui.com/{plugin}/" ),
				download: "http://jqueryui.com/download/",
				dependencies: {
					jquery: ">=1.6"
				},
				// custom
				category: data.category || category
			};

			(baseManifest.dependencies || [])
				.concat(data.dependencies || [])
				.forEach(function( dependency ) {
					manifest.dependencies[ "ui." + dependency ] = pkg.version;
				});

			return manifest;
		});
	}).reduce( flatten, [] );
};

module.exports = manifest;
