import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSong } from './hero-song';

describe('HeroSong', () => {
  let component: HeroSong;
  let fixture: ComponentFixture<HeroSong>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSong]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSong);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
