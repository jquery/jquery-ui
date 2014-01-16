module.exports = function(grunt) {

	"use strict";

	var createPerfFile = function(file) {
		// Would not have to do this if the demos used classnames instead of ids
		var cheerio = require('cheerio');
		var $ = cheerio.load(grunt.file.read(file, 'utf-8'));

		// Creating the HTML page with multiple demo elements
		$('.demo-description').remove();
		var ids = [];
		var contents = $('body').clone();
		contents.find('[id]').each(function(i, el) {
			var $this = $(this);
			ids.push($this.attr('id'));
			return $this.attr('id', $this.attr('id') + '__ID__');
		});

		var html = [],
			repeatCount = 100;
		var contentHTML = contents.html();
		for (var i = 0; i < repeatCount; i++) {
			html.push(contentHTML.replace(/__ID__/g, i));
		}
		$('body').append(html.join('<br/>'));

		// Changing script tag to work for each element created above
		var script = $('head').find('script:not([src])').text(),
			repeatScripts = [];
		for (var i = 0; i < repeatCount; i++) {
			var changedScript = script;
			ids.forEach(function(id) {
				changedScript = changedScript.replace(new RegExp('#' + id, 'g'), '#' + id + i);
			});
			repeatScripts.push(changedScript);
		}
		$('head').append('<script>' + repeatScripts.join('') + '</script>');
		return $.html();
	};

	grunt.registerTask('perf1', function() {
		this.async();
	})

	grunt.registerTask("perf", "Generate Files required for perf testing", function() {
		var path = require('path'),
			BrowserStackTunnel = require('browserstacktunnel-wrapper'),
			perfjankie = require('perfjankie'),
			perfPath = './perf/',
			done = this.async(),
			options = this.options();

		grunt.log.writeln('Generating files for running perf suite');
		var files = grunt.file.expand('./demos/**/default.html');
		var runPerfTest = function(i, cb) {
			if (i < files.length) {
				var file = files[i];
				var component = path.dirname(path.relative('./demos', file));
				var perfFile = './tmp/' + path.relative('./demos', file);
				// Write the contents back to the perf file
				grunt.file.write(perfFile, createPerfFile(file));
				perfjankie({
					url: options.httpserver + '/' + perfFile,
					suite: options.suite,
					browsers: options.browsers,
					selenium: options.selenium,
					BROWSERSTACK_USERNAME: options.BROWSERSTACK_USERNAME,
					BROWSERSTACK_KEY: options.BROWSERSTACK_KEY,
					time: options.time,
					run: options.run,
					name: component,
					log: { // Expects the following methods,  
						fatal: grunt.fail.fatal.bind(grunt.fail),
						error: grunt.fail.warn.bind(grunt.fail),
						warn: grunt.log.error.bind(grunt.log),
						info: grunt.log.ok.bind(grunt.log),
						debug: grunt.verbose.writeln.bind(grunt.verbose),
						trace: grunt.log.debug.bind(grunt.log)
					},
					couch: {
						server: options.couchdb.server,
						database: options.couchdb.database,
						updateSite: !process.env.CI
					},
					callback: function(err, res) {
						if (err) {
							grunt.log.warn(err);
						} else {
							grunt.verbose.ok(res);
						}
						runPerfTest(i + 1, cb);
					}
				});
			} else {
				grunt.file.delete('./tmp');
				cb();
			}
		};

		var browserStackTunnel = new BrowserStackTunnel({
			key: options.BROWSERSTACK_KEY,
			hosts: [{
				name: 'localhost',
				port: 9999,
				sslFlag: 0
			}]
		});

		browserStackTunnel.start(function(error) {
			if (error) {
				grunt.log.error(error);
			} else {
				runPerfTest(0, function() {
					BrowserStackTunnel.stop(function(error) {
						done(!error);
					});
				});
			}
		});
	});

}