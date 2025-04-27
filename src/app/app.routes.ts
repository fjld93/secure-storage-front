import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '@auth/pages/login/login.component';
import { RegisterComponent } from '@auth/pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    {
        path: "documents",
        canActivate: [authGuard],
        loadComponent: () => import('@documents/pages/document-list/document-list.component').then(
            c => c.DocumentListComponent)
    },
    { path: "**", redirectTo: "" }
];
