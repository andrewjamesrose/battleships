import { isCoordInBounds, isInBounds } from '../services/game-service.service';

export interface ICoord {
  x: number;
  y: number;
}

export const UP: ICoord = { x: 0, y: 1 };
export const DOWN: ICoord = { x: 0, y: -1 };
export const LEFT: ICoord = { x: -1, y: 0 };
export const RIGHT: ICoord = { x: 1, y: 0 };

export type Direction = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT;

const DIRECTION_ARRAY: Direction[] = [UP, DOWN, LEFT, RIGHT];

export type BoatComponent = 'stern' | 'midsection' | 'bow';

export type Tile = BoatComponent | 'excluded' | 'blank';

export interface IGameTile {
  coord: ICoord;
  identity: Tile;
  displayed: boolean;
  direction: Direction;
}

export interface IBoat {
  sternCoord: ICoord;
  direction: Direction;
  length: number;
}

export class Boat implements IBoat {
  sternCoord: ICoord;
  length: number;
  direction: Direction;

  constructor(sternCoord: ICoord, length: number) {
    this.sternCoord = sternCoord;
    this.length = length;
    this.direction = generateDirection();
  }

  getCoordinateSet(): ICoord[] {
    let offsetX: number = this.direction.x;
    let offsetY: number = this.direction.y;

    let outputCoordSet: ICoord[] = [];

    for (let i = 0; i < this.length; i++) {
      let newCoord: ICoord;

      if (offsetY === 0) {
        newCoord = { x: this.sternCoord.x + i * offsetX, y: this.sternCoord.y };
      } else {
        newCoord = { x: this.sternCoord.x, y: this.sternCoord.y + i * offsetY };
      }

      outputCoordSet.push(newCoord);
    }

    return outputCoordSet;
  }
}

function generateDirection(): Direction {
  return DIRECTION_ARRAY[Math.floor(Math.random() * DIRECTION_ARRAY.length)];
}

export function generateExcludedCoordSet(boat: Boat): ICoord[] {
  let outputCoordSet: ICoord[] = [];
  //   let boatCoords: ICoord[] = boat.getCoordinateSet();

  let offsetX: number = boat.direction.x;
  let offsetY: number = boat.direction.y;

  let newCoord: ICoord;

  if (boat.length === 1) {
    //  this is both first and last
  }

  for (let i = -1; i <= boat.length; i++) {
    // Check if first or if last position
    let firstIndicator = false;
    let lastIndicator = false;

    if (i === -1) {
      firstIndicator = true;
    }

    if (i === boat.length) {
      lastIndicator = true;
    }

    if (offsetY === 0) {
      // sweep horizontally
      newCoord = {
        x: boat.sternCoord.x + i * offsetX,
        y: boat.sternCoord.y + 1,
      };

      if (isCoordInBounds(newCoord)) {
        outputCoordSet.push(newCoord);
      }

      newCoord = {
        x: boat.sternCoord.x + i * offsetX,
        y: boat.sternCoord.y - 1,
      };

      if (isCoordInBounds(newCoord)) {
        outputCoordSet.push(newCoord);
      }

      if (firstIndicator || lastIndicator) {
        newCoord = {
          x: boat.sternCoord.x + i * offsetX,
          y: boat.sternCoord.y,
        };
        if (isCoordInBounds(newCoord)) {
          outputCoordSet.push(newCoord);
        }
      }
    } else {
      // sweep vertically
      newCoord = {
        x: boat.sternCoord.x + 1,
        y: boat.sternCoord.y + i * offsetY,
      };

      if (isCoordInBounds(newCoord)) {
        outputCoordSet.push(newCoord);
      }

      newCoord = {
        x: boat.sternCoord.x - 1,
        y: boat.sternCoord.y + i * offsetY,
      };

      if (isCoordInBounds(newCoord)) {
        outputCoordSet.push(newCoord);
      }

      if (firstIndicator || lastIndicator) {
        newCoord = {
          x: boat.sternCoord.x,
          y: boat.sternCoord.y + i * offsetY,
        };
        if (isCoordInBounds(newCoord)) {
          outputCoordSet.push(newCoord);
        }
      }
    }
  }

  return outputCoordSet;
}
