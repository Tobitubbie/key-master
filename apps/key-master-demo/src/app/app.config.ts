import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideKeyMaster} from "@key-master/ng-key-master";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideKeyMaster({
      defaultContainerStrategy: 'exclusive',
      defaultVisualizationStrategy: 'inline'
    }),
  ],
};
