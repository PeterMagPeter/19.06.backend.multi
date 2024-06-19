"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const Ship_1 = require("./Ship");
class GameController {
    // TODO Solution for parameter list (generalization)
    constructor(playerBoard, aiBoard, identifier, currentPlayer, playerAmount, difficulty) {
        this.playerShipPositions = [];
        this.firstHitPosition = [];
        this.lastHitPosition = [];
        this.nextShotCoordinates = [];
        this.trackAllShots = [];
        // To find out ship alignement
        this.stepCounter = 0;
        this.shipAlignment = "";
        // TODO Implement individual amount of boards (with specific usernames) depending on the amount of players and push them into boards
        //this.gameMode = gameMode;
        //this.playerNames = playerNames;
        //this.boards = new Map<string, Board>;
        //if(gameMode.toString() == "offline"){
        //    this.boards.set(playerNames[0], );
        //}
        // ######################################
        // ######################################
        this.playerBoard = playerBoard;
        this.aiBoard = aiBoard;
        currentPlayer ? this.currentPlayer = currentPlayer : this.currentPlayer = "Multiplayer";
        this.readyStatCounter = 0;
        // To handle offline and online matches
        playerAmount ? this.playerAmount = playerAmount : this.playerAmount = 0;
        difficulty ? this.difficulty = difficulty : this.difficulty = undefined;
        this.identifier = identifier;
        // AI-Feature: Push all ship positions into playerShipPositions
        playerBoard.ships.forEach(ship => {
            ship.initialPositions.forEach(shipPosition => {
                this.playerShipPositions.push(shipPosition);
            });
        });
        // TODO Initialize AI randomized placement of ships
        if (difficulty) {
            this.playerShipPositionsFillUp(difficulty);
        }
    }
    // Function button for multiplayer matches
    setReady() {
        this.readyStatCounter++;
    }
    // Function button for multiplayer matches
    getReady() {
        return this.readyStatCounter == this.playerAmount;
    }
    // Happens in front end.
    //
    // startGame() {
    //     // Only for offline mode
    //     if (this.currentPlayer != "Multiplayer") {
    //         while (this.playerBoard.shipQuantity != this.playerBoard.sunkCounter && this.aiBoard.shipQuantity != this.aiBoard.sunkCounter) {
    //             // Ask for coordinate
    //             let position: Position = { x: 10, y: 20 };
    //             this.shoot(position, this.currentPlayer);
    //         }
    //     }
    // }
    // Choose how to fill playerShipPositions array
    playerShipPositionsFillUp(difficulty) {
        let columnAmount = this.playerBoard.columnAmount;
        if (difficulty == "Easy") {
            for (let i = 0; i < columnAmount; i++) {
                for (let j = 0; j < columnAmount; j++) {
                    let newPosition = { x: i, y: j };
                    if (!this.playerShipPositions.includes(newPosition)) {
                        this.playerShipPositions.push(newPosition);
                    }
                }
            }
        }
        else if (difficulty == "Moderate") {
            let start = 0;
            while (start < columnAmount + 15) {
                let newPosition = this.aiRandomizedPositionFills();
                if (!this.playerShipPositions.includes(newPosition)) {
                    this.playerShipPositions.push(newPosition);
                    start++;
                }
            }
        }
        else {
            let start = 0;
            while (start < 3) {
                let newPosition = this.aiRandomizedPositionFills();
                if (!this.playerShipPositions.includes(newPosition)) {
                    this.playerShipPositions.push(newPosition);
                    start++;
                }
            }
        }
    }
    // TODO Implement and outsource intelligent picking logic as function
    // Difficulty god-mode. If set, the AI has a statistical hit rate of at least 50 %
    aiGod() {
        // Get last hit from positionControl
        // Randomize pick possibilities an continue, where next hit was found until miss or sunk signal
        // When hit in between all ship coordinates and one end is reached (miss signal), continue from first hit position - 1
        // Empty positionControl when ship sunk signal is received
        // Create new potential shot coordinates based on lastHitPosition
        if (this.lastHitPosition.length > 0) {
            let nextPos01;
            let nextPos02;
            let nextPos03;
            let nextPos04;
            let shotCoordinate;
            let checkHit;
            // If exactly 1 coord in lastHitPosition exist (means prepare 2nd shot coord)
            if (this.lastHitPosition.length == 1) {
                // Validate new coords 
                nextPos01 = this.validateCoord({ x: this.lastHitPosition.at(0).x + 1, y: this.lastHitPosition.at(0).y });
                nextPos02 = this.validateCoord({ x: this.lastHitPosition.at(0).x - 1, y: this.lastHitPosition.at(0).y });
                nextPos03 = this.validateCoord({ x: this.lastHitPosition.at(0).x, y: this.lastHitPosition.at(0).y + 1 });
                nextPos04 = this.validateCoord({ x: this.lastHitPosition.at(0).x, y: this.lastHitPosition.at(0).y - 1 });
                // Add new coordinates
                if (typeof nextPos01 !== "boolean") {
                    this.addCoord(nextPos01, this.nextShotCoordinates);
                }
                ;
                if (typeof nextPos02 !== "boolean") {
                    this.addCoord(nextPos02, this.nextShotCoordinates);
                }
                ;
                if (typeof nextPos03 !== "boolean") {
                    this.addCoord(nextPos03, this.nextShotCoordinates);
                }
                ;
                if (typeof nextPos04 !== "boolean") {
                    this.addCoord(nextPos04, this.nextShotCoordinates);
                }
                ;
                /**
                 * God-Mod cheat.
                 * If 4 possible shot coordinates exist:
                 *  - 1 valid coordinate ==> Take out two empty coordinates randomly (to simulate human-like behavior)
                 *  - 2 valid coordinates ==> Take out one empty coordinate randomly (to simulate human-like behavior)
                 * */
                // Determine amount of empty coordinates and storage their indeces
                let emptyCoordinates = 0;
                let indexOfEmptyCoordinates = [];
                this.nextShotCoordinates.forEach(coord => {
                    if (this.playerBoard.playfield[coord.y][coord.x] == ".") {
                        indexOfEmptyCoordinates.push(emptyCoordinates);
                        emptyCoordinates++;
                    }
                });
                // Delete some empty coordinates (randomly picked to simulate human-like behavior)
                if (indexOfEmptyCoordinates.length == 3) {
                    while (emptyCoordinates > 1) {
                        let index = Math.floor(Math.random() * indexOfEmptyCoordinates.length);
                        this.nextShotCoordinates.splice(index, 1);
                        emptyCoordinates--;
                    }
                }
                if (indexOfEmptyCoordinates.length == 2) {
                    while (emptyCoordinates > 1) {
                        let index = Math.floor(Math.random() * indexOfEmptyCoordinates.length);
                        this.nextShotCoordinates.splice(index, 1);
                        emptyCoordinates--;
                    }
                }
            }
            // If at least 2 lastHitPosition exist (means prepare 3rd shot coord)
            if (this.lastHitPosition.length > 1) {
                // TODO Implement logic to find out alignment of ship
                let lastShotPosition = this.trackAllShots.at(this.trackAllShots.length - 1);
                if (this.playerBoard.playfield[lastShotPosition.y][lastShotPosition.x] == "O") {
                    if (this.shipAlignment == "horizontal") {
                        nextPos01 = { x: this.firstHitPosition.at(this.firstHitPosition.length - 1).x - 1, y: this.firstHitPosition.at(this.firstHitPosition.length - 1).y };
                    }
                }
                else {
                }
                // Unterscheidung/Prüfung, ob 3 shot ein fail war
                // Horizontal move ()
                if (this.firstHitPosition.at(this.firstHitPosition.length - 1).x < this.lastHitPosition.at(this.lastHitPosition.length - 1).x) {
                    if (this.lastHitPosition.at(this.lastHitPosition.length - 1).x + 1 < 10) {
                        nextPos01 = { x: this.lastHitPosition.at(this.lastHitPosition.length - 1).x + 1, y: this.lastHitPosition.at(this.lastHitPosition.length - 1).y };
                    }
                    else {
                        nextPos01 = { x: this.firstHitPosition.at(this.firstHitPosition.length - 1).x - 1, y: this.lastHitPosition.at(this.lastHitPosition.length - 1).y };
                    }
                }
                // Vertical move
                if (this.firstHitPosition.at(this.firstHitPosition.length - 1).y < this.lastHitPosition.at(this.lastHitPosition.length - 1).x) {
                    if (this.lastHitPosition.at(this.lastHitPosition.length - 1).x + 1 < 10) {
                        nextPos01 = { x: this.lastHitPosition.at(this.lastHitPosition.length - 1).x + 1, y: this.lastHitPosition.at(this.lastHitPosition.length - 1).y };
                    }
                    else {
                        nextPos01 = { x: this.firstHitPosition.at(this.firstHitPosition.length - 1).x - 1, y: this.lastHitPosition.at(this.lastHitPosition.length - 1).y };
                    }
                }
            }
            // Finalize randomly picked shot coordinate & check hit result
            if (this.nextShotCoordinates.length == 0) {
                /**
                 * If no coord left in nextShotCoordinates, everything around last- and firstHitPosition has been hit and sunk
                 *  ==> Get a new coord and calculate new coords
                 *  ==> Reset last- and firstHitPosition arrays and shipAlignment
                 */
                shotCoordinate = this.aiRandomizedPositionsPicks(this.playerShipPositions, this.playerShipPositions.length);
                this.firstHitPosition = [];
                this.lastHitPosition = [];
                this.shipAlignment = "";
            }
            else {
                shotCoordinate = this.aiRandomizedPositionsPicks(this.nextShotCoordinates, this.nextShotCoordinates.length);
            }
            checkHit = this.playerBoard.checkHit(shotCoordinate, "Ai");
            if (typeof checkHit === "boolean" && checkHit) {
                this.lastHitPosition.push(shotCoordinate);
                this.stepCounter++;
                this.trackAllShots.push(shotCoordinate);
                // Find out alignment
                if (this.lastHitPosition.length > 1) {
                    // horizontal alignement of shot movement
                    if (this.lastHitPosition.at(0).x < this.lastHitPosition.at(this.lastHitPosition.length - 1).x || this.lastHitPosition.at(0).x > this.lastHitPosition.at(this.lastHitPosition.length - 1).x) {
                        this.shipAlignment = "horizontal";
                    }
                    else {
                        this.shipAlignment = "vertical";
                    }
                }
                this.playerShipPositions.filter(coord => {
                    (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                });
                this.nextShotCoordinates.filter(coord => {
                    (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                });
                return true;
                /**
                * Check if checkHit is a ship (means that ship is sunk now) to get new coordinates from playerShipPositions
                * and to clear up firstHitPosition, lastHitPosition & nextShotCoordinates
                */
            }
            else if (checkHit instanceof Ship_1.Ship) {
                let ship = checkHit;
                this.shipAlignment = "";
                this.playerShipPositions.filter(coord => {
                    (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                });
                this.nextShotCoordinates.filter(coord => {
                    (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                });
                // Remove all coords from ship in this.lastHitPosition
                for (let i = 0; i < ship.initialPositions.length; i++) {
                    const shipCoord = ship.initialPositions[i];
                    for (let j = 0; j < this.lastHitPosition.length; j++) {
                        const hitPosition = this.lastHitPosition[j];
                        if (this.positionEquals(shipCoord, hitPosition)) {
                            this.lastHitPosition.splice(j, 1);
                            break;
                        }
                    }
                }
                if (this.lastHitPosition.length == 0) {
                    // Reset data 
                    this.firstHitPosition = [];
                    this.lastHitPosition = [];
                    this.nextShotCoordinates = [];
                    this.trackAllShots = [];
                }
                return ship;
                /**
                 * Check if checkHit is a string (means the game is over).
                 */
            }
            else if (typeof checkHit === "string") {
                let winner = checkHit;
                return winner;
            }
            else {
                this.nextShotCoordinates.filter(coord => {
                    (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                });
                this.trackAllShots.push(shotCoordinate);
                return false;
            }
        }
        else {
            /**
             * In the beginning and after sinking a ship - Try to hit player's ships with a random shot coordinate from playerShipPositions.
             * If it's a hit, track that position in lastHitPosition to calculate new possible positions based on lastHitPosition
             * and delete that coordinate from playerShipPositions. If it's a miss, delete it from nextShotCoordinates.
             */
            let shotCoordinate = this.aiRandomizedPositionsPicks(this.playerShipPositions, this.playerShipPositions.length);
            let checkHit = this.playerBoard.checkHit(shotCoordinate, this.aiBoard.boardOwner);
            if (typeof checkHit == "boolean" && checkHit) {
                this.stepCounter++;
                this.firstHitPosition.push(shotCoordinate);
                this.lastHitPosition.push(shotCoordinate);
                this.trackAllShots.push(shotCoordinate);
                this.playerShipPositions.filter(coord => {
                    (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                });
                return true;
            }
            else {
                this.trackAllShots.push(shotCoordinate);
                this.playerShipPositions.filter(coord => {
                    (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                });
                return false;
            }
        }
    }
    /**
     * Difficulty middle. If set, AI knows the ship positions, but a randomizer is used to
     * randomly pic coordinates from a list of the enemies ship coordinates and some unused coordinates.
     * If a randomly picked coordinate is a hit, the AI tries to test the coordinates around that hit
     * systematically until the ship is sunk.
     */
    aiModerate() {
        // TODO aiModerate needs to be implemented
        return false;
    }
    /**
     * Difficulty easy. If set, AI knows the ship positions, but a randomizer is used to
     * randomly pic coordinates from a list of the enemies ship coordinates and many unused coordinates.
     * If a randomly picked coordinate is a hit, the AI tries to test the coordinates around that hit
     * systematically until the ship is sunk.
     */
    aiEasy() {
        // TODO aiModerate needs to be implemented
        return false;
    }
    // To fill list with random coordinates, depending on difficulty
    aiRandomizedPositionFills() {
        const randomX = Math.floor(Math.random() * 10);
        const randomY = Math.floor(Math.random() * 10);
        return { x: randomX, y: randomY };
    }
    // Pick a random coordinate from list
    aiRandomizedPositionsPicks(coordinatesArray, arrLength) {
        let randomPositionPick = coordinatesArray[Math.floor(Math.random() * arrLength)];
        return randomPositionPick;
    }
    // TODO Solution for playtest 
    // TODO Solution for generalization
    // Shoots at the given position
    shoot(position, player) {
        let currentPlayerBoard = player == "Player" ? this.playerBoard : this.aiBoard;
        return currentPlayerBoard.checkHit(position, player);
    }
    // Validate if coord is within the array field
    validateCoord(newPosition) {
        if (newPosition.x > -1 && newPosition.x < 10 && newPosition.y > -1 && newPosition.y < 10) {
            return newPosition;
        }
        else {
            return false;
        }
    }
    // Make sure only unused positions are added as new shot coordinates
    addCoord(newPosition, arr) {
        if (typeof newPosition !== "boolean") {
            if (this.playerBoard.playfield[newPosition.y][newPosition.x] != "O" && this.playerBoard.playfield[newPosition.y][newPosition.x] != "X" && this.playerBoard.playfield[newPosition.y][newPosition.x] != "D" && !this.nextShotCoordinates.includes(newPosition)) {
                this.nextShotCoordinates.push(newPosition);
            }
        }
    }
    // Check if given coords are equal 
    positionEquals(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }
}
exports.GameController = GameController;
//# sourceMappingURL=GameController.js.map