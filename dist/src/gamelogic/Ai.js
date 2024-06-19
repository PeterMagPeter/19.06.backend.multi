"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ai = void 0;
class Ai {
    constructor(playerBoard, aiBoard) {
        this.ships = new Map();
        this.playerShipPositions = [];
        this.playerBoard = playerBoard;
        this.aiBoard = aiBoard;
        this.identifier = ["2a", "2b", "3a", "3b", "4", "5"];
    }
}
exports.Ai = Ai;
//# sourceMappingURL=Ai.js.map