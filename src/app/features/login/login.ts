import { Component, signal } from '@angular/core';
import { AuthService } from '../../auth-service';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private authService: AuthService) {}
  loginModel = signal({
    email: '',
    password: '',
  });

  loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.email);
      required(schemaPath.password);
    },
    {
      submission: {
        action: async (field) => {
          const { email, password } = field().value();
          await firstValueFrom(this.authService.login(email, password));
        },
      },
    },
  );
}
