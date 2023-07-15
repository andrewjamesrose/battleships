import { Injectable } from '@angular/core';
import { Boat, ICoord } from '../models+constants/boats';
import {
  GAME_BOAT_LIST,
  GAME_GRID_DIMENSION,
} from '../models+constants/gameConstants';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor() {}

  freeTiles: ICoord[] = [];
  excludedTiles: ICoord[] = [];
  boatList: Boat[] = [];

  initialiseNewGame(): void {
    this.freeTiles = generateFullGrid(GAME_GRID_DIMENSION);
    this.excludedTiles = [];
    this.generateBoatSet();
  }

  isBoatValid(newBoat: Boat): boolean {
    let test1 = isInBounds(newBoat.getCoordinateSet());
    let test2 = this.isInFreeSpace(newBoat.getCoordinateSet());

    return test1 && test2;
  }

  isInFreeSpace(coordSet: ICoord[]): boolean {
    for (let coord of coordSet) {
      if (isCoordinateInCoordSet(coord, this.excludedTiles)) {
        return false;
      }
    }
    return true;
  }

  movePointToExclusions(coord: ICoord): void {
    this.freeTiles = this.freeTiles.filter((freeCoord) => {
      return !(freeCoord.x === coord.x && freeCoord.y == coord.y);
    });

    this.excludedTiles.push(coord);
  }

  movePointSetToExclusions(coordSet: ICoord[]): void {
    for (let coord of coordSet) {
      this.movePointToExclusions(coord);
    }
  }

  generateBoatSet(): void {
    for (let boatLength of GAME_BOAT_LIST) {
      let boatAddedSuccessfully: boolean = false;

      while (!boatAddedSuccessfully) {
        let sternCoord = randomCoordFromSet(this.freeTiles);
        let newBoat = new Boat(sternCoord, boatLength);

        if (this.isBoatValid(newBoat)) {
          this.boatList.push(newBoat);
          this.movePointSetToExclusions(newBoat.getCoordinateSet());
          // generate exclusions

          // move boat coordinates to the exclusion list

          //
          boatAddedSuccessfully = true;
        }
      }
    }
  }

  getBoatList(): Boat[] {
    return this.boatList;
  }
}

function isInBounds(coordSet: ICoord[]): boolean {
  for (let coord of coordSet) {
    if (coord.x < 0 || coord.y < 0) {
      return false;
    }
  }
  return true;
}

export function generateFullGrid(gridSize: number): ICoord[] {
  let newGrid: ICoord[] = [];

  for (let x = 1; x <= gridSize; x++) {
    for (let y = 1; y <= gridSize; y++) {
      newGrid.push({ x: x, y: y });
    }
  }

  return newGrid;
}

function isCoordinateInCoordSet(coord: ICoord, coordSet: ICoord[]): boolean {
  for (let listElement of coordSet) {
    if (coord.x === listElement.x && coord.y === listElement.y) {
      return true;
    }
  }
  return false;
}

function randomCoordFromSet(coordSet: ICoord[]): ICoord {
  return coordSet[Math.floor(Math.random() * coordSet.length)];
}
