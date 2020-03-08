define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UtilsModule;
    (function (UtilsModule) {
        var Formulas = /** @class */ (function () {
            function Formulas() {
                /*Set environment variables*/
                this._gravityacelearation = 10;
                this._minradius = 50;
                this._maxradius = 100;
                this._minvelocity = -10; // for test, we bound min/max velocity
                this._maxvelocity = 10; // for test, we bound min/max velocity
                this.colisitionvelocityfactor = 0.1; //when hit a wall, the velocity its multiplied by this factor
                Formulas._instance = this;
            }
            Formulas.getIstance = function () {
                return Formulas._instance;
            };
            Formulas.prototype.getGravityAcelaration = function () {
                return this._gravityacelearation;
            };
            /*return hexadecimal color*/
            Formulas.prototype.createBallColour = function () {
                return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
            };
            /*return ball radius between two*/
            Formulas.prototype.createBallRadius = function () {
                return this.getRandomNumber(this._minradius, this._maxradius);
            };
            /*return random velocity */
            Formulas.prototype.createBallVelocity = function () {
                return this.getRandomNumber(this._minvelocity, this._maxvelocity);
            };
            Formulas.prototype.getRandomNumber = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            Formulas.prototype.calculateXCord = function (xinitial, dx) {
                return xinitial + dx;
            };
            Formulas.prototype.calculateYCord = function (yinitial, dy) {
                return yinitial + dy - 0.5 * this._gravityacelearation;
            };
            Formulas.prototype.calculateDx = function (dx) {
                return dx;
            };
            Formulas.prototype.calculateDy = function (dy) {
                return -dy;
            };
            Formulas._instance = new Formulas();
            return Formulas;
        }());
        UtilsModule.Formulas = Formulas;
    })(UtilsModule = exports.UtilsModule || (exports.UtilsModule = {}));
});
//export const Formulas = UtilsModule.Formulas.getIstance();
