"use strict";
class Ship {
    constructor(identifier, isHorizontal, startX, startY, length) {
        this.identifier = identifier;
        this.isHorizontal = isHorizontal;
        this.startX = startX;
        this.startY = startY;
        this.length = length;
        this.initialPositions = [];
        this.hitPositions = [];
        this.imSunk = false;
        this.fillInitialPositions();
    }
    fillInitialPositions() {
        for (let i = 0; i < this.length; i++) {
            const x = this.isHorizontal ? this.startX + i : this.startX;
            const y = this.isHorizontal ? this.startY : this.startY + i;
            this.initialPositions.push({ x, y });
        }
    }
    hit(position) {
        if (this.imSunk) {
            return;
        }
        if ((this.initialPositions.some((p) => p.x === position.x && p.y === position.y)) && !this.hitPositions.some((p) => p.x === position.x && p.y === position.y)) {
            this.hitPositions.push(position);
            if (this.hitPositions.length === this.length) {
                this.imSunk = true;
                console.log(`Schiff ${this.identifier} versenkt!`);
            }
        }
    }
    static createRandomShips(fieldSize) {
        const ships = [];
        const shipLengths = [2, 2, 3, 3, 4, 5];
        const minDistance = 1;
        let identifier = ["2a", "2b", "3a", "3b", "4", "5"];
        while (ships.length < 6) {
            const isHorizontal = Math.random() < 0.5;
            const start = Math.floor(Math.random() * (fieldSize - minDistance * 2));
            const end = start + Math.floor(Math.random() * (fieldSize - start - minDistance * 2));
            const length = shipLengths[ships.length];
            const shipIdentifier = identifier[ships.length];
            let valid = true;
            for (let i = 0; i < ships.length; i++) {
                const ship = ships[i];
                if ((isHorizontal &&
                    (ship.isHorizontal &&
                        (ship.startX <= end && ship.endX >= start) ||
                        !ship.isHorizontal &&
                            (ship.startY <= end && ship.endY >= start))) ||
                    !isHorizontal &&
                        (ship.isHorizontal &&
                            (ship.startX <= end && ship.endX >= start) ||
                            !ship.isHorizontal &&
                                (ship.startY <= end && ship.endY >= start))) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                const startX = isHorizontal ? start : Math.floor(Math.random() * (fieldSize - minDistance * 2));
                const startY = isHorizontal ? Math.floor(Math.random() * (fieldSize - minDistance * 2)) : start;
                const newShip = new Ship(shipIdentifier, isHorizontal, startX, startY, length);
                ships.push(newShip);
            }
        }
        return ships;
    }
}
class Game {
    constructor(fieldSize) {
        this.field = Array.from({ length: fieldSize }, () => Array(fieldSize).fill(null));
        this.ships = Ship.createRandomShips(fieldSize);
        this.positions = [];
        this.placeShips();
        this.addRandomPositions();
    }
    placeShips() {
        for (const ship of this.fieldSize.ships) {
            for (const position of ship.initialPositions) {
                this.field[position.y][position.x] = ship;
            }
        }
    }
    addRandomPositions() {
        const numPositions = 10;
        for (let i = 0; i < numPositions; i++) {
            const x = Math.floor(Math.random() * this.field.length);
            const y = Math.floor(Math.random() * this.field.length);
            if (this.field[y][x] === null) {
                this.positions.push({ x, y });
            }
        }
    }
    play() {
        let winner = "";
        while (this.ships.length > 0) {
            const position = this.getRandomPosition();
            const ship = this.field[position.y][position.x];
            if (ship) {
                ship.hit(position);
                if (ship.imSunk) {
                    this.ships = this.ships.filter((s) => s !== ship);
                    winner = "Spieler 1";
                }
            }
            else {
                winner = "Spieler 2";
            }
        }
        console.log(`Gewonnen hat ${winner}!`);
    }
    getRandomPosition() {
        let position = this.positions[Math.floor(Math.random() * this.positions.length)];
        while (this.field[position.y][position.x] === null) {
            this.positions = this.positions.filter((p) => p !== position);
            position = this.positions[Math.floor(Math.random() * this.positions.length)];
        }
        return position;
    }
}
const game = new Game(10);
game.play();
//# sourceMappingURL=test.js.map