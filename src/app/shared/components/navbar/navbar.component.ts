import { Component, inject, Signal, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MATERIAL_IMPORTS } from '@materials/material.imports';
import { User } from '@models/user.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    RouterLink,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  user: Signal<User | null> = this.authService.user();

  logout(){

    this.authService.logout();
    this.router.navigate(["/"]);
  }

}
