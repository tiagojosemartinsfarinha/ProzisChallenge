define(["require", "exports", "./Utils", "./Ball"], function (require, exports, Utils_1, Ball_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChallengeModule;
    (function (ChallengeModule) {
        var Challenge = /** @class */ (function () {
            function Challenge() {
                this._ball = new Ball_1.BallModule.BouceBall();
                this._formulas = new Utils_1.UtilsModule.Formulas();
                Challenge._instance = this;
            }
            Challenge.getIstance = function () {
                return Challenge._instance;
            };
            /*Initialization*/
            Challenge.prototype.initialize = function () {
                this.createCanvas();
                this.createEvents();
            };
            /*set all events*/
            Challenge.prototype.createEvents = function () {
                var _this = this;
                this._canvas.addEventListener('click', function (event) {
                    var corrds = _this.getClickCoordinates(event);
                    _this._ball.createNewBall(_this._canvas, _this._context, _this._ball.createBallOptions(corrds.xcord, corrds.ycord, _this._movementtype));
                }, false);
                window.addEventListener("keydown", this.toglemovementtype, false);
            };
            /*get */
            Challenge.prototype.getClickCoordinates = function (event) {
                var rect = Challenge.getIstance()._canvas.getBoundingClientRect();
                return {
                    xcord: event.clientX - rect.left,
                    ycord: event.clientY - rect.top,
                };
            };
            Challenge.prototype.toglemovementtype = function (keydown) {
                var instance = Challenge.getIstance();
                if (keydown.keyCode === 80) {
                    instance._movementtype = !instance._movementtype;
                    window.alert("Movement Type changed.");
                }
                else if (keydown.keyCode === 46) {
                    instance._ball.clearAllBalls(instance._canvas, instance._context);
                    window.alert("All ball are deleted.");
                }
            };
            Challenge.prototype.createCanvas = function () {
                this._canvas = document.getElementById("maincanvas");
                this._canvas.width = window.innerWidth;
                this._canvas.height = window.innerHeight;
                this._context = this._canvas.getContext('2d');
                this._context.beginPath();
                this._context.fillStyle = "#0000ff";
            };
            Challenge._instance = new Challenge();
            return Challenge;
        }());
        ChallengeModule.Challenge = Challenge;
    })(ChallengeModule = exports.ChallengeModule || (exports.ChallengeModule = {}));
    exports.Challenge = ChallengeModule.Challenge.getIstance();
});
