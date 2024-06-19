"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIPlayerController = void 0;
class AIPlayerController {
    constructor(playerBoard, aiBoard, firstPlayer) {
        // this.boards.push(board1);
        // this.boards.push(board2);
        this.playerBoard = playerBoard;
        this.aiBoard = aiBoard;
        this.firstPlayer = firstPlayer;
        this.readyToPlay = false;
        this.ai = "ai",
            this.player = "player";
    }
    // who is the first one to take action
    // how to manage whos turn it is
    //! when a ship has been hit
    setReady() {
        this.readyToPlay = true;
    }
    startGame() {
        let playerWhosTurnItIs = this.firstPlayer.toString();
        while (!this.playerBoard.allShipsSunk && !this.aiBoard.allShipsSunk) {
            if (playerWhosTurnItIs == this.ai) {
                // Get shot random coordinates
                let position = { x: 10, y: 20 };
                this.shoot(position, playerWhosTurnItIs);
            }
            // If shoot is a hit continue with same player else change playerWhosTurnItIs
        }
    }
    shoot(position, player) {
        if (player == this.ai) {
            let hit = this.playerBoard.playfield[position.x][position.y] == "X" ? true : false;
        }
    }
}
exports.AIPlayerController = AIPlayerController;
// DONE when ships are positioned
//# sourceMappingURL=Controller.js.map