export interface ICoord {
  x: number;
  y: number;
}

const UP: ICoord = { x: 0, y: 1 };
const DOWN: ICoord = { x: 0, y: -1 };
const LEFT: ICoord = { x: -1, y: 0 };
const RIGHT: ICoord = { x: 1, y: 0 };

export type Direction = typeof UP | typeof DOWN | typeof LEFT | typeof RIGHT;

const DIRECTION_ARRAY: Direction[] = [UP, DOWN, LEFT, RIGHT];

export type BoatComponent = 'stern' | 'midsection' | 'bow';

export type Tile = BoatComponent | 'excluded' | 'blank';

export interface IGameTile {
  coord: ICoord;
  identity: Tile;
  displayed: boolean;
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

  //   generateExcludedCoordSet(): ICoord[] {
  //     let outputCoordSet: ICoord[] = []
  //     let boatCoords: ICoord[] = this.getCoordinateSet()

  //     if (boatCoords.length === 1) {
  //         //
  //     }

  //   }
}

function generateDirection(): Direction {
  return DIRECTION_ARRAY[Math.floor(Math.random() * DIRECTION_ARRAY.length)];
}
