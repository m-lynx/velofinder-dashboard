export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Przegląd' },
  { href: '/dashboard/users', label: 'Użytkownicy' },
  { href: '/dashboard/events', label: 'Wydarzenia' },
  {
    href: '/dashboard/users/pending',
    label: 'Oczekujący',
  },
];
