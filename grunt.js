/*global config:true, task:true*/
function stripDirectory(file) {
  return file.replace(/.+\/(.+)$/, '$1');
}
function createBanner(files) {
  // strip folders
  var fileNames = files && files.map(stripDirectory);
  return '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= template.today("isoDate") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      '* Includes: ' + (files ? fileNames.join(', ') : '<%= stripDirectory(task.current.data.src[1]) %>') + '\n' +
      '* Copyright (c) <%= template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */';
}
// allow access from banner template
global.stripDirectory = stripDirectory;

var coreFiles = 'jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.effects.core.js'.split(', ');
var uiFiles = coreFiles.map(function(file) {
  return 'ui/' + file;
}).concat(file.expand('ui/*.js').filter(function(file) {
  return coreFiles.indexOf(file.substring(3)) === -1;
}));

var minify = {
  'dist/jquery-ui.min.js': ['<banner:meta.bannerAll>', 'dist/jquery-ui.js'],
  'dist/i18n/jquery-ui-i18n.min.js': ['<banner:meta.bannerI18n>', 'dist/i18n/jquery-ui-i18n.js']
};
function minFile(file) {
  minify['dist/' + file.replace(/\.js$/, '.min.js').replace(/ui\//, 'minified/')] = ['<banner>', file];
}
uiFiles.forEach(minFile);

var allI18nFiles = file.expand('ui/i18n/*.js');
allI18nFiles.forEach(minFile);

var cssFiles = 'core accordion autocomplete button datepicker dialog menu progressbar resizable selectable slider spinner tabs tooltip theme'.split(' ').map(function(component) {
  return 'themes/base/jquery.ui.' + component + '.css';
});
var minifyCSS = {
  'dist/jquery-ui.min.css': 'dist/jquery-ui.css'
};
cssFiles.forEach(function(file) {
  minifyCSS['dist/' + file.replace(/\.css$/, '.min.css').replace(/themes\/base\//, 'themes/base/minified/')] = ['<banner>', file];
});

config.init({
  pkg: '<json:package.json>',
  files: {
    distFolder: 'dist/<%= pkg.name %>-<%= pkg.version %>',
    cdnDistFolder: 'dist/<%= pkg.name %>-<%= pkg.version %>-cdn',
    zip: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip',
    cdnZip: 'dist/<%= pkg.name %>-<%= pkg.version %>-cdn.zip'
  },
  meta: {
    banner: createBanner(),
    bannerAll: createBanner(uiFiles),
    bannerI18n: createBanner(allI18nFiles),
    bannerCSS: createBanner(cssFiles)
  },
  concat: {
    // TODO replace banners, both for JS and CSS
    ui: {
      src: ['<banner:meta.bannerAll>'].concat(uiFiles.map(function(file) {
        // TODO why doesn't this work?
        return '<file_strip_banner:' + file + '>';
      })),
      dest: 'dist/jquery-ui.js'
    },
    i18n: {
      src: ['<banner:meta.bannerI18n>', allI18nFiles],
      dest: 'dist/i18n/jquery-ui-i18n.js'
    },
    css: {
      src: ['<banner:meta.bannerCSS>'].concat(cssFiles),
      dest: 'dist/jquery-ui.css'
    }
  },
  min: minify,
  css_min: minifyCSS,
  copy: {
    dist: {
      src: [
        'AUTHORS.txt',
        'GPL-LICENSE.txt',
        'jquery-1.7.1.js',
        'MIT-LICENSE.txt',
        'README.md',
        'grunt.js',
        'package.json',
        'ui/**/*',
        'demos/**/*',
        'themes/**/*',
        'external/**/*',
        'tests/**/*'
      ],
      renames: {
        'dist/jquery-ui.js': 'ui/jquery-ui.js',
        'dist/jquery-ui.min.js': 'ui/minified/jquery-ui.min.js',
        'dist/i18n/jquery-ui-i18n.js': 'ui/i18n/jquery-ui-i18n.js',
        'dist/i18n/jquery-ui-i18n.min.js': 'ui/minified/i18n/jquery-ui-i18n.min.js',
        'dist/jquery-ui.css': 'themes/base/jquery-ui.css',
        'dist/jquery-ui.min.css': 'themes/base/minified/jquery-ui.min.css'
      },
      dest: '<%= files.distFolder %>'
    },
    dist_min: {
      src: 'dist/minified/**/*',
      strip: /^dist/,
      dest: '<%= files.distFolder %>/ui'
    },
    dist_css_min: {
      src: 'dist/themes/base/minified/*.css',
      strip: /^dist/,
      dest: '<%= files.distFolder %>'
    },
    dist_min_images: {
      src: 'themes/base/images/*',
      strip: /^themes\/base\//,
      dest: '<%= files.distFolder %>/themes/base/minified'
    },
    cdn: {
      src: [
        'AUTHORS.txt',
        'GPL-LICENSE.txt',
        'MIT-LICENSE.txt',
        'ui/*.js',
        'themes/base/images/*.png',
        'themes/base/jquery.ui.*.css',
        'package.json'
      ],
      renames: {
        'dist/jquery-ui.js': 'jquery-ui.js',
        'dist/jquery-ui.min.js': 'jquery-ui.min.js',
        'dist/i18n/jquery-ui-i18n.js': 'i18n/jquery-ui-i18n.js',
        'dist/i18n/jquery-ui-i18n.min.js': 'i18n/jquery-ui-i18n.min.js',
        'dist/jquery-ui.css': 'themes/base/jquery-ui.css',
        'dist/jquery-ui.min.css': 'themes/base/minified/jquery-ui.min.css'
      },
      dest: '<%= files.cdnDistFolder %>'
    },
    cdn_i18n: {
      src: 'ui/i18n/jquery.ui.datepicker-*.js',
      strip: 'ui/',
      dest: '<%= files.cdnDistFolder %>'
    },
    cdn_i18n_min: {
      src: 'dist/minified/i18n/jquery.ui.datepicker-*.js',
      strip: 'dist/minified',
      dest: '<%= files.cdnDistFolder %>'
    },
    cdn_min: {
      src: 'dist/minified/*.js',
      strip: /^dist\/minified/,
      dest: '<%= files.cdnDistFolder %>/ui'
    },
    cdn_css_min: {
      src: 'dist/themes/base/minified/*.css',
      strip: /^dist/,
      dest: '<%= files.cdnDistFolder %>'
    },
    dist_min_images: {
      src: 'themes/base/images/*',
      strip: /^themes\/base\//,
      dest: '<%= files.cdnDistFolder %>/themes/base/minified'
    }
  },
  zip: {
    dist: {
      src: '<%= files.distFolder %>/**/*',
      dest: '<%= files.zip %>'
    },
    cdn: {
      src: '<%= files.cdnDistFolder %>/**/*',
      dest: '<%= files.cdnZip %>'
    }
  },
  md5: {
    cdn: {
      dir: '<%= files.cdnDistFolder %>',
      dest: '<%= files.cdnDistFolder %>/MANIFEST'
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

// grunt doesn't know about this files object, so need to process that manually once
// before any other variable is resolved, otherwise it would just include the templates
var files = config().files;
for (var key in files) {
  files[key] = template.process(files[key], config());
}
config('files', files);
// log.writeln(require('util').inspect(config().files))

task.registerTask('x', function() {
  log.writeln(task.helper('concat', ['<file_strip_banner:ui/jquery.ui.core.js>']));
});

task.registerBasicTask('copy', 'Copy files to destination folder and replace @VERSION with pkg.version', function(data) {
  function replaceVersion(source) {
      return source.replace("@VERSION", config("pkg").version);
  }
  var files = file.expand(data.src);
  var target = data.dest + '/';
  files.forEach(function(fileName) {
    var targetFile = data.strip ? fileName.replace(data.strip, '') : fileName;
    file.copy(fileName, target + targetFile, replaceVersion);
  });
  log.writeln('Copyied ' + files.length + ' files.');
  for (var fileName in data.renames) {
    file.copy(fileName, target + template.process(data.renames[fileName], config()));
  }
  if (data.renames) {
    log.writeln('Renamed ' + data.renames.length + ' files.');
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

task.registerBasicTask( 'css_min', 'Minify CSS files with Sqwish.', function( data ) {
  var files = file.expand( data.src );
  // Get banner, if specified. It would be nice if UglifyJS supported ignoring
  // all comments matching a certain pattern, like /*!...*/, but it doesn't.
  var banner = task.directive(files[0], function() { return null; });
  if (banner === null) {
    banner = '';
  } else {
    files.shift();
  }
  var max = task.helper( 'concat', files );
  // Concat banner + minified source.
  var min = banner + require('sqwish').minify( max, false );
  file.write( data.dest, min );
  if ( task.hadErrors() ) {
    return false;
  }
  log.writeln( 'File "' + data.dest + '" created.' );
  task.helper( 'min_max_info', min, max );
});

task.registerBasicTask('md5', 'Create list of md5 hashes for CDN uploads', function(data) {
  // remove dest file before creating it, to make sure itself is not included
  if (require('path').existsSync(data.dest)) {
    require('fs').unlinkSync(data.dest);
  }
  var crypto = require('crypto');
  var dir = template.process(data.dir, config()) + '/';
  var hashes = [];
  file.expand(dir + '**/*').forEach(function(fileName) {
    var hash = crypto.createHash('md5');
    hash.update(file.read(fileName));
    hashes.push(fileName.replace(dir, '') + ' ' + hash.digest('hex'));
  });
  file.write(data.dest, hashes.join('\n') + '\n');
});

task.registerTask('default', 'lint qunit');
task.registerTask('build', 'concat min css_min');
task.registerTask('release', 'build copy:dist copy:dist_min copy:dist_min_images copy:dist_css_min zip:dist');
task.registerTask('release_themes', 'build download_themes zip:themes');
// TODO include other themes in cdn release
task.registerTask('release_cdn', 'build copy:cdn copy:cdn_min copy:cdn_i18n copy:cdn_i18n_min copy:cdn_css_min md5 zip:cdn');

task.registerTask('download_themes', function() {
  var AdmZip = require('adm-zip');
  var done = this.async();
  var fs = require('fs');
  var request = require('request');
  var themes = file.read('build/themes').split(',').slice(0, 1);
  var requests = 0;
  file.mkdir('dist/tmp');
  themes.forEach(function(theme, index) {
    requests += 1;
    file.mkdir('dist/tmp/' + index);
    var zipFileName = 'dist/tmp/' + index + '.zip';
    var out = fs.createWriteStream(zipFileName);
    out.on('close', function() {
      log.writeln("done downloading " + zipFileName);
      var zip = new AdmZip(zipFileName);
      zip.extractAllTo('dist/tmp/' + index + '/');
      requests -= 1;
      if (requests === 0) {
        done();
      }
    });
    request('http://ui-dev.jquery.com/download/?' + theme).pipe(out);
  });
});

// TODO add size task, see also build/sizer.js - copy from core grunt.js
