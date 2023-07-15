import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BattleGridComponent } from './components/battle-grid/battle-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    BattleGridComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
