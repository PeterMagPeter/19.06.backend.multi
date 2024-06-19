"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const logger_1 = require("../logger");
const Ship_1 = require("./Ship");
class GameController {
    constructor(playerBoards, io, roomId, intiPlayer) {
        this.playersChanged = false;
        this.playerBoards = playerBoards;
        this.io = io;
        this.roomId = roomId;
        // coin flip whos starts
        this.playerWhosTurnItIs = intiPlayer;
    }
    // shooter name and position
    shoot(username, pos) {
        // doTheShooting
        // returns the board that gets shot at
        const board = this.playerBoards.find((board) => {
            if (board.boardOwner != username)
                return board;
        });
        if (!board)
            throw new Error("Whooops, didn't find the board we are looking for! enemy from: " +
                username);
        let enemyBoardOwner = board.boardOwner;
        let hitResult = board.checkHit(pos, username);
        if (!hitResult)
            throw new Error("No hitResult in shoot");
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
        this.io.to(this.roomId, { broadcast: true }).emit("gameOver", body);
    }
    switchPlayers(hit, switchTo) {
        if (!hit) {
            this.playerWhosTurnItIs = switchTo;
        }
    }
    hitEvent(body) {
        this.io.to(this.roomId, { broadcast: true }).emit("hitEvent", body);
        this.switchPlayers(body.hit, body.switchTo);
    }
    shipDestroyed(body, switchTo) {
        this.io.to(this.roomId, { broadcast: true }).emit("shipDestroyed", body, switchTo);
        this.switchPlayers(true, switchTo);
    }
    startGame() {
        this.io.to(this.roomId, { broadcast: true }).emit("gameStart", this.playerWhosTurnItIs);
        logger_1.logger.debug(this.playerWhosTurnItIs);
        // this.switchPlayers(true, switchTo);
    }
    isMiniHit(obj) {
        return (typeof obj === "object" &&
            typeof obj.x === "number" &&
            typeof obj.y === "number" &&
            typeof obj.hit === "boolean");
    }
}
exports.GameController = GameController;
//# sourceMappingURL=GameController_Multiplayer.js.map