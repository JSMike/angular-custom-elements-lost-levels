import '@/boxes/combo-box.js';
import '@/boxes/checkbox.js';
import '@/boxes/select-multiple.js';
import '@/boxes/calendar-picker.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
