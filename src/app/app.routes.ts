import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';

export const routes: Routes = [
    { path: "", component: AppComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
];
