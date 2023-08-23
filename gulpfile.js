const { src, dest, parallel, watch } = require('gulp')

const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const fileInclude = require('gulp-file-include')

const sourceFiles = 'build'


function styles() {
    return src('app/scss/style.scss')
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(concat('style.min.css'))
        .pipe(dest(sourceFiles + '/css'))
        .pipe(browserSync.stream())
}


function browserSyncF() {
    browserSync.init({
        server: {
            baseDir: 'build/',
        },
    })
}

function html() {
    return src('app/pages/*.html')
        .pipe(fileInclude())
        .pipe(dest(sourceFiles + '/'))
        .pipe(browserSync.stream())
}

function img() {
    return src(['app/img/**/*.{gif,jpg,png,svg}'])
      .pipe(dest(sourceFiles + '/img'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles)
    watch(['app/pages/*.html'], html, browserSync.reload)
    watch(['app/components/**/*.html'], html, browserSync.reload)
}

function vendorJS() {
    const modules = [
        'node_modules/swiper/swiper-bundle.min.js',
        'node_modules/swiper/swiper-bundle.min.js.map',
    ]

    return src(modules)
        .pipe(dest('build/js'))
}

function vendorCSS() {
    const modules = [
        'node_modules/swiper/swiper-bundle.min.css',
    ]

    return src(modules)
        .pipe(dest('build/css/pages'))
}

exports.default = parallel(vendorJS, vendorCSS, styles, html, img, browserSyncF, watching)

