import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BattleGridComponent } from './components/battle-grid/battle-grid.component';
import { Routes, RouterModule } from '@angular/router';
import { SolutionsComponent } from './components/solutions/solutions.component';

const appRoutes: Routes = [
  { path: '', component: BattleGridComponent },
  { path: 'develop', component: BattleGridComponent },
  { path: 'solution', component: SolutionsComponent },
  { path: 'solution/:solutionCode', component: SolutionsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  declarations: [AppComponent, BattleGridComponent, SolutionsComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
