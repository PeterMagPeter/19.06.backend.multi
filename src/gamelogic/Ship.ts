import { Position } from "./Types";

export class Ship {
    isHorizontal: boolean; 
    startPosition: Position;
    length: number;
    initialPositions: Position[];
    hitPositions: Position[];

    imSunk: boolean;
    identifier: string;

    constructor(identifier: string, isHorizontal: boolean, startPosition: Position, length: number){
        this.identifier = identifier;
        this.isHorizontal = isHorizontal;
        this.startPosition = startPosition;
        this.length = length;
        this.initialPositions = [];
        this.hitPositions = [];
        this.imSunk = false;
        this.fillInitialPositions();
    }

    fillInitialPositions() {
        if (this.isHorizontal) {
            for (let i = 0; i < this.length; i++) {
                this.initialPositions.push({ x: this.startPosition.x + i, y: this.startPosition.y });
            }
        } else {
            for (let i = 0; i < this.length; i++) {
                this.initialPositions.push({ x: this.startPosition.x, y: this.startPosition.y + i });
            }
        }
    }
    
    setHit(position: Position) {
        this.hitPositions.push(position);
        if(this.hitPositions.length === this.initialPositions.length) {
            this.imSunk = true;
        }
    }

    getIsSunk(){
        return this.imSunk;
    }
}



