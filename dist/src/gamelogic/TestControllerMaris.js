"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPlayerController = void 0;
const logger_1 = require("../logger");
class TestPlayerController {
    constructor(
    /* playerBoard: Board, */ aiBoard, firstPlayer, socket) {
        this.boards = [];
        this.aiShipIndex = 0;
        this.aiLastShotWasRandomMiss = false;
        this.aiLastShotWasPlannedMiss = false;
        // this.playerBoard = playerBoard;
        // this.aiBoard = aiBoard;
        // this.boards.push(playerBoard);
        this.boards.push(aiBoard);
        this.firstPlayer = firstPlayer;
        this.readyToPlay = false;
        this.playerWhosTurnItIs = firstPlayer;
        this.socket = socket;
    }
    // who is the first one to take action
    addPlayerBoard(board) {
        this.boards.push(board);
    }
    // how to manage whos turn it is
    //! when a ship has been hit
    setReady() {
        this.readyToPlay = true;
    }
    aiShoot() {
        const board = this.boards.find((board) => board.boardOwner !== this.playerWhosTurnItIs);
        if (!board)
            throw new Error("Whooops, didn't find the board we are looking for! " +
                this.playerWhosTurnItIs);
        const ships = board.shipArray;
        const playfield = board.playfield;
        // 1. shoot at random missing position
        // 2. shoot at known hit position (choose a ship)
        // 3. shoot at adjacent missing position (if possible)
        // 4. shoot at the other ship positions (of chosen ship)
        // 5. repeat
        const currentShip = ships[this.aiShipIndex];
        if (this.aiLastShotWasRandomMiss) {
            // get a hit
            const firstPos = currentShip.initialPositions[0];
            this.shoot(firstPos);
            // find adjacent missing position
            let adjacentPos = null;
            if (firstPos.x + 1 < 10 && playfield[firstPos.x + 1][firstPos.y] == ".") {
                adjacentPos = { x: firstPos.x + 1, y: firstPos.y };
            }
            else if (firstPos.x - 1 >= 0 && playfield[firstPos.x - 1][firstPos.y] == ".") {
                adjacentPos = { x: firstPos.x - 1, y: firstPos.y };
            }
            else if (firstPos.y + 1 < 10 && playfield[firstPos.x][firstPos.y + 1] == ".") {
                adjacentPos = { x: firstPos.x, y: firstPos.y + 1 };
            }
            else if (firstPos.y - 1 >= 0 && playfield[firstPos.x][firstPos.y - 1] == ".") {
                adjacentPos = { x: firstPos.x, y: firstPos.y - 1 };
            }
            if (adjacentPos) {
                this.shoot(adjacentPos);
            }
            else {
                // shoot at the other ship positions
                for (let i = 1; i < currentShip.initialPositions.length && !currentShip.imSunk; i++) {
                    this.shoot(currentShip.initialPositions[i]);
                    this.aiShipIndex++;
                }
            }
        }
        else if (this.aiLastShotWasPlannedMiss) {
            for (let i = 1; i < currentShip.initialPositions.length && !currentShip.imSunk; i++) {
                this.shoot(currentShip.initialPositions[i]);
                this.aiShipIndex++;
            }
            this.aiLastShotWasPlannedMiss = false;
            this.aiLastShotWasRandomMiss = false;
        }
        else {
            // first action in round or first action after AI sunk a ship
            while (true) {
                const randomPos = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
                const elementAt = playfield[randomPos.x][randomPos.y];
                if (elementAt == ".") {
                    this.shoot(randomPos);
                    this.aiLastShotWasRandomMiss = true;
                    break;
                }
                else {
                    continue;
                }
            }
        }
    }
    shoot(/* player: BoardOwner, */ pos) {
        // doTheShooting
        const board = this.boards.find((board) => board.boardOwner !== this.playerWhosTurnItIs);
        if (!board)
            throw new Error("Whooops, didn't find the board we are looking for! " +
                this.playerWhosTurnItIs);
        let hitResult = board.checkHit(pos);
        let isShotHit = hitResult.hit === true;
        if (isShotHit) {
            logger_1.logger.info("A hit at: " + pos.x + pos.y + "!");
            if (board.areAllShipsSunk()) {
                // signal game end
                return this.gameOver({ username: board.boardOwner });
            }
            if ("identifier" in hitResult) {
                // signal sinking
                return this.shipDestroyed(hitResult);
            }
            else if ("x" in hitResult) {
                return this.hitEvent(Object.assign(Object.assign({}, hitResult), { username: this.playerWhosTurnItIs !== "AI" ? "ki" : "guest" }));
            }
        }
        else {
            logger_1.logger.warn("A miss at: " + pos.x + pos.y + "!");
            // this.switchPlayers();
            // NOT NEEDED BECAUSE WE SEND THE NAME WITH THE HitEvent
            // this.enabledPlayer({ username: this.playerWhosTurnItIs });
            if ("x" in hitResult) {
                logger_1.logger.error("Switched Players after isShotHit");
                return this.hitEvent(this.packHitEventSwitch(hitResult));
            }
            throw new Error("Something went wrong with the hitResult!");
        }
    }
    switchPlayers() {
        this.playerWhosTurnItIs =
            this.playerWhosTurnItIs === "AI" ? "Player" : "AI";
        if (this.playerWhosTurnItIs === "AI") {
            logger_1.logger.debug("AI enabled!" + this.playerWhosTurnItIs);
            setTimeout(() => {
                this.aiShoot();
            }, 3000);
        }
    }
    getCurrentPlayer() {
        return this.playerWhosTurnItIs;
    }
    gameOver(body) {
        logger_1.logger.error("Game over for: " + body.username);
        this.socket.emit("gameOver", body);
    }
    hitEvent(body) {
        this.socket.emit("hitEvent", body);
    }
    shipDestroyed(body) {
        this.socket.emit("shipDestroyed", body);
    }
    packHitEventSwitch(toPack) {
        let formerPlayer = this.playerWhosTurnItIs;
        this.switchPlayers();
        return Object.assign(Object.assign({}, toPack), { username: this.playerWhosTurnItIs === "AI" ? "ki" : "guest" });
    }
}
exports.TestPlayerController = TestPlayerController;
//# sourceMappingURL=TestControllerMaris.js.map