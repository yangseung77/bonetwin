import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoneCalcComponent } from './bone-calc.component';

describe('BoneCalcComponent', () => {
  let component: BoneCalcComponent;
  let fixture: ComponentFixture<BoneCalcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoneCalcComponent]
    });
    fixture = TestBed.createComponent(BoneCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
