import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MATERIAL_IMPORTS } from '@materials/material.imports';
import { AuthService } from '@services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);

  hide = signal(true);
  errorMessage = signal("");
  formLogin: FormGroup;
  loading = signal(false);

  constructor() {

    this.formLogin = this.fb.group({
      username: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(4)]]
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/documents']);
      return;
    }

  }

  togglePasswordVisibility() {
    this.hide.set(!this.hide());
  }

  login() {
    if (this.formLogin.invalid) {
      this.formLogin.touched;
      if (this.formLogin.controls["password"].hasError("minlength")) {
        this.errorMessage.set("Password must have at least 4 characters");
      }
    }
    else {
      this.errorMessage.set("");

      this.loading.set(true);
      this.authService.login({
        "username": this.formLogin.value.username,
        "password": this.formLogin.value.password,
      })
        .pipe(
          finalize(() => this.loading.set(false))
        )
        .subscribe(() => {
          this._snackBar.open(`Successfully logged as: ${this.authService.user()?.username}`, '', {
            duration: 2000
          })
          this.router.navigate(['/documents']);
        })
    }
  }

}
