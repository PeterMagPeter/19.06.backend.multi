export type Position = {x: number, y: number};

export type Heading = "X" | "Y";

export type BoardOwner = "Ai" | "Player" | "Multiplayer";

export type GameMode = "online | offline";

export type HitResult = {
    x: number;
    y: number;
    username: string;
    hit: boolean;
    switchTo: string;
}

export type miniHit = {
    x: number;
    y: number;
    hit: boolean;
}

export type ShipType = {
    identifier: string;
    direction: Heading;
    startX: number;
    startY: number;
    length: number;
    hit: boolean;
}