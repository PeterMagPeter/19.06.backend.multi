"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiGameController = void 0;
const logger_1 = require("../logger");
const Ai_Playtest_1 = require("./Ai_Playtest");
const Ship_1 = require("./Ship");
class AiGameController {
    // constructor(...args: any[]) {
    //     if (args.length === 1) {
    //         this.socket = args[0]; // Initialisiert socket mit dem übergebenen Wert
    //     } else if (args.length === 4) {
    //         this.playerBoard = args[0];
    //         this.aiBoard = args[1];
    //         this.ai = new Ai_Playtest(this.playerBoard, "god");
    //         this.socket = args[2]; // Initialisiert socket mit dem übergebenen Wert
    //         this.gameInit();
    //     }
    //     // Weitere Logiken für andere Konstruktoraufrufe...
    // }
    constructor(playerBoard, 
    // aiBoard: Board,
    socket, playerWhosTurnItIs, difficulty, roomId) {
        this.playersChanged = false;
        this.difficulty = 0.5;
        this.playerBoard = playerBoard;
        this.ai = new Ai_Playtest_1.Ai_Playtest(this.playerBoard, "god", roomId);
        this.aiBoard = this.ai.aiBoard;
        this.socket = socket;
        this.playerWhosTurnItIs = playerWhosTurnItIs;
        this.difficulty = difficulty;
    }
    shoot(username, pos) {
        // doTheShooting
        const board = this.playerBoard.boardOwner === username
            ? this.aiBoard
            : this.playerBoard;
        let enemyBoardOwner = this.playerBoard.boardOwner === username
            ? this.aiBoard.boardOwner
            : this.playerBoard.boardOwner;
        if (!board)
            throw new Error("Whooops, didn't find the board we are looking for! " +
                this.playerWhosTurnItIs);
        let hitResult;
        if (username === this.playerBoard.boardOwner && pos)
            hitResult = this.aiBoard.checkHit(pos, username);
        else {
            hitResult =
                this.difficulty === -1
                    ? this.ai.aiTest()
                    : this.ai.aiGod(this.difficulty);
        }
        // else hitResult = this.ai.aiTest();
        if (!hitResult)
            throw new Error("No hitResult");
        if (this.isMiniHit(hitResult)) {
            // hit or miss
            if (hitResult.hit === true) {
                return this.hitEvent({
                    x: hitResult.x,
                    y: hitResult.y,
                    username: username,
                    hit: hitResult.hit,
                    switchTo: username,
                });
            }
            else {
                return this.hitEvent({
                    x: hitResult.x,
                    y: hitResult.y,
                    username: username,
                    hit: hitResult.hit,
                    switchTo: enemyBoardOwner,
                });
            }
        }
        else if (hitResult instanceof Ship_1.Ship) {
            // ship destroyed
            // logger.debug(" in hitResult Ship" + JSON.stringify(hitResult));
            let ship = {
                identifier: hitResult.identifier,
                direction: hitResult.isHorizontal ? "X" : "Y",
                startX: hitResult.initialPositions[0].x,
                startY: hitResult.initialPositions[0].y,
                length: hitResult.length,
                hit: true,
            };
            return this.shipDestroyed(ship, username);
        }
        else if (typeof hitResult === "string") {
            // win or lose
            logger_1.logger.debug(" in hitResult string" + JSON.stringify(hitResult));
            return this.gameOver({ username: hitResult });
        }
        else {
        }
    }
    getCurrentPlayer() {
        return this.playerWhosTurnItIs;
    }
    //   sendet gewinner
    gameOver(body) {
        logger_1.logger.error("Game over for: " + body.username);
        this.socket.emit("gameOver", body);
    }
    switchPlayers(hit, enemyBoardOwner) {
        if (!hit) {
            this.playerWhosTurnItIs = enemyBoardOwner;
            this.playersChanged = true;
        }
        if (this.playerWhosTurnItIs === this.aiBoard.boardOwner) {
            logger_1.logger.info("AI's turn!-----------" + this.playerWhosTurnItIs);
            setTimeout(() => {
                this.shoot(enemyBoardOwner);
            }, this.playersChanged ? 3000 : 1500);
            this.playersChanged = false;
        }
    }
    hitEvent(body) {
        logger_1.logger.debug(JSON.stringify(body) + " hitevent body");
        this.socket.emit("hitEvent", body);
        this.switchPlayers(body.hit, body.switchTo);
    }
    shipDestroyed(body, switchTo) {
        logger_1.logger.info("send shipDestroyed" + JSON.stringify(body));
        this.socket.emit("shipDestroyed", body, switchTo);
        this.switchPlayers(true, switchTo);
    }
    isMiniHit(obj) {
        return (typeof obj === "object" &&
            typeof obj.x === "number" &&
            typeof obj.y === "number" &&
            typeof obj.hit === "boolean");
    }
}
exports.AiGameController = AiGameController;
//# sourceMappingURL=GameController_Playtest.js.map