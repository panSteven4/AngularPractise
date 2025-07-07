import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar'; // For App Component
import { MatButtonModule } from '@angular/material/button';   // For App/Login Components
import { MatIconModule } from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';     // For App Component (optional)

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(ReactiveFormsModule, MatToolbarModule, MatButtonModule, MatIconModule)

  ]
};
