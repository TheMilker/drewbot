const gulp = require('gulp');
const spawn = require('child_process').spawn;
const ngTemplates = require('gulp-ng-templates');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const bower = require('gulp-bower');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const del = require('del');

const rootPaths =  {
    node: './node_modules/',
    frontend: './frontend/',
    backend: './backend/',
    public: './public/',
    bower: './bower_components/'
};

const paths = {
    frontend: {
        src: rootPaths.frontend + 'src/',
        dest: rootPaths.public + 'javascripts/',
        lib: {
            dest: rootPaths.public + 'lib/'
        }
    }   
};

const server = rootPaths.backend + 'bin/www';

gulp.task('bower', () => {
    return bower();
});

gulp.task('lint:frontend', () => {
    return gulp.src(paths.frontend.src +'**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('lint:backend', () => {
    return gulp.src(rootPaths.backend +'**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('lint:gulpfile', () => {
    return gulp.src('gulpfile.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('ngtemplates', () => {
    return gulp.src(paths.frontend.src+'**/*.html')
		.pipe(ngTemplates({
			filename: 'drewbotClient-templates.js',
			module: 'em-drewbot',
            standalone: false
        }))
		.pipe(gulp.dest(rootPaths.frontend));
});

gulp.task('compile:frontendApp', ['lint:frontend', 'ngtemplates'], () => {
    return gulp.src([
            paths.frontend.src + 'drewbotClient.js',
            paths.frontend.src + '**/*.js',
            rootPaths.frontend + 'drewbotClient-templates.js'            
        ]).pipe(babel({
			presets: ['es2015']
		}))
        .pipe(concat('drewbotClient.js'))
        .pipe(gulp.dest(paths.frontend.dest));
});

// run browser-sync on for client changes
gulp.task('browser-sync', ['deploy:frontend', 'nodemon', 'watch'], () => {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        files: [rootPaths.public + '**/*.*'],
        browser: 'google chrome',
        port: 7000,
    });
});

// run nodemon on server file changes
gulp.task('nodemon', ['build'], (cb) => {
    var started = false;

    return nodemon({
        script: server,
        watch: [rootPaths.backend],
        ext: 'js',
        env: { 'NODE_ENV': 'development' }
    }).on('start', () => {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', () => {
        setTimeout(() => {
            browserSync.reload({
                stream: false
            });
        }, 500);  // browserSync reload delay
    });
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

gulp.task('watch', ['lint:backend', 'deploy:frontendApp', 'ngtemplates', 'lint:gulpfile'], () => {
    gulp.watch(rootPaths.backend + '**/*.js', ['lint:backend']); 
    gulp.watch(paths.frontend.src + '**/*.js', ['deploy:frontendApp']);
    gulp.watch(paths.frontend.src + '**/*.html', ['ngtemplates']);
    gulp.watch('gulpfile.js', ['lint:gulpfile']);
});

gulp.task('clean', () => {
    del([rootPaths.frontend + 'drewbotClient-templates.js', '!'+paths.frontend.dest, paths.frontend.dest+'**'], {dryRun: false}).then(paths => {
	   console.log('Files and folders that were deleted:\n', paths.join('\n'));
    });
});

gulp.task('deploy:frontendApp', ['lint:frontend', 'compile:frontendApp']);
gulp.task('deploy:frontend', ['deploy:frontendApp', 'deploy:frontendLibraries']);
gulp.task('build', ['lint:backend', 'deploy:frontend']);

gulp.task('dev', ['build', 'watch', 'browser-sync']);
gulp.task('default', ['server']);