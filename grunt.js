/*global config:true, task:true*/
var coreFiles = 'jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.effects.core.js'.split(', ');
config.init({
  pkg: '<json:package.json>',
  meta: {
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= template.today("m/d/yyyy") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      '* Copyright (c) <%= template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
  },
  concat: {
    // 'dist/ui/jquery-ui.js': ['<banner>', '<file_strip_banner:ui/*.js>']
    'dist/jquery-ui.js': coreFiles.map(function(file) {
      return 'ui/' + file;
    }).concat(file.expand('ui/*.js').filter(function(file) {
      return coreFiles.indexOf(file.substring(3)) === -1;
    }))
  },
  min: {
    'dist/jquery-ui.min.js': ['<banner>', 'dist/jquery-ui.js']
  },
  zip: {
    dist: {
      src: [
        'dist/**/*.js',
        'README.md',
        'grunt.js',
        'package.json',
        'ui/**/*',
        'demos/**/*',
        'themes/**/*',
        'external/**/*',
        'tests/**/*'
      ],
      dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
    }
  },
  qunit: {
    files: file.expand('tests/unit/**/*.html').filter(function(file) {
      // disabling everything that doesn't (quite) work with PhantomJS for now
      // except for all|index|test, try to include more as we go
      return !(/(all|index|test|draggable|droppable|selectable|resizable|sortable|dialog|slider|datepicker|tabs|tabs_deprecated)\.html/).test(file);
    })
  },
  lint: {
    // TODO extend this to tests
    files: ['ui/*']
  },
  jshint: {
    options: {
      curly: true,
      eqeqeq: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      sub: true,
      undef: true,
      eqnull: true,
      browser: true
    },
    globals: {
      jQuery: true
    }
  }
});

task.registerBasicTask('zip', 'Create a zip file for release', function(data) {
  var files = file.expand(data.src);
  log.writeln("Creating zip file " + data.dest);

  var done = this.async();

  var zipstream = require('zipstream');
  var fs = require('fs');

  var out = fs.createWriteStream(data.dest);
  var zip = zipstream.createZip({ level: 1 });

  zip.pipe(out);

  function addFile() {
    if (!files.length) {
      zip.finalize(function(written) {
        log.writeln(written + ' total bytes written');
        done();
      });
      return;
    }
    var file = files.shift();
    log.verbose.writeln('Zipping ' + file);
    zip.addFile(fs.createReadStream(file), { name: file }, addFile);
  }
  addFile();
});

task.registerTask('default', 'lint qunit');
task.registerTask('release', 'default concat min zip');
