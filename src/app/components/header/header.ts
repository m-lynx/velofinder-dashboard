import { Component, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly authService = inject(AuthService);

  readonly session = this.authService.session;
  readonly siteUrl = environment.siteUrl;

  handleSignOut(): void {
    this.authService.signOut().subscribe();
  }
}
