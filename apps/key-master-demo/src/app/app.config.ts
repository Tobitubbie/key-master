import {ApplicationConfig} from '@angular/core';
import {provideRouter, withEnabledBlockingInitialNavigation,} from '@angular/router';
import {appRoutes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideKeyMaster} from "@key-master/ng-key-master";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    provideKeyMaster({
      defaultContainerStrategy: 'merge',
      defaultVisualizationStrategy: 'inline',
      globalContainerConfig: {
        name: 'GlobalOverride',
      }
    }),

    // for advanced configuration / overrides this is the way to go:
    //
    // {
    //   provide: GlobalContainer,
    //   useClass: GlobalContainerOverride,
    // },
    // {
    //   provide: DEFAULT_CONTAINER_STRATEGY,
    //   deps: [StrategyOptions],
    //   useFactory: (options: StrategyOptions) => options.exclusive,
    // },
    // {
    //   provide: DEFAULT_VISUALIZATION_STRATEGY,
    //   deps: [VisualizationStrategyOptions],
    //   useFactory: (options: VisualizationStrategyOptions) => options.noop,
    // }
  ],
};
