/*global config:true, task:true*/
var coreFiles = 'jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.effects.core.js'.split(', ');
var allFiles = coreFiles.map(function(file) {
  return 'ui/' + file;
}).concat(file.expand('ui/*.js').filter(function(file) {
  return coreFiles.indexOf(file.substring(3)) === -1;
}));
var rawList = allFiles.map(function(file) {
  return file.substring(3);
});

var minify = {
  'dist/ui/minified/jquery-ui.min.js': ['<banner:meta.bannerAll>', 'dist/ui/jquery-ui.js'],
  'dist/ui/minified/i18n/jquery-ui-i18n.min.js': ['<banner:meta.bannerI18n>', 'dist/ui/i18n/jquery-ui-i18n.js']
};
function minFile(file) {
  minify['dist/' + file.replace(/\.js$/, '.min.js').replace(/ui\//, 'ui/minified/')] = ['<banner>', file];
}
allFiles.forEach(minFile);

var allI18nFiles = file.expand('ui/i18n/*.js');
allI18nFiles.forEach(minFile);
var i18nfiles = allI18nFiles.map(function(file) {
  return file.substring(8);
});

function createBanner(files) {
  return '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= template.today("isoDate") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      (files ? '* Includes: ' + files.join(', ') + '\n' : '') +
      '* Copyright (c) <%= template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */';
}

config.init({
  pkg: '<json:package.json>',
  meta: {
    banner: createBanner(),
    bannerAll: createBanner(rawList),
    bannerI18n: createBanner(i18nfiles)
  },
  concat: {
    'dist/ui/jquery-ui.js': allFiles,
    'dist/ui/i18n/jquery-ui-i18n.js': 'ui/i18n/*.js'
  },
  min: minify,
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

  var fs = require('fs');
  var AdmZip = require('adm-zip');
  var zip = new AdmZip();
  files.forEach(function(file) {
    log.verbose.writeln('Zipping ' + file);
    // rewrite file names from dist folder (created by build), drop the /dist part
    zip.addFile(file.replace(/^dist/, ''), fs.readFileSync(file));
  });
  zip.writeZip(data.dest);
  log.writeln("Wrote " + files.length + " files to " + data.dest);
});

task.registerTask('default', 'lint qunit');
task.registerTask('release', 'concat min zip');
