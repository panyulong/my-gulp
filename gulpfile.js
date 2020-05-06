var gulp = require('gulp')
var connect = require('gulp-connect') //实时更新
var open = require('open') //运行自动打开自定义网页
var concat = require('gulp-concat') //合并
var htmlmin = require('gulp-htmlmin') //html压缩
var uglify = require('gulp-uglify') //js压缩
var less = require('gulp-less') // less压缩
var minifyCss = require('gulp-minify-css') //css压缩 
var imagemin = require('gulp-imagemin') //img压缩
var rename = require('gulp-rename') //对打包名称重命名
var htmlreplace = require('gulp-html-replace'); //对html引入css、js 路径打包后重设
var watch = require('gulp-watch'); //监听文件变化
var babel = require('gulp-babel');//js es6支持转化

//压缩 主页 html文件
gulp.task('html', function () {
    return gulp.src('./src/*.html')
    .pipe(htmlreplace({
        'css': 'assets/css/build.min.css', 
        'js': 'assets/js/build.min.js'
    }))    
    .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS:true,
            removeComments: true,
            removeSciptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe(gulp.dest('./dist/'))
})

//压缩子页面的html
gulp.task('pages', function () {
    return gulp.src('./src/pages/*.html')
    .pipe(htmlreplace({
        'css': 'assets/css/build.min.css', 
        'js': 'assets/js/build.min.js'
    })) 
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS:true,
            removeComments: true,
            removeSciptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        }))
        .pipe(gulp.dest('./dist/pages/'))
})

//压缩js文件
gulp.task('js', function () {
    return gulp.src('./src/assets/js/*.js')
        .pipe(concat('build.js')) //合并到临时文件
        .pipe(rename({
            // dirname: "index",    // 路径名
            basename: "build",   // 主文件名
            // prefix: "cs-",        // 前缀
            suffix: ".min",      // 后缀
            extname: ".js"       // 扩展名
        }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/js/'))
})
//压缩css文件
gulp.task('css',  function () {
    return gulp.src('./src/assets/css/**')
        // .pipe(concat('build.css'))//合并到临时文件
        .pipe(less())
        .pipe(concat('build.css'))
        .pipe(rename({
            // dirname: "index",    // 路径名
            basename: "build",   // 主文件名
            // prefix: "cs-",        // 前缀
            suffix: ".min",      // 后缀
            extname: ".css"       // 扩展名
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/assets/css/'))
})

//压缩图片
gulp.task('img', function () {
    return gulp.src('./src/assets/images/*.*')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('./dist/assets/images/'))
})

gulp.task("reload", function(){
	gulp.src("./dist/**/*.html")
		.pipe(connect.reload());
})
gulp.task('watch',function (done) {
    watch('./src/*.html',gulp.series('html','reload'))
    watch('./src/pages/*.html',gulp.series('pages','reload'))
    watch('./src/assets/js/*.js',gulp.series('js','reload'))
    watch('./src/assets/css/**',gulp.series('css','reload'))
    watch('./src/assets/images/*.*',gulp.series('img'))
    done();
})

//注册一个默认的任务
gulp.task('server',gulp.parallel('html', 'pages', 'css', 'js', 'img','watch','reload',function(){
    connect.server({
        root:'./dist',//打开的目标 文件夹
        livereload: true,//实时刷新
        port: 3000
    })
    open('http://localhost:3000/index.html')
}))