import * as ts 		from "gulp-typescript";
import * as gulp 	from "gulp";
import * as util 	from "gulp-util";
import * as less 	from "gulp-less";
import * as rename 	from "gulp-rename";
import * as chmod 	from "gulp-chmod";
import * as gulpWebpack from "webpack-stream";
import * as webpack from "webpack";
import * as path from "path";

declare var process: any;
declare var require: any;
declare var Buffer: any;
declare var __dirname: string;

interface ICompileOptions {
    less: ILessOptions;
}

interface ILessOptions {
    include: string[];
}

var shellBasePath: string = process.env.ATD_DEV + "\\Glintths.Shell";
var shellBasePathDotnet: string = path.parse(__dirname).root + "\\DOTNET\\Modules\\Html\\Glintths.Shell\\Glintths.Shell";
var paths = {
    dll: shellBasePath + "\\bin\\plugins",
    script: shellBasePath + "\\Scripts",
    css: shellBasePath + "\\Content\\themes",
    resx: shellBasePath + "\\Scripts\\Localization",
    cshtml: shellBasePath + "\\Views",
    reactScripts: shellBasePath + "\\src"
}

export class GulpReact {

    public Copy: Copy;
    public Compile: Compile;
    public Build: Build;

    constructor(private projectDir: string, private projectName: string, compileOptions?: ICompileOptions) {

        try {
            var config = require("./pathReactConfig.json");
            Utils.updateShellBasePath(config.shellBasePath);
            //console.log(config.shellBasePath);
            //console.log("PATH CONFIG");
        } catch (err) {
            //console.log("DEFAULT CONFIGS");
        }

        this.Copy = new Copy(projectDir, projectName);
        this.Compile = new Compile(projectDir, projectName, compileOptions);
        this.Build = new Build();
    }

    public build = () => {
        this.Copy.dll();
        this.Copy.resource();
        this.Copy.cshtml();

        //this.Compile.less();	
        this.Compile.webpack();
    }


}

export class Gulp {

    public Copy: Copy;
    public Compile: Compile;
    public Build: Build;

    constructor(private projectDir: string, private projectName: string, compileOptions?: ICompileOptions) {

        try {
            var config = require("./pathConfig.json");
            Utils.updateShellBasePath(config.shellBasePath);
            //console.log(config.shellBasePath);
            //console.log("PATH CONFIG");
        } catch (err) {
            //console.log("DEFAULT CONFIGS");
        }

        this.Copy = new Copy(projectDir, projectName);
        this.Compile = new Compile(projectDir, projectName, compileOptions);
        this.Build = new Build();
    }

    public build = () => {
        this.Copy.dll();
        this.Copy.resource();

        this.Compile.less();
        this.Compile.typescript();
    }

}

class Copy {

    static languages: any = [
        "pt-PT",
        "pt-BR",
        "en-US",
        "pt-AO"
    ];

    constructor(private projectDir: string, private projectName: string) { }

    dll(list: Array<string> = []) {
        list.push(this.projectDir + "\\bin\\*" + this.projectName + "*.dll");
        return gulp.src(list)
            .pipe(chmod(666))
            .pipe(gulp.dest(paths.dll + "\\" + this.projectName));
    }

    resource() {
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
    }

    cshtml() {
        var views = this.projectDir + "\\Views\\" + this.projectName + "\\*.cshtml";
        return gulp.src(views)
            .pipe(chmod(666))
            .pipe(gulp.dest(paths.cshtml + "\\" + this.projectName));
    }

    copyTempShellToDotnet() {
        return gulp.src(shellBasePath + "\\**\\*.*")
            .pipe(chmod(666))
            .pipe(gulp.dest(shellBasePathDotnet));
    }
}

class Compile {

    private tsProject: any;

    constructor(private projectDir: string, private projectName: string = "", private compileOptions?: ICompileOptions) {
        this.tsProject = ts.createProject(projectDir + "\\tsconfig.json");
    }

    typescript() {
        return gulp.src([this.projectDir + "\\Scripts\\**\\*.ts", "!" + this.projectDir + "\\Scripts\\TypeScriptModel\\*.ts"])
            .pipe(this.tsProject())
            .on('error', function (err) {
                console.log(err.name + "\n" + err.message + " \n");
                process.exit(1)
            })
            .pipe(chmod(666))
            .pipe(gulp.dest(paths.script));
    }

    webpack() {
        console.log("updated");
        return gulp.src(this.projectDir + "\\src\\index.tsx")
            .pipe(gulpWebpack(require(this.projectDir + '\\webpack.config.js'), webpack))
            .pipe(gulp.dest(paths.reactScripts + '\\' + this.projectName));
    }

    less() {
        return gulp.src(this.projectDir + "\\Content\\**\\*.less")
            .pipe(less())
            //.pipe(rename(this.projectName + ".css"))
            .pipe(chmod(666))
            .pipe(gulp.dest(paths.css));
    }

    lessBase() {
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

    }
}

class Build {

    constructor() { }

    default() {

    }

}

export class Utils {
    static newFile(name, contents) {
        //uses the node stream object
        var readableStream = require('stream').Readable({ objectMode: true });
        //reads in our contents string
        readableStream._read = function () {
            this.push(new util.File({ cwd: "", base: "", path: name, contents: Buffer.from(contents) }));
            this.push(null);
        };
        return readableStream;
    }

    static updateShellBasePath(newShellBasePath: string) {
        shellBasePath = newShellBasePath;
        paths = {
            dll: shellBasePath + "\\bin\\plugins",
            script: shellBasePath + "\\Scripts",
            css: shellBasePath + "\\Content\\themes",
            resx: shellBasePath + "\\Scripts\\Localization",
            cshtml: shellBasePath + "\\Views",
            reactScripts: shellBasePath + "\\src"
        }
    }
}