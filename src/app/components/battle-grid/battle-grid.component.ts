import { Component } from '@angular/core';
import { Boat } from 'src/app/models+constants/boats';
import { GAME_GRID_DIMENSION } from 'src/app/models+constants/gameConstants';
import {
  GameService,
  generateFullGrid,
} from 'src/app/services/game-service.service';

@Component({
  selector: 'battle-grid',
  templateUrl: './battle-grid.component.html',
  styleUrls: ['./battle-grid.component.scss'],
})
export class BattleGridComponent {
  constructor(private gameService: GameService) {}

  gridDimension = GAME_GRID_DIMENSION;
  gridDummyArray = this.createRange(this.gridDimension);

  printBoatList(): void {
    console.log(this.gameService.getBoatList());
  }

  printGameTiles(): void {
    console.log(this.gameService.gameTiles);
  }

  newGame(): void {
    this.gameService.initialiseNewGame();
  }

  createRange(input: number) {
    // return new Array(number);
    return new Array(input).fill(0).map((n, index) => index + 1);
  }

  getClass(x: number, y: number): string {
    return this.gameService.checkClass({ x: x, y: y });
  }

  getColCount(index: number): number {
    return this.gameService.elementCount(index, 'column');
  }

  getRowCount(index: number): number {
    return this.gameService.elementCount(index, 'row');
  }
}
