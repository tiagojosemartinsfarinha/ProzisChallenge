export module Geral {

    export interface coordinates {
        xcord: number;
        ycord: number;
    }
    
    export interface Ball {
        xcord: number;
        ycord: number;
        ballRadius: number;
        dx: number;
        dy: number;
        colisitionvelocityfactor: number;
        colour?: string;
    }
}
