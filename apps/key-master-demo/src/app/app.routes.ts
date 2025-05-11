import { Route } from '@angular/router';
import { ListNavigationComponent } from './demo-pages/list-navigation.component';
import { PlaygroundComponent } from './playground.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: PlaygroundComponent
  },
  {
    path: 'demo/list',
    component: ListNavigationComponent
  }
];
