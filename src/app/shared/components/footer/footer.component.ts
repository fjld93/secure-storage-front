import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '@materials/material.imports';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MATERIAL_IMPORTS,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
