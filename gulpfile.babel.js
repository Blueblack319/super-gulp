"use strict";

import gulp from "gulp";
import gPug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gImage from "gulp-image";
import sass from "gulp-sass";
sass.compiler = require("node-sass");

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  scss: {
    src: "src/scss/*.scss",
    dest: "build/css",
  },
  image: {
    src: "src/img/*",
    dest: "build/img",
  },
};

const clean = () => del(["build"]);

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.image.src, image);
  gulp.watch(routes.scss.src, scss);
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gPug()).pipe(gulp.dest(routes.pug.dest));

const scss = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(gulp.dest(routes.scss.dest));

const image = () =>
  gulp.src(routes.image.src).pipe(gImage()).pipe(gulp.dest(routes.image.dest));

const prepare = gulp.series([clean]);

const assets = gulp.series([pug, image, scss]);

const live = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, live]);
