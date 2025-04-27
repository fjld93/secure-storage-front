import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '@materials/material.imports';
import { UserDocument } from '@models/documents/user-document.model';
import { DocumentService } from '@services/document.service';
import { DocumentDetailsComponent } from "../document-details/document-details.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditDocumentDialogComponent } from '@documents/components/edit-document-dialog/edit-document-dialog.component';
import { FileSizePipe } from '@pipes/file-size.pipe';
import { DeleteElementDialogComponent } from '@documents/components/delete-element-dialog/delete-element-dialog.component';


@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    DatePipe,
    FileSizePipe,
    DocumentDetailsComponent,
  ],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements AfterViewInit {

  private documentService: DocumentService = inject(DocumentService);

  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'updateTime', 'size'];
  dataSource = new MatTableDataSource<UserDocument>();
  totalDocuments: number = 0;
  pageIndex: number = 0;
  pageSize: number = 20;

  selectedDocument?: UserDocument;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("sidenav") sidenav!: MatSidenav;

  constructor() {
    this.loadDocuments();
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customDocumentFilter;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  customDocumentFilter(doc: UserDocument, filter: string): boolean {

    const matchesName = doc.name.toLowerCase().includes(filter);
    const matchesDescription = doc.description.toLowerCase().includes(filter);

    const matchesMetadata = doc.metadata?.some(meta =>
      meta.name?.toLowerCase().includes(filter) ||
      meta.value?.toLowerCase().includes(filter)
    ) ?? false;

    return matchesName || matchesDescription || matchesMetadata;
  }

  loadDocuments(pageIndex: number = this.pageIndex, pageSize: number = this.pageSize) {
    this.documentService.getAllUserDocuments(pageIndex, pageSize).subscribe(
      response => {
        this.dataSource.data = response.content;
        this.totalDocuments = response.totalElements;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadDocuments();
  }

  selectDocument(doc: UserDocument) {
    this.selectedDocument = doc;
  }

  clearSelection() {
    this.selectedDocument = undefined;
    this.sidenav.close();
  }

  toggleDocumentDetails() {
    this.sidenav.toggle()
  }

  openEditDialog(doc: UserDocument = { uuid: "", name: "", description: "", size: 0 }) {
    const dialogRef = this.dialog.open(EditDocumentDialogComponent, {
      height: doc.uuid !== "" ? "50%" : "60%",
      width: "30%",
      maxHeight: doc.uuid !== "" ? "330px" : "430px",
      data: doc,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (doc.uuid) {
          const { name, description } = result;
          this.updateDocument(doc.uuid, { name, description });
        }
        else {
          const { name, description, file } = result;
          this.createDocument(name, description, file);
        }
      }
    });
  }

  deleteElementDialog(doc: UserDocument) {
    const dialogRef = this.dialog.open(DeleteElementDialogComponent, { width: "30%", });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentService.deleteDocument(doc.uuid).subscribe(() => {
          const index = this.dataSource.data.findIndex(d => d.uuid === doc.uuid);
          if (index > -1) {
            const updatedSource = [...this.dataSource.data];
            updatedSource.splice(index, 1);
            this.dataSource.data = updatedSource;
            this.clearSelection();
          }
        });
      }
    });
  }

  updateDocument(documentUuid: string, updatedDocument: Partial<Pick<UserDocument, 'name' | 'description'>>) {

    this.documentService.updateDocument(documentUuid, updatedDocument).subscribe(
      (newDocument) => {
        const index = this.dataSource.data.findIndex(doc => doc.uuid === newDocument.uuid);

        if (index > -1) {
          const updatedSource = [...this.dataSource.data];
          updatedSource[index] = newDocument;
          this.dataSource.data = updatedSource;
        }
        this.clearSelection();
      });
  }

  createDocument(name: string, description: string, file: File) {

    const newDocument = {
      name,
      description,
      content: file,
    };

    this.documentService.createDocument(newDocument).subscribe(
      (createdDocument) => {
        this.dataSource.data = [...this.dataSource.data, createdDocument];
        this.clearSelection();
      });
  }

  downloadDocument(document: UserDocument) {
    this.documentService.getDocumentContent(document.uuid).subscribe(
      (content) => {
        const blobUrl = window.URL.createObjectURL(content);
        const a = window.document.createElement('a');
        a.href = blobUrl;
        a.download = document.name;
        a.style.display = 'none';
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        window.document.body.removeChild(a);
      });
  }

}
