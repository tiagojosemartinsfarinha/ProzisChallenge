import { UtilsModule } from "./Utils";
import { BallModule } from "./Ball";
import { Geral } from "./TypeScriptModel/Geral";

export namespace ChallengeModule {

    export class Challenge {
        private static _instance = new Challenge();
        private _ball = new BallModule.BouceBall();
        private _formulas = new UtilsModule.Formulas();
        private _context: CanvasRenderingContext2D;
        private _canvas: HTMLCanvasElement;

        public static getIstance(): Challenge {
            return Challenge._instance;
        }
        constructor() {
            Challenge._instance = this;
        }

        /*Initialization*/
        public initialize() {
            this.createCanvas();
            this.createEvents();
            

        }
        /*set all events*/
        private createEvents() {

            this._canvas.addEventListener('click', (event) => {
                let corrds = this.getClickCoordinates(event);
                this._ball.createNewBall(this._canvas, this._context, this._ball.createBallOptions(corrds.xcord, corrds.ycord));
            }, false);
        }
        /*get */
        private getClickCoordinates(event: MouseEvent): Geral.coordinates {
            const rect = Challenge.getIstance()._canvas.getBoundingClientRect();
            return {
                xcord: event.clientX - rect.left,
                ycord: event.clientY - rect.top,
            }
        }

        private createCanvas() {
            this._canvas = <HTMLCanvasElement>document.getElementById("maincanvas");
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            this._context = this._canvas.getContext('2d');
            this._context.beginPath();
            this._context.fillStyle = "#0000ff";
            
        }
    }
}

export const Challenge = ChallengeModule.Challenge.getIstance();