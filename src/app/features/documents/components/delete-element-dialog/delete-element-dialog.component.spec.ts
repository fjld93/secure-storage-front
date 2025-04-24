import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteElementDialogComponent } from './delete-element-dialog.component';

describe('DeleteElementDialogComponent', () => {
  let component: DeleteElementDialogComponent;
  let fixture: ComponentFixture<DeleteElementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteElementDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteElementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
