import { Injectable } from '@angular/core';
import {
  Boat,
  ICoord,
  IGameTile,
  UP,
  generateExcludedCoordSet,
} from '../models+constants/boats';
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
  gameTiles: IGameTile[] = [];

  initialiseNewGame(): void {
    this.freeTiles = generateFullGrid(GAME_GRID_DIMENSION);
    this.excludedTiles = [];
    this.gameTiles = [];
    this.boatList = [];
    this.generateBoatSet();
    this.gameTiles = this.generateGameTiles(this.boatList);
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

          this.movePointSetToExclusions(generateExcludedCoordSet(newBoat));
          // generate exclusions and move those
          // to be implemented
          boatAddedSuccessfully = true;
        }
      }
    }
  }

  getBoatList(): Boat[] {
    return this.boatList;
  }

  generateGameTiles(boatList: Boat[]): IGameTile[] {
    let displayedTiles: IGameTile[] = [];

    for (let boat of boatList) {
      for (let tile of boat.getCoordinateSet()) {
        let nextTile: IGameTile = {
          coord: tile,
          direction: UP,
          displayed: true,
          identity: 'midsection',
        };
        displayedTiles.push(nextTile);
      }
    }
    return displayedTiles;
  }

  checkClass(coord: ICoord): string {
    let populatedTiles: ICoord[] = this.gameTiles.map((tile) => tile.coord);

    if (isCoordinateInCoordSet(coord, populatedTiles)) {
      return 'boat';
    } else {
      return '';
    }
  }
}

export function isInBounds(coordSet: ICoord[]): boolean {
  for (let coord of coordSet) {
    if (
      coord.x < 1 ||
      coord.y < 1 ||
      coord.x > GAME_GRID_DIMENSION ||
      coord.y > GAME_GRID_DIMENSION
    ) {
      return false;
    }
  }
  return true;
}

export function isCoordInBounds(coord: ICoord): boolean {
  if (
    coord.x < 1 ||
    coord.y < 1 ||
    coord.x > GAME_GRID_DIMENSION ||
    coord.y > GAME_GRID_DIMENSION
  ) {
    return false;
  } else {
    return true;
  }
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
