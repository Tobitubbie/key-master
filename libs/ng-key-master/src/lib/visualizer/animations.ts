import { animate, animation, style } from '@angular/animations';

export const zoomIn = animation([
  style({
    opacity: 0,
    transform: 'translateY(50%) scale3d(.5,.5,.5)',
  }),
  animate('150ms ease-in'),
]);

export const zoomOut = animation([
  animate(
    '100ms ease-out',
    style({
      opacity: 0,
      transform: 'translateY(50%) scale3d(.5,.5,.5)',
    })
  ),
]);

export const fadeIn = animation([style({ opacity: 0 }), animate(250)]);
