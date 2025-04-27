import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DeleteElementDialogComponent } from '@documents/components/delete-element-dialog/delete-element-dialog.component';
import { EditMetadataDialogComponent } from '@documents/components/edit-metadata-dialog/edit-metadata-dialog.component';
import { MATERIAL_IMPORTS } from '@materials/material.imports';
import { Metadata } from '@models/documents/metadata.model';
import { UserDocument } from '@models/documents/user-document.model';
import { FileSizePipe } from "@pipes/file-size.pipe";
import { DocumentService } from '@services/document.service';

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    DatePipe,
    FileSizePipe,
    TitleCasePipe,
  ],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css'
})
export class DocumentDetailsComponent {

  private documentService: DocumentService = inject(DocumentService);
  private _snackBar = inject(MatSnackBar);

  readonly dialog = inject(MatDialog);

  @Input() document!: UserDocument;
  @Output() close = new EventEmitter<void>();

  closeSidenav() {
    this.close.emit();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['document'] && this.selectedTabIndex === 1) {
  //     this.loadMetadata();
  //   }
  // }

  // onTabChange(event: MatTabChangeEvent) {
  //   this.selectedTabIndex = event.index;
  //   if (event.index === 1) {
  //     this.loadMetadata();
  //   }
  // }

  loadMetadata() {
    if (document) {
      this.documentService.getDocumentMetadata(this.document.uuid).subscribe(
        (docMetadata) => {
          this.document.metadata = docMetadata
        });
    }
  }

  openEditDialog(md: Metadata = { uuid: "", name: "", value: "" }) {
    const dialogRef = this.dialog.open(EditMetadataDialogComponent, {
      height: "50%",
      width: "30%",
      maxHeight: "330px",
      data: md,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (md.uuid) {
          this.updatedMetadata(md.uuid, result);
        }
        else {
          this.addMetadata(this.document.uuid, result);
        }
      }
    });
  }

  deleteElementDialog(md: Metadata) {
    const dialogRef = this.dialog.open(DeleteElementDialogComponent, { width: "30%", });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentService.deleteMetadata(md.uuid).subscribe(
          () => {
            const index = this.document.metadata?.findIndex(m => m.uuid === md.uuid) ?? -1;
            if (index !== -1) this.document.metadata!.splice(index, 1);
          });
      }
    });
  }

  updatedMetadata(uuid: string, newMetadata: Metadata) {
    this.documentService.updateMetadata(uuid, newMetadata).subscribe(
      (metadataUpdated) => {
        const index = this.document.metadata?.findIndex(m => m.uuid === metadataUpdated.uuid) ?? -1;
        if (index !== -1) this.document.metadata![index] = metadataUpdated;
      });
  }

  addMetadata(documentUuid: string, metadata: Metadata) {
    this.documentService.addMetadata(documentUuid, metadata).subscribe(
      (newMetadata) => {
        if (this.document.metadata) this.document.metadata.push(newMetadata);
        else this.document.metadata = [newMetadata];
      });
  }

}
