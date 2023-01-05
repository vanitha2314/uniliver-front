import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PivotResultComponent } from './pivot-result.component';

describe('PivotResultComponent', () => {
  let component: PivotResultComponent;
  let fixture: ComponentFixture<PivotResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PivotResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PivotResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
