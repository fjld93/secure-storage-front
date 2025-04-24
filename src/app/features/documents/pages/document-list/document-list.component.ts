import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '@materials/material.imports';
import { UserDocument } from '@models/documents/user-document.model';
import { DocumentService } from '@services/document.service';
import { DocumentDetailsComponent } from "../document-details/document-details.component";


@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    DatePipe,
    DocumentDetailsComponent
],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements AfterViewInit {

  private documentService: DocumentService = inject(DocumentService);

  displayedColumns: string[] = ['name', 'updateTime', 'size'];
  dataSource = new MatTableDataSource<UserDocument>();

  selectedDocument?: UserDocument;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("sidenav") sidenav!: MatSidenav;

  constructor() {
    this.loadDocuments();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadDocuments() {
    this.documentService.getAllUserDocuments().subscribe({
      next: documents => {
        this.dataSource.data = documents;
      },
      error: err => console.error('Error al cargar documentos:', err)
    });
  }

  selectDocument(doc: UserDocument) {
    this.selectedDocument = doc;
  }

  clearSelection(){
    this.selectedDocument = undefined;
    this.sidenav.close();
  }

  toggleDocumentDetails(){
    this.sidenav.toggle()
  }

}
