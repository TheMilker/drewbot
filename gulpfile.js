var gulp = require('gulp');
var spawn = require('child_process').spawn;
var ngTemplates = require('gulp-ng-templates');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var bower = require('gulp-bower');

var rootPaths =  {
    node: './node_modules/',
    frontend: './frontend/',
    backend: './backend/',
    public: './public/',
    bower: './bower_components/'
};

var paths = {
    frontend: {
        src: rootPaths.frontend + 'src/',
        dest: rootPaths.public + 'javascripts/',
        lib: {
            dest: rootPaths.public + 'lib/'
        }
    }   
};

var server = rootPaths.backend + 'bin/www';

gulp.task('bower', function() {
    return bower();
});

gulp.task('lint', function() {
    return gulp.src(['gulpfile.js', paths.frontend.src+'**/*.js', rootPaths.backend.src+'**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('ngtemplates', () => {
    return gulp.src(paths.frontend.src+'**/*.html')
		.pipe(ngTemplates({
			filename: 'drewbotClient-templates.js',
			module: 'em-drewbot'
        }))
		.pipe(gulp.dest(rootPaths.frontend));
});

gulp.task('concat', ['lint', 'ngtemplates'], () => {
    return gulp.src([
            paths.frontend.src + 'drewbotClient.js',
            paths.frontend.src + '**/*.js',
            rootPaths.frontend + 'drewbotClient-templates.js'            
        ])
        .pipe(concat('drewbotClient.js'))
        .pipe(gulp.dest(paths.frontend.dest));
});

gulp.task('server', ['build'], (cb) => {   
    var child = spawn('node', [server]);
    child.stdout.on('data', (chunk) => {
        console.log(`${chunk}`);
    });
    child.stderr.on('data', (chunk) => {
        console.log(`${chunk}`);
    });    
});

gulp.task('deploy:frontendLibraries', ['bower'], () => {
    return gulp.src([
        rootPaths.node + 'angular/angular.js',
        rootPaths.node + 'angular/angular.min.js',
        rootPaths.node + 'angular/angular.min.js.map',
        rootPaths.node + 'underscore/underscore.js',
        rootPaths.bower + 'jquery/dist/jquery.js',
        rootPaths.bower + 'jquery-ui/jquery-ui.js'
    ])
    .pipe(gulp.dest(paths.frontend.lib.dest));
});

gulp.task('deploy:frontend', ['lint', 'ngtemplates', 'concat', 'deploy:frontendLibraries']);
gulp.task('build', ['lint', 'deploy:frontend']);

gulp.task('default', ['server']);