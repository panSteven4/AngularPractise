import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyPlayedList } from './already-played-list';

describe('AlreadyPlayedList', () => {
  let component: AlreadyPlayedList;
  let fixture: ComponentFixture<AlreadyPlayedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlreadyPlayedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadyPlayedList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
