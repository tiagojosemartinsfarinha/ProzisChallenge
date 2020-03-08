define(["require", "exports", "./Utils"], function (require, exports, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BallModule;
    (function (BallModule) {
        var BouceBall = /** @class */ (function () {
            function BouceBall() {
                this._formulas = new Utils_1.UtilsModule.Formulas();
                this._balls = [];
                this.time = 10; //Time its relative. :) This is our time unit 
                BouceBall._instance = this;
            }
            BouceBall.getIstance = function () {
                return BouceBall._instance;
            };
            BouceBall.prototype.clearAllBalls = function (canvas, context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                this._balls = [];
                clearInterval(this._interval);
                this._interval = null;
            };
            BouceBall.prototype.createBallOptions = function (xcord, ycord, movementtype) {
                return {
                    xcord: xcord,
                    ycord: ycord,
                    ballRadius: this._formulas.createBallRadius(),
                    dx: this._formulas.createBallVelocity(),
                    dy: this._formulas.createBallVelocity(),
                    colour: this._formulas.createBallColour(),
                    colisitionvelocityfactor: this._formulas.colisitionvelocityfactor,
                    challengerules: movementtype
                };
            };
            /**
             * check if can be created a ball
             * method o call new ball -
             * @param canvas
             * @param context
             * @param balloption
             */
            BouceBall.prototype.createNewBall = function (canvas, context, balloption) {
                if (this.verifyNewBall(canvas, context, balloption)) {
                    this._balls.push(balloption);
                    if (!this._interval)
                        this._interval = setInterval(this.renderAllBalls.bind(null, canvas, context, this.time), 10);
                }
            };
            BouceBall.prototype.drawBall = function (canvas, context, balloption) {
                context.beginPath();
                context.arc(balloption.xcord, balloption.ycord, balloption.ballRadius, 0, Math.PI * 2);
                context.fillStyle = balloption.colour;
                context.fill();
                context.closePath();
            };
            /*check conditions of new ball*/
            BouceBall.prototype.verifyNewBall = function (canvas, context, balloption) {
                if (balloption.xcord + balloption.dx > canvas.width - balloption.ballRadius || balloption.xcord + balloption.dx < balloption.ballRadius) {
                    return false;
                }
                if (balloption.ycord + balloption.dy > canvas.height - balloption.ballRadius || balloption.ycord + balloption.dy < balloption.ballRadius) {
                    return false;
                }
                return true;
            };
            BouceBall.prototype.renderAllBalls = function (canvas, context, time) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                BouceBall.getIstance().time += time;
                BouceBall.getIstance()._balls.forEach(function (ball) {
                    BouceBall.getIstance().renderBall(canvas, context, ball, time);
                });
            };
            BouceBall.prototype.renderBall = function (canvas, context, balloption, time) {
                BouceBall.getIstance().drawBall(canvas, context, balloption);
                if (balloption.xcord + balloption.dx > canvas.width - balloption.ballRadius || balloption.xcord + balloption.dx < balloption.ballRadius) {
                    balloption.dx = -balloption.dx;
                    balloption.dx = balloption.dx * (1 - balloption.colisitionvelocityfactor);
                }
                if (balloption.ycord + balloption.dy > canvas.height - balloption.ballRadius || balloption.ycord + balloption.dy < balloption.ballRadius) {
                    balloption.dy = -balloption.dy;
                    balloption.dy = balloption.dy * (1 - balloption.colisitionvelocityfactor);
                }
                if (balloption.challengerules) {
                    balloption.xcord = BouceBall.getIstance()._formulas.calculateXCord(balloption.xcord, balloption.xcord);
                    balloption.ycord = BouceBall.getIstance()._formulas.calculateYCord(balloption.xcord, balloption.xcord);
                    balloption.dx = BouceBall.getIstance()._formulas.calculateDx(balloption.dx);
                    balloption.dy = BouceBall.getIstance()._formulas.calculateDy(balloption.dy);
                }
                else {
                    balloption.xcord += balloption.dx;
                    balloption.ycord += balloption.dy;
                }
            };
            BouceBall._instance = new BouceBall();
            return BouceBall;
        }());
        BallModule.BouceBall = BouceBall;
    })(BallModule = exports.BallModule || (exports.BallModule = {}));
});
//export const BouceBall = BallModule.BouceBall.getIstance();
