import { Injectable } from '@angular/core';
import {
  Boat,
  ICoord,
  IGameTile,
  UP,
  generateExcludedCoordSet,
} from '../models+constants/boats';
import {
  CIPHER_BLOCK_OFFSET,
  GAME_BOAT_LIST,
  GAME_GRID_DIMENSION,
  MAX_CLUES,
  MIN_CLUES,
  SOLUTION_OFFSET,
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
  visibleClues: number = -1;
  solutionCode: string = '';

  initialiseNewGame(): void {
    this.freeTiles = generateFullGrid(GAME_GRID_DIMENSION);
    this.excludedTiles = [];
    this.gameTiles = [];
    this.boatList = [];
    this.visibleClues = randomIntFromInterval(MIN_CLUES, MAX_CLUES);
    this.generateBoatSet();

    this.gameTiles = this.generateGameTiles(this.boatList);
    this.enableGameMode();
    this.solutionCode = this.getSolutionCode();
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

    let visibleCellCount = randomIntFromInterval(MIN_CLUES, MAX_CLUES);
    let totalGameTiles = GAME_BOAT_LIST.reduce(
      (partialSum, a) => partialSum + a,
      0
    );

    let uniqueClues: number[] = getNonRepeatingSubset(
      visibleCellCount,
      totalGameTiles
    );

    console.log(uniqueClues);

    let indexCount = 0;

    for (let boat of boatList) {
      for (let tile of boat.getCoordinateSet()) {
        let nextTile: IGameTile = {
          coord: tile,
          direction: boat.direction,
          displayed: true,
          isClue: uniqueClues.includes(indexCount),
          identity: boat.getComponentDisplayClass(tile),
        };
        displayedTiles.push(nextTile);

        indexCount++;
      }
    }
    return displayedTiles;
  }

  checkClass(coord: ICoord): string {
    for (let gameTile of this.gameTiles) {
      if (gameTile.coord.x === coord.x && gameTile.coord.y === coord.y) {
        if (gameTile.displayed === true) {
          return gameTile.identity;
        }
      }
    }

    return '';
  }

  enableGameMode(): void {
    let replacementGameTiles: IGameTile[] = [];
    for (let gameTile of this.gameTiles) {
      let nextTile: IGameTile = {
        coord: gameTile.coord,
        direction: gameTile.direction,
        displayed: gameTile.isClue === true,
        isClue: gameTile.isClue,
        identity: gameTile.identity,
      };

      replacementGameTiles.push(nextTile);
    }

    // this.gameTiles = [];
    this.gameTiles = replacementGameTiles;
  }

  answerMode(): void {
    let replacementGameTiles: IGameTile[] = [];
    for (let gameTile of this.gameTiles) {
      let nextTile: IGameTile = {
        coord: gameTile.coord,
        direction: gameTile.direction,
        displayed: true,
        isClue: gameTile.isClue,
        identity: gameTile.identity,
      };

      replacementGameTiles.push(nextTile);
    }

    // this.gameTiles = [];
    this.gameTiles = replacementGameTiles;
  }

  elementCount(index: number, direction: 'row' | 'column'): number {
    let elementCount: number = 0;

    for (let boat of this.boatList) {
      for (let coord of boat.getCoordinateSet()) {
        if (direction === 'row') {
          if (coord.y === index) {
            elementCount += 1;
          }
        } else {
          if (coord.x === index) {
            elementCount += 1;
          }
        }
      }
    }
    return elementCount;
  }

  getSolutionCode(): string {
    let outputString: string = '';

    for (let y = 1; y <= GAME_GRID_DIMENSION; y++) {
      let rowString: string = '';
      for (let x = 1; x <= GAME_GRID_DIMENSION; x++) {
        let foundFlag = false;
        for (let tile of this.gameTiles) {
          if (tile.coord.x === x && tile.coord.y === y) {
            foundFlag = true;
          }
        }
        if (foundFlag) {
          rowString = rowString + '1';
        } else {
          rowString = rowString + '0';
        }
      }
      outputString =
        outputString +
        binToBase36WithOffset(rowString, getRowCipher(y - 1)) +
        (y < 10 ? '-' : '');
    }

    return outputString;
  }

  codeToSolutionGrid(solutionCode: string): void {
    this.gameTiles = codeToGrid(solutionCode);
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

export function isCoordinateInCoordSet(
  coord: ICoord,
  coordSet: ICoord[]
): boolean {
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

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNonRepeatingSubset(
  sampleSize: number,
  parentSetSize: number
): number[] {
  let parentSet = [...Array(parentSetSize).keys()];

  let outputSet: number[] = [];

  while (outputSet.length < sampleSize) {
    let indexNumber = randomIntFromInterval(0, parentSet.length - 1);
    outputSet.push(parentSet[indexNumber]);
    parentSet.splice(indexNumber, 1);
  }

  return outputSet;
}

function binToBase36(tenBitBin: string): string {
  return parseInt(tenBitBin, 2).toString(36);
}

function binToBase36WithOffset(
  tenBitBin: string,
  offsetDecimal: number
): string {
  let tempvalue: number = parseInt(tenBitBin, 2) + offsetDecimal;
  return tempvalue.toString(36);
}

function base36WithOffsetToTenBitBin(
  base36String: string,
  offsetDecimal: number
): string {
  let tempvalue: number = parseInt(base36String, 36) - offsetDecimal;
  return tempvalue.toString(2).padStart(10, '0');
}

function gridToCode(tenBitBinArray: string[]): string {
  let outputString: string = '';

  for (let row of tenBitBinArray) {
    outputString = outputString + '-' + binToBase36(row);
  }

  return outputString;
}

function binToBoolean(binValue: string): boolean {
  if (binValue === '1') {
    return true;
  }
  return false;
}

function codeToGrid(solutionCode: string): IGameTile[] {
  let gridGameTiles: IGameTile[] = [];

  let base36Strings: string[] = solutionCode.split('-');

  let index: number = 0;

  for (const [rowNumber, base36String] of base36Strings.entries()) {
    let binString = base36WithOffsetToTenBitBin(
      base36String,
      getRowCipher(rowNumber)
    );
    // console.log(rowNumber);
    console.log(binString);
    let binCharArray = binString.split('');
    for (let binChar of binCharArray) {
      if (binToBoolean(binChar)) {
        let newGameTile: IGameTile = {
          coord: {
            x: (index % GAME_GRID_DIMENSION) + 1,
            y: Math.floor(index / GAME_GRID_DIMENSION) + 1,
          },
          direction: UP,
          displayed: binToBoolean(binChar),
          identity: 'midsection',
          isClue: true,
        };
        gridGameTiles.push(newGameTile);
      }
      index += 1;
    }
  }

  return gridGameTiles;
}

function getRowCipher(rowNumber: number): number {
  console.log(SOLUTION_OFFSET + rowNumber * CIPHER_BLOCK_OFFSET);
  return SOLUTION_OFFSET + rowNumber * CIPHER_BLOCK_OFFSET;
  // return SOLUTION_OFFSET;
}
