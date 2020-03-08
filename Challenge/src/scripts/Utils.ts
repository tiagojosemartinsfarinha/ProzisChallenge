export namespace UtilsModule {

    export class Formulas {
        private static _instance = new Formulas();

        /*Set environment variables*/
        private _gravityacelearation = 10;
        private _minradius = 50;
        private _maxradius = 100;
        private _minvelocity = -10; // for test, we bound min/max velocity
        private _maxvelocity = 10;  // for test, we bound min/max velocity

        public colisitionvelocityfactor = 0.1; //when hit a wall, the velocity its multiplied by this factor

        public static getIstance(): Formulas {
            return Formulas._instance;
        }
        constructor() {
            Formulas._instance = this;
        }

        public getGravityAcelaration(): number {
            return this._gravityacelearation;
        }

        /*return hexadecimal color*/
        public createBallColour(): string {
            return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        }
        /*return ball radius between two*/
        public createBallRadius(): number {
            return this.getRandomNumber(this._minradius, this._maxradius);
        }
        /*return random velocity */
        public createBallVelocity(): number {
            return this.getRandomNumber(this._minvelocity, this._maxvelocity);
        }

        private getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        public calculateXCord(xinitial: number, dx: number, time: number) {
            return xinitial + dx * time;
        }

        public calculateYCord(yinitial: number, dy: number) {
            return yinitial + dy - 0.5 * this._gravityacelearation;
        } 
        public calculateDx(dx: number) {
            return dx;
        }
        public calculateDy(dy: number) {
            return - dy;
        }
    }
}

//export const Formulas = UtilsModule.Formulas.getIstance();