import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminSession, AuthService } from '../../auth-service';
import { Header } from './header';

const adminSession: AdminSession = {
  email: 'anna@example.com',
  firstName: 'Anna',
  id: 'user-1',
  lastName: 'Nowak',
  role: 'ADMIN',
};

const renderHeader = async () => {
  const authService = {
    session: signal<AdminSession | null>(adminSession),
    signOut: vi.fn(() => {
      return of(undefined);
    }),
  };

  await TestBed.configureTestingModule({
    imports: [Header],
    providers: [{ provide: AuthService, useValue: authService }],
  }).compileComponents();

  const fixture = TestBed.createComponent(Header);

  await fixture.whenStable();

  return { authService, element: fixture.nativeElement as HTMLElement };
};

describe('Header', () => {
  it('shows the signed-in admin', async () => {
    const { element } = await renderHeader();

    expect(element.textContent).toContain('Anna');
  });

  it('signs out when the sign-out button is clicked', async () => {
    const { authService, element } = await renderHeader();

    const signOutButton = Array.from(element.querySelectorAll('button')).find((button) => {
      return button.textContent?.trim() === 'Wyloguj';
    });

    signOutButton?.click();

    expect(signOutButton).toBeDefined();
    expect(authService.signOut).toHaveBeenCalledOnce();
  });
});
