import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPivotTableComponent } from './my-pivot-table.component';

describe('MyPivotTableComponent', () => {
  let component: MyPivotTableComponent;
  let fixture: ComponentFixture<MyPivotTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPivotTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPivotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
