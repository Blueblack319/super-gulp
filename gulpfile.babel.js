"use strict";

import gulp from "gulp";
import gPug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import gImage from "gulp-image";
import sass from "gulp-sass";
sass.compiler = require("node-sass");
import autoprefixer from "gulp-autoprefixer";
import minify from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "dist",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/style.scss",
    dest: "dist/css",
  },
  image: {
    src: "src/img/*",
    dest: "dist/img",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/*.js",
    dest: "dist/js",
  },
};

const clean = () => del(["dist", ".publish"]);

const webserver = () =>
  gulp.src("dist").pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.image.src, image);
  gulp.watch(routes.scss.watch, scss);
  gulp.watch(routes.js.watch, js);
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gPug()).pipe(gulp.dest(routes.pug.dest));

const scss = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: "last 2 versions",
        flexbox: true,
        grid: "autoplace",
      })
    )
    .pipe(minify())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }),
          ["uglifyify", { global: true }],
        ],
      })
    )
    .pipe(gulp.dest("dist/js"));

const image = () =>
  gulp.src(routes.image.src).pipe(gImage()).pipe(gulp.dest(routes.image.dest));

const gh = () => gulp.src("dist/**/*").pipe(ghPages());

const prepare = gulp.series([clean]);

const assets = gulp.series([pug, image, scss, js]);

const live = gulp.parallel([webserver, watch]);

export const dist = gulp.series([prepare, assets]);

export const dev = gulp.series([dist, live]);

export const deploy = gulp.series([dist, gh, clean]);
