import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MATERIAL_IMPORTS } from '@materials/material.imports';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
