/**
 * QUnit Composite
 *
 * https://github.com/JamesMGreene/qunit-composite
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license/
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( [ "qunit" ], factory );
	} else {
		factory( QUnit );
	}
}(function( QUnit ) {
var iframe, hasBound, resumeTests, suiteAssert,
	modules = 1,
	executingComposite = false;

function hasClass( elem, name ) {
	return ( " " + elem.className + " " ).indexOf( " " + name + " " ) > -1;
}

function addClass( elem, name ) {
	if ( !hasClass( elem, name ) ) {
		elem.className += ( elem.className ? " " : "" ) + name;
	}
}

function addEvent( elem, type, fn ) {
	if ( elem.addEventListener ) {
		// Standards-based browsers
		elem.addEventListener( type, fn, false );
	} else if ( elem.attachEvent ) {
		// support: IE <9
		elem.attachEvent( "on" + type, fn );
	}
}

function runSuite( suite ) {
	var path;

	if ( QUnit.is( "object", suite ) ) {
		path = suite.path;
		suite = suite.name;
	} else {
		path = suite;
	}

	QUnit.test( suite, function( assert ) {
		resumeTests = assert.async();
		suiteAssert = assert;
		iframe.setAttribute( "src", path );
		// QUnit.start is called from the child iframe's QUnit.done hook.
	});
}

function initIframe() {
	var iframeWin,
		body = document.body;

	function onIframeLoad() {
		var moduleName, testName,
			count = 0;

		if ( !iframe.src ) {
			return;
		}

		// Deal with QUnit being loaded asynchronously via AMD
		if ( !iframeWin.QUnit && iframeWin.define && iframeWin.define.amd ) {
			return iframeWin.require( [ "qunit" ], onIframeLoad );
		}

		iframeWin.QUnit.moduleStart(function( data ) {
			// Capture module name for messages
			moduleName = data.name;
		});

		iframeWin.QUnit.testStart(function( data ) {
			// Capture test name for messages
			testName = data.name;
		});
		iframeWin.QUnit.testDone(function() {
			testName = undefined;
		});

		iframeWin.QUnit.log(function( data ) {
			if (testName === undefined) {
				return;
			}
			// Pass all test details through to the main page
			var message = ( moduleName ? moduleName + ": " : "" ) + testName + ": " + ( data.message || ( data.result ? "okay" : "failed" ) );
			suiteAssert.expect( ++count );
			suiteAssert.push( data.result, data.actual, data.expected, message );
		});

		// Continue the outer test when the iframe's test is done
		iframeWin.QUnit.done(function() {
			resumeTests();
		});
	}

	iframe = document.createElement( "iframe" );
	iframe.className = "qunit-composite-suite";
	body.appendChild( iframe );

	addEvent( iframe, "load", onIframeLoad );

	iframeWin = iframe.contentWindow;
}

function appendSuitesToHeader( suites ) {
	var i, suitesLen, suite, path, name, suitesEl, testResultEl,
		newSuiteListItemEl, newSuiteLinkEl;

	suitesEl = document.getElementById("qunit-testsuites");

	if (!suitesEl) {
		testResultEl = document.getElementById("qunit-testresult");

		if (!testResultEl) {
			// QUnit has not been set up yet. Defer until QUnit is ready.
			QUnit.begin(function () {
				appendSuitesToHeader(suites);
			});
			return;
		}

		suitesEl = document.createElement("ul");
		suitesEl.id = "qunit-testsuites";
		testResultEl.parentNode.insertBefore(suitesEl, testResultEl);
	}

	for (i = 0, suitesLen = suites.length; i < suitesLen; ++i) {
		suite = suites[i];
		newSuiteLinkEl = document.createElement("a");
		newSuiteLinkEl.innerHTML = suite.name || suite;
		newSuiteLinkEl.href = suite.path || suite;

		newSuiteListItemEl = document.createElement("li");
		newSuiteListItemEl.appendChild(newSuiteLinkEl);

		suitesEl.appendChild(newSuiteListItemEl);
	}
}

/**
 * @param {string} [name] Module name to group these test suites.
 * @param {Array} suites List of suites where each suite
 *  may either be a string (path to the html test page),
 *  or an object with a path and name property.
 */
QUnit.testSuites = function( name, suites ) {
	var i, suitesLen;

	if ( arguments.length === 1 ) {
		suites = name;
		name = "Composition #" + modules++;
	}
	suitesLen = suites.length;

	appendSuitesToHeader(suites);

	if ( !hasBound ) {
		hasBound = true;
		QUnit.begin( initIframe );

		// TODO: Would be better to use something like QUnit.once( 'moduleDone' )
		// after the last test suite.
		QUnit.moduleDone( function () {
			executingComposite = false;
		} );

		QUnit.done(function() {
			iframe.style.display = "none";
		});
	}

	QUnit.module( name, {
		beforeEach: function () {
			executingComposite = true;
		}
	});

	for ( i = 0; i < suitesLen; i++ ) {
		runSuite( suites[ i ] );
	}
};

QUnit.testDone(function( data ) {
	if ( !executingComposite ) {
		return;
	}

	var i, len,
		testId = data.testId,
		current = document.getElementById( "qunit-test-output-" + testId ),
		children = current && current.children,
		src = iframe.src;

	if (!(current && children)) {
		return;
	}

	addEvent( current, "dblclick", function( e ) {
		var target = e && e.target ? e.target : window.event.srcElement;
		if ( target.nodeName.toLowerCase() === "span" || target.nodeName.toLowerCase() === "b" ) {
			target = target.parentNode;
		}
		if ( window.location && target.nodeName.toLowerCase() === "strong" ) {
			window.location = src;
		}
	});

	// Undo QUnit's auto-expansion for bad tests
	for ( i = 0, len = children.length; i < len; i++ ) {
		if ( children[ i ].nodeName.toLowerCase() === "ol" ) {
			addClass( children[ i ], "qunit-collapsed" );
		}
	}

	// Update Rerun link to point to the standalone test suite page
	current.getElementsByTagName( "a" )[ 0 ].href = src;
});

}));
