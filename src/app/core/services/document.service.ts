import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Metadata } from '@models/documents/metadata.model';
import { UserDocument } from '@models/documents/user-document.model';
import { Page } from '@models/page.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private http: HttpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/documents`;

  getAllUserDocuments(page: number = 0, size: number = 20): Observable<Page<UserDocument>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http
      .get<Page<UserDocument>>(`${this.baseUrl}/user`, { params });
  }

  getDocument(documentUuid: string): Observable<UserDocument> {
    return this.http
      .get<UserDocument>(`${this.baseUrl}/${documentUuid}`);
  }

  getDocumentMetadata(documentUuid: string): Observable<Metadata[]> {
    return this.http
      .get<Metadata[]>(`${this.baseUrl}/${documentUuid}/metadata`);
  }

  getDocumentContent(documentUuid: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${documentUuid}/content`, {
      responseType: 'blob'
    });
  }

  createDocument(document: Omit<UserDocument, 'uuid'>): Observable<UserDocument> {
    const formData = new FormData();
    formData.append('file', document.content!);
    formData.append('name', document.name);
    formData.append('description', document.description);

    return this.http
      .post<UserDocument>(`${this.baseUrl}`, formData);
  }

  updateDocument(documentUuid: string,
    updates: Partial<Pick<UserDocument, 'name' | 'description'>>): Observable<UserDocument> {
    return this.http
      .put<UserDocument>(`${this.baseUrl}/${documentUuid}`, updates);
  }

  deleteDocument(documentUuid: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${documentUuid}`);
  }

  addMetadata(documentUuid: string, metadata: Metadata): Observable<Metadata> {
    return this.http
      .post<Metadata>(`${this.baseUrl}/${documentUuid}/metadata`, metadata);
  }

  updateMetadata(metadataUuid: string,
    metadata: Partial<Pick<Metadata, 'name' | 'value'>>): Observable<Metadata> {
    return this.http
      .put<Metadata>(`${this.baseUrl}/metadata/${metadataUuid}`, metadata);
  }

  deleteMetadata(metadataUuid: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/metadata/${metadataUuid}`);
  }

}
