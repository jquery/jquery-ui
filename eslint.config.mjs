import jqueryConfig from "eslint-config-jquery";
import globals from "globals";

export default [
	{
		ignores: [
			"dist/**/*",
			"!dist/jquery-ui.js",
			"!dist/jquery-ui.min.js",
			"external/**/*",
			"tests/lib/vendor/**/*",
			"ui/vendor/**/*"
		]
	},

	{
		ignores: [ "dist/**/*" ],
		rules: {
			...jqueryConfig.rules,
			"no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_"
				}
			]
		}
	},

	{
		files: [ "Gruntfile.js" ],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "commonjs",
			globals: {
				...globals.node
			}
		},
		rules: {
			strict: [ "error", "global" ]
		}
	},

	{
		files: [ "eslint.config.mjs" ],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.node
			}
		},
		rules: {
			strict: [ "error", "global" ]
		}
	},

	// Source, demos
	{
		files: [ "ui/**/*.js", "demos/**/*.js" ],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
			globals: {
				...globals.browser,
				...globals.jquery,
				define: false,
				Globalize: false
			}
		},
		rules: {
			strict: [ "error", "function" ],

			// The following rule is relaxed due to too many violations:
			"no-unused-vars": [
				"error",
				{
					args: "after-used",
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_"
				}
			],

			// Too many violations:
			camelcase: "off",
			"no-nested-ternary": "off"
		}
	},
	{
		files: [ "ui/i18n/**/*.js" ],
		rules: {

			// We want to keep all the strings in separate single lines
			"max-len": "off"
		}
	},

	// Dist files
	// For dist files, we don't include any jQuery rules on purpose.
	// We just want to make sure the files are correct ES5.
	{
		files: [ "dist/jquery-ui.js", "dist/jquery-ui.min.js" ],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script"
		},
		linterOptions: {
			reportUnusedDisableDirectives: "off"
		}
	},

	// Build
	{
		files: [ "build/**/*.js" ],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "commonjs",
			globals: {
				...globals.node
			}
		},
		rules: {
			"no-implicit-globals": "error",
			strict: [ "error", "global" ]
		}
	},

	// Demos
	{
		files: [ "demos/**/*.js" ],
		languageOptions: {
			globals: {
				require: true
			}
		}
	},

	// Tests
	{
		files: [ "tests/**/*.js" ],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: "script",
			globals: {
				...globals.browser,
				...globals.jquery,
				define: false,
				Globalize: false,
				QUnit: false,
				require: true,
				requirejs: true
			}
		},
		"rules": {

			// Too many violations:
			"max-len": "off",
			"no-unused-vars": "off",
			strict: "off" // ideally, `[ "error", "function" ]`
		}
	}
];
