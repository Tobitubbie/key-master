import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {Container, provideKeyMaster} from "@key-master/ng-key-master";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideKeyMaster({
      defaultContainerStrategy: 'merge',
      defaultVisualizationStrategy: 'inline',
      globalContainer: () => new Container("GlobalOverwrite", document.documentElement)
    }),
  ],
};
