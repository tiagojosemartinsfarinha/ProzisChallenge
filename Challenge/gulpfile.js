/// <binding AfterBuild='build, default' />

var gulp = require('gulp'),
    ts = require('gulp-typescript');
var gulpCommon = require("./Common/gulpfile");
var instance = new gulpCommon.Gulp(__dirname)
var compile = instance.Compile;
var copy = instance.Copy;
var build = instance.build;


gulp.task("compiletypescript", function() {
    return compile.typescript();
});

gulp.task("compileless", function() {
    return compile.less();
});

gulp.task("default", function() {
    return compile.typescript();
});