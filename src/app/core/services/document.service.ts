import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Metadata } from '@models/documents/metadata.model';
import { UserDocument } from '@models/documents/user-document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private http: HttpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(`Status: ${error.status}, error: ${error.message}`));
  }

  getAllUserDocuments(): Observable<UserDocument[]> {
    return this.http
      .get<UserDocument[]>(`${this.baseUrl}/user`)
      .pipe(catchError(this.handleError));
  }

  getDocument(documentUuid: string): Observable<UserDocument> {
    return this.http
      .get<UserDocument>(`${this.baseUrl}/${documentUuid}`)
      .pipe(catchError(this.handleError));
  }

  getDocumentMetadata(documentUuid: string): Observable<Metadata[]> {
    return this.http
      .get<Metadata[]>(`${this.baseUrl}/${documentUuid}/metadata`)
      .pipe(catchError(this.handleError));
  }

  getDocumentContent(documentUuid: string): Observable<string> {
    return this.http
      .get<{ content: string }>(`${this.baseUrl}/${documentUuid}/content`)
      .pipe(
        map(response => response.content),
        catchError(this.handleError));
  }

  createDocument(document: Omit<UserDocument, 'uuid'>): Observable<UserDocument> {
    return this.http
      .post<UserDocument>(`${this.baseUrl}/documents`, document)
      .pipe(catchError(this.handleError));
  }

  updateDocument(documentUuid: string,
                  updates: Partial<Pick<UserDocument, 'name' | 'description'>>): Observable<UserDocument> {
    return this.http
      .put<UserDocument>(`${this.baseUrl}/${documentUuid}`, updates)
      .pipe(catchError(this.handleError));
  }

  deleteDocument(documentUuid: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${documentUuid}`)
      .pipe(catchError(this.handleError));
  }

  addMetadata(documentUuid: string, metadata: Metadata): Observable<Metadata> {
    return this.http
      .post<Metadata>(`${this.baseUrl}/${documentUuid}/metadata`, metadata)
      .pipe(catchError(this.handleError));
  }

  updateMetadata(metadataUuid: string, metadata: Metadata): Observable<Metadata> {
    return this.http
      .put<Metadata>(`${this.baseUrl}/metadata/${metadataUuid}`, metadata)
      .pipe(catchError(this.handleError));
  }

  deleteMetadata(metadataUuid: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/metadata/${metadataUuid}`)
      .pipe(catchError(this.handleError));
  }

}
