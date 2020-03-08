(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "gulp-typescript", "gulp", "gulp-util", "gulp-less", "gulp-chmod", "webpack-stream", "webpack", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ts = require("gulp-typescript");
    var gulp = require("gulp");
    var util = require("gulp-util");
    var less = require("gulp-less");
    var chmod = require("gulp-chmod");
    var gulpWebpack = require("webpack-stream");
    var webpack = require("webpack");
    var path = require("path");
    var shellBasePath = process.env.ATD_DEV + "\\Glintths.Shell";
    var shellBasePathDotnet = path.parse(__dirname).root + "\\DOTNET\\Modules\\Html\\Glintths.Shell\\Glintths.Shell";
    var paths = {
        dll: shellBasePath + "\\bin\\plugins",
        script: shellBasePath + "\\Scripts",
        css: shellBasePath + "\\Content\\themes",
        resx: shellBasePath + "\\Scripts\\Localization",
        cshtml: shellBasePath + "\\Views",
        reactScripts: shellBasePath + "\\src"
    };
    var GulpReact = /** @class */ (function () {
        function GulpReact(projectDir, projectName, compileOptions) {
            var _this = this;
            this.projectDir = projectDir;
            this.projectName = projectName;
            this.build = function () {
                _this.Copy.dll();
                _this.Copy.resource();
                _this.Copy.cshtml();
                //this.Compile.less();	
                _this.Compile.webpack();
            };
            try {
                var config = require("./pathReactConfig.json");
                Utils.updateShellBasePath(config.shellBasePath);
                //console.log(config.shellBasePath);
                //console.log("PATH CONFIG");
            }
            catch (err) {
                //console.log("DEFAULT CONFIGS");
            }
            this.Copy = new Copy(projectDir, projectName);
            this.Compile = new Compile(projectDir, projectName, compileOptions);
            this.Build = new Build();
        }
        return GulpReact;
    }());
    exports.GulpReact = GulpReact;
    var Gulp = /** @class */ (function () {
        function Gulp(projectDir, projectName, compileOptions) {
            var _this = this;
            this.projectDir = projectDir;
            this.projectName = projectName;
            this.build = function () {
                _this.Copy.dll();
                _this.Copy.resource();
                _this.Compile.less();
                _this.Compile.typescript();
            };
            try {
                var config = require("./pathConfig.json");
                Utils.updateShellBasePath(config.shellBasePath);
                //console.log(config.shellBasePath);
                //console.log("PATH CONFIG");
            }
            catch (err) {
                //console.log("DEFAULT CONFIGS");
            }
            this.Copy = new Copy(projectDir, projectName);
            this.Compile = new Compile(projectDir, projectName, compileOptions);
            this.Build = new Build();
        }
        return Gulp;
    }());
    exports.Gulp = Gulp;
    var Copy = /** @class */ (function () {
        function Copy(projectDir, projectName) {
            this.projectDir = projectDir;
            this.projectName = projectName;
        }
        Copy.prototype.dll = function (list) {
            if (list === void 0) { list = []; }
            list.push(this.projectDir + "\\bin\\*" + this.projectName + "*.dll");
            return gulp.src(list)
                .pipe(chmod(666))
                .pipe(gulp.dest(paths.dll + "\\" + this.projectName));
        };
        Copy.prototype.resource = function () {
            var resbase = require(this.projectDir + "\\Scripts\\Localization\\resources.json");
            var newSettings = [];
            for (var prop in resbase) {
                for (var j = 0; j < Copy.languages.length; j++) {
                    var resx = resbase[prop];
                    var lang = Copy.languages[j];
                    if (newSettings[lang] === undefined)
                        newSettings[lang] = {};
                    newSettings[lang][prop] = resx[lang];
                }
            }
            for (var prop2 in newSettings) {
                Utils.newFile(prop2 + ".json", JSON.stringify(newSettings[prop2])).pipe(gulp.dest(paths.resx + "\\" + this.projectName));
            }
        };
        Copy.prototype.cshtml = function () {
            var views = this.projectDir + "\\Views\\" + this.projectName + "\\*.cshtml";
            return gulp.src(views)
                .pipe(chmod(666))
                .pipe(gulp.dest(paths.cshtml + "\\" + this.projectName));
        };
        Copy.prototype.copyTempShellToDotnet = function () {
            return gulp.src(shellBasePath + "\\**\\*.*")
                .pipe(chmod(666))
                .pipe(gulp.dest(shellBasePathDotnet));
        };
        Copy.languages = [
            "pt-PT",
            "pt-BR",
            "en-US",
            "pt-AO"
        ];
        return Copy;
    }());
    var Compile = /** @class */ (function () {
        function Compile(projectDir, projectName, compileOptions) {
            if (projectName === void 0) { projectName = ""; }
            this.projectDir = projectDir;
            this.projectName = projectName;
            this.compileOptions = compileOptions;
            this.tsProject = ts.createProject(projectDir + "\\tsconfig.json");
        }
        Compile.prototype.typescript = function () {
            return gulp.src([this.projectDir + "\\Scripts\\**\\*.ts", "!" + this.projectDir + "\\Scripts\\TypeScriptModel\\*.ts"])
                .pipe(this.tsProject())
                .on('error', function (err) {
                console.log(err.name + "\n" + err.message + " \n");
                process.exit(1);
            })
                .pipe(chmod(666))
                .pipe(gulp.dest(paths.script));
        };
        Compile.prototype.webpack = function () {
            console.log("updated");
            return gulp.src(this.projectDir + "\\src\\index.tsx")
                .pipe(gulpWebpack(require(this.projectDir + '\\webpack.config.js'), webpack))
                .pipe(gulp.dest(paths.reactScripts + '\\' + this.projectName));
        };
        Compile.prototype.less = function () {
            return gulp.src(this.projectDir + "\\Content\\**\\*.less")
                .pipe(less())
                //.pipe(rename(this.projectName + ".css"))
                .pipe(chmod(666))
                .pipe(gulp.dest(paths.css));
        };
        Compile.prototype.lessBase = function () {
            if (this.compileOptions && this.compileOptions.less && this.compileOptions.less.include) {
                var array = this.compileOptions.less.include;
                var path = [];
                for (var i = 0; i < array.length; i++) {
                    var element = array[i];
                    path.push(this.projectDir + "\\Content\\" + element);
                }
                return gulp.src(path)
                    .pipe(less())
                    //.pipe(rename(this.projectName + ".css"))
                    .pipe(chmod(666))
                    .pipe(gulp.dest(paths.css + "\\base"));
            }
        };
        return Compile;
    }());
    var Build = /** @class */ (function () {
        function Build() {
        }
        Build.prototype.default = function () {
        };
        return Build;
    }());
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.newFile = function (name, contents) {
            //uses the node stream object
            var readableStream = require('stream').Readable({ objectMode: true });
            //reads in our contents string
            readableStream._read = function () {
                this.push(new util.File({ cwd: "", base: "", path: name, contents: Buffer.from(contents) }));
                this.push(null);
            };
            return readableStream;
        };
        Utils.updateShellBasePath = function (newShellBasePath) {
            shellBasePath = newShellBasePath;
            paths = {
                dll: shellBasePath + "\\bin\\plugins",
                script: shellBasePath + "\\Scripts",
                css: shellBasePath + "\\Content\\themes",
                resx: shellBasePath + "\\Scripts\\Localization",
                cshtml: shellBasePath + "\\Views",
                reactScripts: shellBasePath + "\\src"
            };
        };
        return Utils;
    }());
    exports.Utils = Utils;
});
