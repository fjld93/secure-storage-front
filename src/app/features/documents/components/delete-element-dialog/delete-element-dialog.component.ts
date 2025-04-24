import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_IMPORTS } from '@materials/material.imports';

@Component({
  selector: 'app-delete-element-dialog',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,    
  ],
  templateUrl: './delete-element-dialog.component.html',
  styleUrl: './delete-element-dialog.component.css'
})
export class DeleteElementDialogComponent {

  readonly dialogRef = inject(MatDialogRef<DeleteElementDialogComponent>);

}
