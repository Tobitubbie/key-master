import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'key-master-list-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-navigation.component.html',
  styleUrl: './list-navigation.component.scss',
})
export class ListNavigationComponent {
  test() {
    console.log('got me')
  }
}
