import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictsComponent } from './conflicts.component';

describe('ConflictsComponent', () => {
  let component: ConflictsComponent;
  let fixture: ComponentFixture<ConflictsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConflictsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
