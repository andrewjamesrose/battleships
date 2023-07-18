import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Boat } from 'src/app/models+constants/boats';
import { GAME_GRID_DIMENSION } from 'src/app/models+constants/gameConstants';
import { GameService } from 'src/app/services/game-service.service';

@Component({
  selector: 'battle-grid',
  templateUrl: './battle-grid.component.html',
  styleUrls: ['./battle-grid.component.scss'],
})
export class BattleGridComponent {
  constructor(private gameService: GameService, private activatedRoute: ActivatedRoute) {
    if(this.activatedRoute.snapshot.url.length > 0){
        if(this.activatedRoute.snapshot.url[0].path === 'develop'){
            this.developMode = true
        }
    }
  }

  ngOnInit() {
    this.gameService.initialiseNewGame();
    this.solutionCode = this.gameService.solutionCode;
  }

  developMode: boolean = false
  gridDimension = GAME_GRID_DIMENSION;
  gridDummyArray = this.createRange(this.gridDimension);
  solutionCode: string = '';

  printBoatList(): void {
    console.log(this.gameService.getBoatList());
  }

  printGameTiles(): void {
    console.log(this.gameService.gameTiles);
  }

  enableGameMode(): void {
    this.gameService.enableGameMode();
  }

  enableSolutionMode(): void {
    this.gameService.answerMode();
  }

  testShowSolution(): void {
    let solutionString = '27-1J-AG-AG-A7-AS-33-1N-MN-1I';
    this.gameService.codeToSolutionGrid(solutionString);
  }

  newGame(): void {
    this.gameService.initialiseNewGame();
    this.solutionCode = this.gameService.solutionCode;
  }

  createRange(input: number) {
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

  getSolutionCode(): string {
    return this.getSolutionCode();
  }
}
