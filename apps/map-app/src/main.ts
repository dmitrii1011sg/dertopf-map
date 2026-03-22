const isGithubPages = window.location.hostname.includes('github.io');
const baseHref = isGithubPages ? '/dertopf-map/' : '/';

(window as any).CESIUM_BASE_URL = `${baseHref}assets/cesium/`;

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
