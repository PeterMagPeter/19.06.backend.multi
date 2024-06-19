"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GC = void 0;
const Ship_1 = require("./Ship");
class GC {
    // TODO Solution for parameter list (generalization)
    constructor(playerBoard, aiBoard, identifier, currentPlayer, playerAmount, difficulty) {
        this.playerShipPositions = [];
        this.firstHitPosition = [];
        this.hitList = [];
        this.tempArr = [];
        this.nextRandomShotCoordinate = [];
        this.moveOneDirection = [];
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
        if (this.hitList.length > 0) {
            let shotCoordinate;
            let checkHit;
            // If exactly 1 coord in lastHitPosition exist (means prepare 2nd shot coord)
            if (this.hitList.length == 1) {
                // Create some new coords in tempArr, based on first hit ever
                this.AddNewCoordinatesToTempArr(this.hitList.at(0));
                // Remove some empty coords from tempArr
                this.removeSomeEmptyPos();
                // Add a single randomly picked coord to nextShotCoordinates, to determine alignment of ship (if shot is a hit)
                this.nextRandomShotCoordinate.push(this.aiRandomizedPositionsPicks(this.tempArr, this.tempArr.length));
                // Prepare 2nd shot
                let shotCoordinate = this.nextRandomShotCoordinate.at(0);
                // Shoot and save result
                let checkHitResult = this.playerBoard.checkHit(shotCoordinate, "Ai");
                // If 2nd hit destroys a ship (means current focused ship has length 2)
                if (checkHitResult instanceof Ship_1.Ship) {
                    let ship = checkHitResult;
                    /**
                     * Remove all entries of positions that belong to ship
                     */
                    // Remove from playerShipPositions
                    this.removeSpecificPos(this.playerShipPositions, shotCoordinate);
                    // Remove from nextRandomShotCoordinate
                    this.removeSpecificPos(this.nextRandomShotCoordinate, shotCoordinate);
                    // Remove all coords from ship in hitList
                    this.removeAllCoordsFromShipInArr(this.hitList, ship);
                    // Backup
                    // for (let i = 0; i < ship.initialPositions.length; i++) {
                    //     const shipCoord = ship.initialPositions[i];
                    //     for (let j = 0; j < this.hitList.length; j++) {
                    //         const hitPosition = this.hitList[j];
                    //         if (this.positionEquals(shipCoord, hitPosition)) {
                    //             this.hitList.splice(j, 1);
                    //             break;
                    //         }
                    //     }
                    // }
                    // Clean up moveDirection to determine new direction
                    this.moveOneDirection = [];
                    // Reset determined alignment
                    this.shipAlignment = "";
                    return ship;
                }
                if (typeof checkHitResult === "boolean" && checkHitResult) {
                    this.stepCounter++;
                    // Determine alignment of ship
                    this.shipAlignment = this.determineShipAlignement(this.hitList.at(0), shotCoordinate);
                    // Save hit 
                    this.hitList.push(shotCoordinate);
                    this.moveOneDirection.push(shotCoordinate);
                    return true;
                }
            }
            // If at least 2 lastHitPosition exist (means prepare 3rd shot coord)
            if (this.moveOneDirection.length > 0) {
                let shotCoordinate = this.getOneCoordinate(this.moveOneDirection.at(this.moveOneDirection.length - 1), this.shipAlignment);
                let checkHitResult;
                // Shoot and save result
                if (typeof checkHitResult === "boolean" && checkHitResult) {
                }
                else {
                }
                this.playerBoard.checkHit(shotCoordinate, "Ai");
            }
            // Set shot
            // Finalize randomly picked shot coordinate & check hit result
            if (this.nextRandomShotCoordinate.length == 0) {
                /**
                 * If no coord left in nextShotCoordinates, everything around last- and firstHitPosition has been hit and sunk
                 *  ==> Get a new coord and calculate new coords
                 *  ==> Reset last- and firstHitPosition arrays and shipAlignment
                 */
                shotCoordinate = this.aiRandomizedPositionsPicks(this.playerShipPositions, this.playerShipPositions.length);
                this.firstHitPosition = [];
                this.hitList = [];
                this.shipAlignment = "";
            }
            else {
                shotCoordinate = this.aiRandomizedPositionsPicks(this.nextRandomShotCoordinate, this.nextRandomShotCoordinate.length);
            }
            checkHit = this.playerBoard.checkHit(shotCoordinate, "Ai");
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
                // this.firstHitPosition.push(shotCoordinate);
                // this.lastHitPosition.push(shotCoordinate);
                // this.trackAllShots.push(shotCoordinate);
                this.stepCounter++;
                // Save hit coord in moveOneDirection to determine alignment with 2nd hit
                this.hitList.push(shotCoordinate);
                this.moveOneDirection.push(shotCoordinate);
                // Remove hit coord from playerShipPositions
                this.removeSpecificPos(this.playerShipPositions, shotCoordinate);
                // Backup
                // this.playerShipPositions.filter(coord => {
                //     (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                // });
                return true;
            }
            else {
                // Remove shot coord if she apears in playerShipPositions
                this.removeSpecificPos(this.playerShipPositions, shotCoordinate);
                // Backup
                // this.playerShipPositions.filter(coord => {
                //     (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
                // });
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
        return false;
    }
    // To fill list with random coordinates, depending on the set difficulty
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
    // Make sure only unused positions are added as new shot coordinates
    addToTempArr(newPosition, arr) {
        if (typeof newPosition !== "boolean") {
            if (this.playerBoard.playfield[newPosition.y][newPosition.x] != "O" && this.playerBoard.playfield[newPosition.y][newPosition.x] != "X" && this.playerBoard.playfield[newPosition.y][newPosition.x] != "D" && !this.nextRandomShotCoordinate.includes(newPosition)) {
                this.nextRandomShotCoordinate.push(newPosition);
            }
        }
    }
    // Make sure only unused positions are added as new shot coordinates
    addToNextShotCoordinates(newPosition, arr) {
        if (typeof newPosition !== "boolean") {
            if (this.playerBoard.playfield[newPosition.y][newPosition.x] != "O" && this.playerBoard.playfield[newPosition.y][newPosition.x] != "X" && this.playerBoard.playfield[newPosition.y][newPosition.x] != "D" && !this.nextRandomShotCoordinate.includes(newPosition)) {
                this.nextRandomShotCoordinate.push(newPosition);
            }
        }
    }
    // Check if given coords are equal 
    positionEquals(pos1, pos2) {
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }
    // Find out alignement 
    determineShipAlignement(pos1, pos2) {
        let result = "";
        if (pos1.x < pos2.x) {
            result = "+x";
        }
        ;
        if (pos1.x > pos2.x) {
            result = "-x";
        }
        ;
        if (pos1.y < pos2.y) {
            result = "+y";
        }
        ;
        if (pos1.y < pos2.y) {
            result = "-y";
        }
        ;
        return result;
    }
    // Get new coordinates based on a position
    AddNewCoordinatesToTempArr(pos1) {
        let nextPos01 = this.validateCoordinate({ x: this.hitList.at(0).x + 1, y: this.hitList.at(0).y });
        let nextPos02 = this.validateCoordinate({ x: this.hitList.at(0).x - 1, y: this.hitList.at(0).y });
        let nextPos03 = this.validateCoordinate({ x: this.hitList.at(0).x, y: this.hitList.at(0).y + 1 });
        let nextPos04 = this.validateCoordinate({ x: this.hitList.at(0).x, y: this.hitList.at(0).y - 1 });
        // Add potential coords to tempArr
        if (typeof nextPos01 !== "boolean") {
            this.addToTempArr(nextPos01, this.nextRandomShotCoordinate);
        }
        ;
        if (typeof nextPos02 !== "boolean") {
            this.addToTempArr(nextPos02, this.nextRandomShotCoordinate);
        }
        ;
        if (typeof nextPos03 !== "boolean") {
            this.addToTempArr(nextPos03, this.nextRandomShotCoordinate);
        }
        ;
        if (typeof nextPos04 !== "boolean") {
            this.addToTempArr(nextPos04, this.nextRandomShotCoordinate);
        }
        ;
    }
    // Get new coordinates based on a position
    getOneCoordinate(pos, alignment) {
        // let nextPos01 = this.validateCoordinate({ x: this.hitList.at(this.hitList.length - 1)!.x! + this.stepCounter, y: this.hitList.at(this.hitList.length - 1)!.y! });
        // let nextPos02 = this.validateCoordinate({ x: this.hitList.at(this.hitList.length - 1)!.x! - this.stepCounter, y: this.hitList.at(this.hitList.length - 1)!.y! });
        // // Add potential coords to tempArr
        // if (typeof nextPos01 !== "boolean" && nextPos01) {
        //     return nextPos01;
        // } else {
        //     return nextPos02;
        // }
        let newCoord;
        if (alignment == "+x") {
            newCoord = this.validateCoordinate({ x: pos.x + 1, y: pos.y });
            if (typeof newCoord !== "boolean" && newCoord) {
                this.moveOneDirection.push(newCoord);
                this.hitList.push(newCoord);
                this.stepCounter++;
                return true;
            }
            else {
                newCoord = this.validateCoordinate({ x: pos.x - this.stepCounter, y: pos.y });
                if (typeof newCoord !== "boolean" && newCoord) {
                    this.moveOneDirection.push(newCoord);
                    this.hitList.push(newCoord);
                    this.stepCounter++;
                    return true;
                }
            }
            return false;
        }
        else if (alignment == "-x") {
            newCoord = this.validateCoordinate({ x: pos.x - 1, y: pos.y });
            if (typeof newCoord !== "boolean" && newCoord) {
                this.moveOneDirection.push(newCoord);
                this.hitList.push(newCoord);
                this.stepCounter++;
                return true;
            }
            else {
                newCoord = this.validateCoordinate({ x: pos.x + this.stepCounter, y: pos.y });
                if (typeof newCoord !== "boolean" && newCoord) {
                    this.moveOneDirection.push(newCoord);
                    this.hitList.push(newCoord);
                    this.stepCounter++;
                    return true;
                }
            }
            return false;
        }
        else if (alignment == "+y") {
            newCoord = this.validateCoordinate({ x: pos.x, y: pos.y + 1 });
            if (typeof newCoord !== "boolean" && newCoord) {
                this.moveOneDirection.push(newCoord);
                this.hitList.push(newCoord);
                this.stepCounter++;
                return true;
            }
            else {
                newCoord = this.validateCoordinate({ x: pos.x - this.stepCounter, y: pos.y });
                if (typeof newCoord !== "boolean" && newCoord) {
                    this.moveOneDirection.push(newCoord);
                    this.hitList.push(newCoord);
                    this.stepCounter++;
                    return true;
                }
            }
            return false;
        }
        else {
            newCoord = this.validateCoordinate({ x: pos.x, y: pos.y - 1 });
            if (typeof newCoord !== "boolean" && newCoord) {
                this.moveOneDirection.push(newCoord);
                this.hitList.push(newCoord);
                this.stepCounter++;
                return true;
            }
            else {
                newCoord = this.validateCoordinate({ x: pos.x - this.stepCounter, y: pos.y });
                if (typeof newCoord !== "boolean" && newCoord) {
                    this.moveOneDirection.push(newCoord);
                    this.hitList.push(newCoord);
                    this.stepCounter++;
                    return true;
                }
            }
            return false;
        }
    }
    // Validate if coord is within the array field
    validateCoordinate(newPosition) {
        if (newPosition.x > -1 && newPosition.x < 10 && newPosition.y > -1 && newPosition.y < 10) {
            return newPosition;
        }
        else {
            return false;
        }
    }
    // Remove some empty positions from tempArray
    removeSomeEmptyPos() {
        /**
        * God-Mod cheat.
        * If 4 possible shot coordinates exist:
        *  - 1 valid coordinate ==> Take out two empty coordinates randomly (to simulate human-like behavior)
        *  - 2 valid coordinates ==> Take out one empty coordinate randomly (to simulate human-like behavior)
        **/
        // Determine amount of empty coordinates and storage their indeces
        let emptyCoordinates = 0;
        let indexOfEmptyCoordinates = [];
        this.tempArr.forEach(coord => {
            if (this.playerBoard.playfield[coord.y][coord.x] == ".") {
                indexOfEmptyCoordinates.push(emptyCoordinates);
                emptyCoordinates++;
            }
        });
        // Delete some empty coordinates (randomly picked to simulate human-like behavior)
        if (indexOfEmptyCoordinates.length == 3) {
            while (emptyCoordinates > 1) {
                let index = Math.floor(Math.random() * indexOfEmptyCoordinates.length);
                this.tempArr.splice(index, 1);
                emptyCoordinates--;
            }
        }
        if (indexOfEmptyCoordinates.length == 2) {
            while (emptyCoordinates > 1) {
                let index = Math.floor(Math.random() * indexOfEmptyCoordinates.length);
                this.tempArr.splice(index, 1);
                emptyCoordinates--;
            }
        }
    }
    // Remove a specific position
    removeSpecificPos(arr, coordToDel) {
        arr.filter(coord => {
            (coord.x !== coordToDel.x && coord.y !== coordToDel.y);
        });
    }
    // Remove all coords of a ship from an array
    removeAllCoordsFromShipInArr(arr, ship) {
        ship.initialPositions.forEach(coord => {
            arr.filter(() => {
                (coord.x !== coord.x && coord.y !== coord.y);
            });
        });
    }
    // Handle checkHit
    handleCheckHitResult(shotCoordinate) {
        let checkHit = this.playerBoard.checkHit(shotCoordinate, "Ai");
        if (typeof checkHit === "boolean" && checkHit) {
            this.hitList.push(shotCoordinate);
            this.stepCounter++;
            // this.trackAllShots.push(shotCoordinate);
            // Find out alignment
            if (this.stepCounter == 2) {
                // horizontal alignement of shot movement
                this.shipAlignment = this.determineShipAlignement(this.hitList.at(0), this.hitList.at(1));
                if (this.shipAlignment == "+x") {
                    let newCoord = this.validateCoordinate({ x: this.hitList.at(this.hitList.length).x + 1, y: this.hitList.at(this.hitList.length).y });
                }
                else if (this.shipAlignment == "-x") {
                }
                else if (this.shipAlignment == "+y") {
                }
                else {
                }
            }
            this.playerShipPositions.filter(coord => {
                (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
            });
            // this.nextShotCoordinates.filter(coord => {
            //     (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
            // });
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
            this.nextRandomShotCoordinate.filter(coord => {
                (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
            });
            // Remove all coords from ship in this.lastHitPosition
            for (let i = 0; i < ship.initialPositions.length; i++) {
                const shipCoord = ship.initialPositions[i];
                for (let j = 0; j < this.hitList.length; j++) {
                    const hitPosition = this.hitList[j];
                    if (this.positionEquals(shipCoord, hitPosition)) {
                        this.hitList.splice(j, 1);
                        break;
                    }
                }
            }
            if (this.hitList.length == 0) {
                // Reset data 
                this.firstHitPosition = [];
                this.hitList = [];
                this.nextRandomShotCoordinate = [];
                this.moveOneDirection = [];
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
            this.nextRandomShotCoordinate.filter(coord => {
                (coord.x !== shotCoordinate.x && coord.y !== shotCoordinate.y);
            });
            this.moveOneDirection.push(shotCoordinate);
            return false;
        }
    }
}
exports.GC = GC;
//# sourceMappingURL=GC_Playtest.js.map