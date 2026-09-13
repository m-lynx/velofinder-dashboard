import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_ITEMS } from './sidebar.consts';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  navItems = NAV_ITEMS;
}
