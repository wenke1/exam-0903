//引入模块
var gulp = require("gulp");
var sass = require("gulp-sass");
var css = require("gulp-clean-css");
var uglify = require("gulp-uglify");
var server = require("gulp-webserver");
var data = require("./json/data.json");

//压缩css
gulp.task("sass", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(css())
        .pipe(gulp.dest("./src/css"));
});

//压缩js
gulp.task("minJs", function() {
    return gulp.src("./src/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./src/common"));
});

//监听
gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("sass"))
});

//启动服务  
gulp.task("server", function() {
    return gulp.src("src")
        .pipe(server({
            port: 9090,
            middleware: function(req, res) {
                if (req.url === "/favicon.ico") { return res.end("") };
                var pathname = require("url").parse(req.url).pathname;
                pathname = pathname === "/" ? "index.html" : pathname
                if (pathname === "/api/soso") {

                    var query = require("url").parse(req.url, true).query.content;
                    if (query === "") {
                        return res.end(JSON.stringify({ code: 0, msg: "" }));
                    }
                    var arr = [];
                    data.forEach(function(item) {
                        if (item.msg.indexOf(query) > -1) {
                            arr.push(item.msg);
                        }
                    });
                    if (arr.length > 0) {
                        return res.end(JSON.stringify({ code: 1, msg: arr }));
                    } else {
                        return res.end(JSON.stringify({ code: 0, msg: "" }));
                    }
                } else {
                    res.end(require("fs").readFileSync(require("path").join(__dirname, "src", pathname)));
                }
            }
        }));
});

//执行代码
gulp.task("dev", gulp.series("sass", "minJs", "server", "watch"));