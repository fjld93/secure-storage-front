import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '@materials/material.imports';
import { UserDocument } from '@models/documents/user-document.model';

@Component({
  selector: 'app-edit-document-dialog',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-document-dialog.component.html',
  styleUrl: './edit-document-dialog.component.css'
})
export class EditDocumentDialogComponent {

  private fb: FormBuilder = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<EditDocumentDialogComponent>);
  readonly data = inject<UserDocument>(MAT_DIALOG_DATA);

  errorMessage = signal("");
  documentForm: FormGroup;
  isHovered: boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string = "";

  constructor() {

    this.documentForm = this.fb.group({
      name: [this.data.name, Validators.required],
      description: [this.data.description, [Validators.required]]
    })

  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isHovered = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isHovered = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovered = false;
    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.documentForm.patchValue({ name: this.selectedFileName });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.selectedFileName = input.files[0].name;
      this.documentForm.patchValue({ name: this.selectedFileName });
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  okClick() {
    this.documentForm.touched;

    if (this.documentForm.invalid) {
      this.errorMessage.set("Name and Description are required");
    }
    else if (this.data.uuid === "" && this.selectedFileName === "") {
      this.errorMessage.set("A file must be selected");
    }
    else {
      this.errorMessage.set("");

      const newDocument = {
        ...this.documentForm.value,
        file: this.selectedFile,
      };

      this.dialogRef.close(newDocument);
    }
  }

}
