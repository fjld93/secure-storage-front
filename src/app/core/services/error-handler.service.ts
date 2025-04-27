import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private _snackBar = inject(MatSnackBar);

  showErrorMessage(error: string) {
    this._snackBar.open(String(error), '', {
      duration: 2000,
      panelClass: ['error-snackbar']
    })
  }

  handleHttpError(error: HttpErrorResponse) {

    const alternativeMsg: string = error.statusText.toUpperCase() !== "OK"
      ? error.statusText
      : `Error ${error.status}`;

    if (error.error instanceof Blob) {

      error.error.text().then(text => {
        const errorObj = JSON.parse(text);
        const message = errorObj.message ?? alternativeMsg;
        this.showErrorMessage(message);
      })
      .catch(() => {
        this.showErrorMessage(alternativeMsg);
      });

    } else {
      const message = error.error.message ?? alternativeMsg;
      this.showErrorMessage(message);
    }
  }

}
