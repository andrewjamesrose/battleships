import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GAME_GRID_DIMENSION } from 'src/app/models+constants/gameConstants';
import { GameService } from 'src/app/services/game-service.service';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.scss'],
})
export class SolutionsComponent {
  solutionCode: string = '';

  isValid = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private gameService: GameService
  ) {
    this.solutionCode = this.activatedRoute.snapshot.params['solutionCode'];
    //check if it's a valid solution
    if (this.isValid) {
      this.gameService.codeToSolutionGrid(this.solutionCode);
    }
  }

  gridDimension = GAME_GRID_DIMENSION;
  gridDummyArray = this.createRange(this.gridDimension);

  getClass(x: number, y: number): string {
    return this.gameService.checkClass({ x: x, y: y });
  }

  createRange(input: number) {
    return new Array(input).fill(0).map((n, index) => index + 1);
  }
}

export function isValidSolutionString() {}
