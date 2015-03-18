'use strict';
// generated on 2014-07-14 using generator-gulp-webapp 0.1.0

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();

gulp.task('styles', function(){
    return gulp.src('app/assets/sass/main.scss')
    .pipe($.rubySass({
        precision: 10
    }))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('./app/assets/css/'))
    .pipe($.size());
});

gulp.task('scripts', function(){
    return gulp.src('app/assets/js/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    // .pipe($.concat('app.js'))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('app/assets/images/**/*', 'content/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 8,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/assets/images'))
        .pipe($.size());
});


gulp.task('fonts', function () {
    return gulp.src(mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe($.size());
});




gulp.task('content', ['styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/**/*.php')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.livereload())
        .pipe($.size());
});







gulp.task('build', ['styles', 'scripts', 'images', 'fonts']);

gulp.task('default',  function () {
    // gulp.start('build');
    console.log('Please choose build, watch, or serve');
});



gulp.task('serve', ['styles', 'scripts'], function () {
    require('opn')('http://localhost:9090');
});

gulp.task('dev', $.shell.task([
  'php -S localhost:9090 ',
  'echo "completed"'
]))

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/assets/styles/**/*.scss')
        .pipe(wiredep({
            directory: '../bower_components'
        }))
        .pipe(gulp.dest('app/assets/styles'));

    gulp.src('app/**/*.php')
        .pipe(wiredep({
            directory: '../bower_components'
        }))
        .pipe(gulp.dest('app'));
});

// gulp.task('watch', ['connect', 'serve'], function () {
gulp.task('watch', ['serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        'app/**/*',
        'app/assets/css/**/*.css',
        'app/assets/scripts/**/*.js',
        'app/assets/images/**/*',
        'app/content/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/assets/sass/**/*.scss', ['styles']);
    gulp.watch('app/assets/scripts/**/*.js', ['scripts']);
    gulp.watch('app/assets/images/**/*', ['images']);
    gulp.watch('app/content/**/*', ['content']);
    gulp.watch('bower.json', ['wiredep']);
});




