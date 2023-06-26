const { src, dest, parallel, watch, series } = require("gulp");

const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const fileInclude = require("gulp-file-include");

const sourceFiles = "app";

function styles() {
  return src("app/scss/style.scss")
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(concat("style.min.css"))
    .pipe(dest(sourceFiles + "/css"))
    .pipe(dest(sourceFiles + "/build/css/"))
    .pipe(browserSync.stream());
}

function browserSyncF() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function html() {
  return src(sourceFiles + "/pages/*.html")
    .pipe(fileInclude())
    .pipe(dest(sourceFiles + "/build/"))
    .pipe(dest(sourceFiles + "/"))
    .pipe(browserSync.stream());
}

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/pages/*.html"], html, browserSync.reload);
  watch(["app/components/**/*.html"], html, browserSync.reload);
}

function vendorJS() {
  const modules = [
    "node_modules/swiper/swiper-bundle.min.js",
    "node_modules/swiper/swiper-bundle.min.js.map",
    "node_modules/@fancyapps/ui/dist/fancybox/fancybox.umd.js",
    "node_modules/@fancyapps/ui/dist/fancybox/fancybox.esm.js",
  ];

  return src(modules).pipe(dest("app/build/js"));
}

function vendorCSS() {
  const modules = [
    "node_modules/swiper/swiper-bundle.min.css",
    "node_modules/@fancyapps/ui/dist/fancybox/fancybox.css",
  ];

  return src(modules).pipe(dest("app/build/css/pages"));
}

const build = series(parallel(styles, vendorJS, vendorCSS, html));
const dev = series(
  parallel(styles, html, browserSyncF, watching, vendorJS, vendorCSS)
);

exports.default = dev;
exports.build = build;
