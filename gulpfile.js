var gulp = require('gulp');
var	sass = require('gulp-sass');
var browserSync = require('browser-sync');
var del = require('del');
var imageMin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	return gulp.src('app/scss/main.scss')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], {cascade: true}))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
})

gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
})

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('minImg', function() {
	return gulp.src('app/img/**/*')
	.pipe(imageMin({
		interlaced: true,
		progressive: true,
		svgpPlugins:[{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('dist/img'))
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/scss/main.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'minImg', 'sass'], function() {
	var buildCss = gulp.src([
		'app/css/main.css',
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
	])
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src([
		'app/js/**/*',
	])
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src([
		'app/*.html',
	])
	.pipe(gulp.dest('dist'));
});