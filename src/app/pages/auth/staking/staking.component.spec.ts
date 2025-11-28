import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakingComponent } from './staking.component';

describe('StakingComponent', () => {
  let component: StakingComponent;
  let fixture: ComponentFixture<StakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StakingComponent]
    });
    fixture = TestBed.createComponent(StakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
