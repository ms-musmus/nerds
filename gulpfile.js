"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var run = require("run-sequence");
var svgstore = require("gulp-svgstore");
var uglify = require("gulp-uglify");

gulp.task("style", function () {
  gulp.src("source/sass/style.scss")
      .pipe(plumber())
      .pipe(sass())
      .pipe(postcss([
        autoprefixer()
      ]))
      .pipe(gulp.dest("build/css"))
      .pipe(minify())
      .pipe(rename("style.min.css"))
      .pipe(gulp.dest("build/css"))
      .pipe(server.stream());
});

gulp.task("serve", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html", ["html"]).on("change", server.reload);
  gulp.watch("source/js/script.js", ["uglify"]).on("change", server.reload);
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
             .pipe(imagemin([
               imagemin.optipng({optimizationLevel: 3}),
               imagemin.jpegtran({progressive: true}),
               imagemin.svgo()
             ]))
             .pipe(gulp.dest("build/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
             .pipe(posthtml([
               include()
             ]))
             .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
  ], {
    base: "source"
  })
            .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("sprite", function () {
  return gulp.src([
    "build/img/fb-icon.svg",
    "build/img/insta-icon.svg",
    "build/img/vk-icon.svg",
    "build/img/icon-up.svg",
    "build/img/icon-down.svg"
  ])
            .pipe(svgstore({
              inlineSvg: true
            }))
            .pipe(rename("sprite.svg"))
            .pipe(gulp.dest("build/img"));
});

gulp.task("uglify", function () {
  gulp.src("source/js/script.js")
  .pipe(uglify())
  .pipe(rename("script.min.js"))
  .pipe(gulp.dest("build/js"))
});

gulp.task("build", function (done) {
  run(
          "clean",
          "copy",
          "images",
          "style",
          "sprite",
          "html",
          "uglify",
          done
          );
});
