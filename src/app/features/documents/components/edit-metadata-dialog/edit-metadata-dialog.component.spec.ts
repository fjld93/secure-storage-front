import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMetadataDialogComponent } from './edit-metadata-dialog.component';

describe('EditMetadataDialogComponent', () => {
  let component: EditMetadataDialogComponent;
  let fixture: ComponentFixture<EditMetadataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMetadataDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMetadataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
