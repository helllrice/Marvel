const fileinclude = require('gulp-file-include');

let project_folder = "dist";
let source_folder = "src";

let path = {
    build: {
        html: project_folder + "/",
        css:  project_folder + "/css/",
        js:  project_folder + "/js/",
        img: project_folder + "/img/",
    },
    src: {
        html: source_folder + "/*.html",
        css:  source_folder + "/less/style.less",
        js:  source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css:  source_folder + "/less/**/*.less",
        js:  source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    includefile = require("gulp-file-include"),
    del = require("del"),
    less = require("gulp-less"),
    autoprefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify-es").default,
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    imagemin =require("gulp-imagemin");


    function browserSync(params) {
        browsersync.init({
            server: {
                baseDir: "./" + project_folder + "/"
            },
            port: 3000,
            notify:false
        })
    }

    function html() {
        return src(path.src.html)
            .pipe(includefile())
            .pipe(dest(path.build.html))
            .pipe(browsersync.stream())
    }

    function css() {
        return src(path.src.css)
            .pipe(
                less({
                    outputStyle: "expanded"
                })
            )
            .pipe(includefile())
            .pipe(dest(path.build.css))
            .pipe(browsersync.stream())
            .pipe(
                autoprefixer({
                    overrideBrowserslist: ["last 5 versions"],
                    cascade: true
                })
                )
                .pipe(clean_css())
                .pipe(rename({
                    extname: ".min.css"
                }))
                .pipe(dest(path.build.css))
    }

    function js() {
        return src(path.src.js)
            .pipe(includefile())
            .pipe(dest(path.build.js))
            .pipe(browsersync.stream())
            .pipe(uglify())
            .pipe(
                rename({
                    extname: ".min.js"
                })
            )
            .pipe(dest(path.build.js))
    }

    function images() {
        return src(path.src.img)
            .pipe(
                imagemin({
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false }],
                    interlased: true,
                    optimizationLevel: 3
                })
            )
            .pipe(dest(path.build.img))
            .pipe(browsersync.stream())
    }

    function clean(params) {
        return del(path.clean);
    }

    function watchFiles(params) {
        gulp.watch([path.watch.html], html);
        gulp.watch([path.watch.css], css);
        gulp.watch([path.watch.js], js);
        gulp.watch([path.watch.img], images);
    }

    let build = gulp.series(clean, gulp.parallel(js, css, html, images));
    let watch = gulp.parallel(build,browserSync,watchFiles);

    exports.watch = watch;
    exports.default = watch;
    exports.build = build;
    exports.html = html;
    exports.css = css;
    exports.js = js;
    exports.images = images;

