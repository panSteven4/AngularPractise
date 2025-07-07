import {Component, inject, signal} from '@angular/core';
import {AuthService} from '../../services/auth-service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/input';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-page',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatProgressSpinner,
    MatError
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  loginError = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('alice@example.com', [Validators.required, Validators.email]),
    password: new FormControl('password123', [Validators.required])
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.loginError.set(null); // Clear previous errors
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: (user) => {
          console.log('Logged in as:', user.username);
          this.loading.set(false);
          this.router.navigate(['/songs']);
        },
        error: (err) => {
          this.loading.set(false);
          this.loginError.set(err.message || 'Login failed.');
        }
      });
    }
  }
}
