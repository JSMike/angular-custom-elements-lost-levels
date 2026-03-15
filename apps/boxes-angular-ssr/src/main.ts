import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
import '@/boxes/combobox.js';
import '@/boxes/checkbox.js';
import '@/boxes/multi-select.js';
import '@/boxes/calendar-picker.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
