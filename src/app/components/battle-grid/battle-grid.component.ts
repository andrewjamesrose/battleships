import { Component } from '@angular/core';
import { Boat } from 'src/app/models+constants/boats';
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

  testClick(): void {
    // let testBoat = new Boat({ x: 5, y: 6 }, 1);
    // console.log(generateFullGrid(10));
  }

  printBoatList(): void {
    console.log(this.gameService.getBoatList());
  }

  newGame(): void {
    this.gameService.initialiseNewGame();
  }
}
