(function( QUnit ) {

var subsuiteFrame;

QUnit.extend( QUnit, {
	testSuites: function( suites ) {
		function generateSuite( suite ) {
			asyncTest( suite, function() {
				QUnit.runSuite( suite );
			});
		}

		for ( var i = 0; i < suites.length; i++ ) {
			generateSuite( suites[ i ] );
		}

		QUnit.done = function() {
			subsuiteFrame.style.display = "none";
		};
	},

	testStart: function( data ) {
		// update the test status to show which test suite is running
		QUnit.id( "qunit-testresult" ).innerHTML = "Running " + data.name + "...<br>&nbsp;";
	},

	testDone: function() {
		var current = QUnit.id( this.config.current.id ),
			children = current.children,
			i = 0,
			length = children.length;

		// undo the auto-expansion of failed tests
		for ( ; i < length; i++ ) {
			if ( children[i].nodeName === "OL" ) {
				children[i].style.display = "none";
			}
		}
	},

	runSuite: function( suite ) {
		var iframeWin,
			body = document.getElementsByTagName( "body" )[0],
			iframe = document.createElement( "iframe" );

		subsuiteFrame = iframe;
		iframe.className = "qunit-subsuite";
		body.appendChild( iframe );

		function onIframeLoad() {
			var module, test,
				count = 0;

			QUnit.extend( iframeWin.QUnit, {
				moduleStart: function( data ) {
					// capture module name for messages
					module = data.name;
				},

				testStart: function( data ) {
					// capture test name for messages
					test = data.name;
				},

				log: function( data ) {
					// pass all test details through to the main page
					var message = module + ": " + test + ": " + data.message;
					expect( ++count );
					QUnit.push( data.result, data.actual, data.expected, message );
				},

				done: function() {
					// start the wrapper test from the main page
					start();
				}
			});
		}
		QUnit.addEvent( iframe, "load", onIframeLoad );

		iframeWin = iframe.contentWindow;
		iframe.setAttribute( "src", suite );

		this.runSuite = function( suite ) {
			iframe.setAttribute( "src", suite );
		};
	}
});
}( QUnit ) );
