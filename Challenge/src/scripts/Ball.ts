import { UtilsModule } from "Utils";

import { Geral } from "./TypeScriptModel/Geral";

export namespace BallModule {

    export class BouceBall {
        private static _instance = new BouceBall();
        private _formulas = new UtilsModule.Formulas();
        private _setinterval: number; // used to control setinterval and don´t have simultanious setinterval functions at the same time
        private _balls: Array<Geral.Ball> =[];
        public time = 10; //Time its relative. :) This is our time unit 
        public static getIstance(): BouceBall {
            return BouceBall._instance;
        }
        constructor() {
            BouceBall._instance = this;
        }

        public createBallOptions(xcord: number, ycord: number): Geral.Ball {
            return {
                xcord: xcord,
                ycord: ycord,
                ballRadius: this._formulas.createBallRadius(),
                dx: this._formulas.createBallVelocity(),
                dy: this._formulas.createBallVelocity(),
                colour: this._formulas.createBallColour(),
                colisitionvelocityfactor: this._formulas.colisitionvelocityfactor,
            };
        }

        public createNewBall(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, balloption: Geral.Ball) {
            if (this.verifyNewBall(canvas, context, balloption)){
            this._balls.push(balloption);
            if (!this._setinterval)
                    this._setinterval = setInterval(this.renderAllBalls.bind(null, canvas, context, this.time), 10);
            }
        }

        private drawBall(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, balloption: Geral.Ball) {
            context.beginPath();
            context.arc(balloption.xcord, balloption.ycord, balloption.ballRadius, 0, Math.PI * 2);
            context.fillStyle = balloption.colour;
            context.fill();
            context.closePath();
        }

        /*check conditions of new ball*/
        private verifyNewBall(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, balloption: Geral.Ball): boolean {
            if (balloption.xcord + balloption.dx > canvas.width - balloption.ballRadius || balloption.xcord + balloption.dx < balloption.ballRadius) {
                return false;
            }
            if (balloption.ycord + balloption.dy > canvas.height - balloption.ballRadius || balloption.ycord + balloption.dy < balloption.ballRadius) {
                return false;
            }
            return true;
        }

        private renderAllBalls(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, time: number) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            BouceBall.getIstance().time += time;
            BouceBall.getIstance()._balls.forEach((ball) => {
                BouceBall.getIstance().renderBall(canvas, context, ball, time);
            });
            
        }

        private renderBall(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, balloption: Geral.Ball, time: number) {
            BouceBall.getIstance().drawBall(canvas, context, balloption);

            if (balloption.xcord + balloption.dx > canvas.width - balloption.ballRadius || balloption.xcord + balloption.dx < balloption.ballRadius) {
                balloption.dx = -balloption.dx;
                balloption.dx = balloption.dx * (1 - balloption.colisitionvelocityfactor);
            }
            if (balloption.ycord + balloption.dy > canvas.height - balloption.ballRadius || balloption.ycord + balloption.dy < balloption.ballRadius) {
                balloption.dy = -balloption.dy;
                balloption.dy = balloption.dy * (1 - balloption.colisitionvelocityfactor);
            }

            balloption.xcord += balloption.dx;
            balloption.ycord += balloption.dy;
            //balloption.xcord = BouceBall.getIstance()._formulas.calculateXCord(balloption.xcord, balloption.xcord);
            //balloption.ycord = BouceBall.getIstance()._formulas.calculateYCord(balloption.xcord, balloption.xcord);
            balloption.dx = BouceBall.getIstance()._formulas.calculateDx(balloption.dx); //time
            balloption.dy = BouceBall.getIstance()._formulas.calculateDy(balloption.dy); //time
            
        }
    }
}

//export const BouceBall = BallModule.BouceBall.getIstance();
