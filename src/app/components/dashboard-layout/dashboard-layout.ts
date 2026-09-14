import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './dashboard-layout.html',
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
})
export class DashboardLayout {}
