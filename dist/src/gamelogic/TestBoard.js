"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
// TODO make type file
// unique ship identifier
let identifier = ["2a", "2b", "3a", "3b", "4", "5"];
// other identifiers:
// "O" = MISS; "." = NOTHING; "X" = HIT
class Board {
    constructor(boardSize, nrShips, boardOwner) {
        this.ships = new Map;
        this.allShipsSunk = false;
        this.playfield = [];
        this.countSunk = 0;
        this.boardSize = boardSize;
        this.nrShips = nrShips;
        this.boardOwner = boardOwner;
    }
    /* checkHit(shotPosition: Position){
        const elementAt = this.playfield[shotPosition.x][shotPosition.y];
        identifier.forEach((id)=>{
            if(elementAt == id) {
                const ship = this.ships.get(id);
                if(!ship) throw new Error("Whoops, no ship found!")
                ship.setHit(shotPosition);
                this.playfield[shotPosition.x][shotPosition.y] = "X";
                if(ship.imSunk) {
                    this.countSunk++;
                    // TODO implement this
                    signalSinking(); // params: ship
                }
                if(this.countSunk == this.nrShips) {
                    this.allShipsSunk = true;
                    // TODO implement this
                    signalGameEnd();
                }
                return null;
            }
            this.playfield[shotPosition.x][shotPosition.y] = "O";
        })
    } */
    // below checkHit seems to be better, we get X's and O's on the playfield
    checkHit(shotPosition) {
        // maybe check the field for a "." beforehand
        const elementAt = this.playfield[shotPosition.x][shotPosition.y];
        if (this.ships.has(elementAt)) {
            const ship = this.ships.get(elementAt);
            ship.setHit(shotPosition);
            this.playfield[shotPosition.x][shotPosition.y] = "X";
            return true;
        }
        else {
            this.playfield[shotPosition.x][shotPosition.y] = "O";
            return false;
        }
    }
    fillEmptyField() {
        for (let row = 0; row < this.boardSize; row++) {
            this.playfield[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                this.playfield[row][col] = ".";
            }
        }
    }
    setShipPositions() {
        this.ships.forEach((ship) => {
            ship.initialPositions.forEach((position) => {
                this.playfield[position.x][position.y] = ship.identifier;
            });
        });
    }
    addShips(ships) {
        for (const ship of ships) {
            this.ships.set(ship.identifier, ship);
        }
    }
}
exports.Board = Board;
function signalSinking() {
    // throw new Error("Function not implemented.");
}
function signalGameEnd() {
    // throw new Error("Function not implemented.");
}
//# sourceMappingURL=TestBoard.js.map