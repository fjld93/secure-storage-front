import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MATERIAL_IMPORTS } from '@materials/material.imports';
import { AuthService } from '@services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private fb: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);

  hide = signal(true);
  errorMessage = signal("");
  formRegister: FormGroup;
  loading = signal(false);

  constructor() {

    this.formRegister = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    })

  }

  togglePasswordVisibility() {
    this.hide.set(!this.hide());
  }

  register() {

    if (this.formRegister.invalid) {
      this.formRegister.touched;
      if (this.formRegister.controls["password"].hasError("minlength")) {
        this.errorMessage.set("Password must have at least 4 characters");
      }
      if (this.formRegister.controls["email"].hasError("email")) {
        this.errorMessage.set("Please, enter a valid email");
      }
    }
    else {
      this.errorMessage.set("");

      this.loading.set(true);
      this.authService.register({
        "username": this.formRegister.value.username,
        "password": this.formRegister.value.password,
        "email": this.formRegister.value.email,
      })
        .pipe(
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: () => {
            this._snackBar.open(`Successfully registered as: ${this.authService.user()?.username}`, '', {
              duration: 2000
            })
            this.router.navigate(['/']);
          },
          error: (error) => {
            this._snackBar.open(String(error), '', {
              duration: 2000
            })
          }
        })
    }

  }

}
