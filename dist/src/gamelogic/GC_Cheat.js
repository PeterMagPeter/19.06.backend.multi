"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GC_Cheat = void 0;
class GC_Cheat {
    constructor(playerBoard, aiBoard, identifier, startingPlayer, difficulty) {
        this.playerShipPositions = [];
        this.focusedShipCoords = [];
        this.emtpyPositions = [];
        this.startingPlayer = "";
        this.playerBoard = playerBoard;
        this.aiBoard = aiBoard;
        difficulty ? this.difficulty = difficulty : this.difficulty = undefined;
        this.identifier = identifier;
        this.ships = new Map();
        // AI-Feature: Add all ship positions into ships map
        playerBoard.ships.forEach(ship => {
            this.ships.set(ship.identifier, ship);
            ship.initialPositions.forEach(shipPosition => {
                this.playerShipPositions.push(shipPosition);
            });
        });
        this.startingPlayer = startingPlayer;
        // TODO Initialize AI 
        this.ShipPositionsFillUp(this.playerShipPositions);
        if (this.startingPlayer == "Ai") {
            if (difficulty == "god") {
                this.aiGod(0.9);
            }
            else if (difficulty == "Moderate") {
                this.aiGod(0.6);
            }
            else {
                this.aiGod(0.3);
            }
        }
    }
    // Choose how to fill playerShipPositions array
    ShipPositionsFillUp(arr) {
        this.emtpyPositions = this.getAllEmtpyFields(arr);
    }
}
exports.GC_Cheat = GC_Cheat;
//# sourceMappingURL=GC_Cheat.js.map