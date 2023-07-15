import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleGridComponent } from './battle-grid.component';

describe('BattleGridComponent', () => {
  let component: BattleGridComponent;
  let fixture: ComponentFixture<BattleGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BattleGridComponent]
    });
    fixture = TestBed.createComponent(BattleGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
