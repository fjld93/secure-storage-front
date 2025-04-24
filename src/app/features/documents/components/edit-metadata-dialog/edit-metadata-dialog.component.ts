import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '@materials/material.imports';
import { Metadata } from '@models/documents/metadata.model';

@Component({
  selector: 'app-edit-metadata-dialog',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-metadata-dialog.component.html',
  styleUrl: './edit-metadata-dialog.component.css'
})
export class EditMetadataDialogComponent {

  private fb: FormBuilder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<EditMetadataDialogComponent>);
  readonly data = inject<Metadata>(MAT_DIALOG_DATA);

  errorMessage = signal("");
  metadataForm: FormGroup;

  constructor() {

    this.metadataForm = this.fb.group({
      name: [this.data.name, Validators.required],
      value: [this.data.value, [Validators.required]]
    })

  }

  onNoClick() {
    this.dialogRef.close();
  }

  okClick() {
    this.metadataForm.touched;
    
    if (this.metadataForm.invalid) {
      this.errorMessage.set("Name and Value are required");
    }
    else {
      this.errorMessage.set("");
      this.dialogRef.close(this.metadataForm.value);
    }
  }

}
