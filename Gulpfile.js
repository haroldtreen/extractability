const gulp = require('gulp');
const mocha = require('gulp-mocha');
const args = require('yargs').argv;

const options = { reporter: 'spec', harmony: true, grep: args.regex || '.' };

gulp.task('test', () => {
    process.env.NODE_ENV = 'test';
    return gulp.src('./tests/*-test.js', { read: false })
			.pipe(mocha(options));
});

gulp.task('test-libraries', () => {
    process.env.NODE_ENV = 'test';
    return gulp.src('./tests/library-tests/*-test.js', { read: false })
			.pipe(mocha(options));
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});
