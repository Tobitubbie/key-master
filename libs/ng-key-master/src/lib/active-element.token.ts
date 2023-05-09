import {DOCUMENT} from '@angular/common';
import {inject, InjectionToken} from '@angular/core';
import {fromEvent, merge, Observable} from 'rxjs';
import {debounceTime, map, shareReplay, startWith,} from 'rxjs/operators';

export type ActiveElement = Element | null;

export const ACTIVE_ELEMENT = new InjectionToken<Observable<ActiveElement>>(
  'ACTIVE_ELEMENT',
  {
    providedIn: 'root',
    factory() {
      const doc = inject(DOCUMENT);

      return merge(
        fromEvent(doc, 'focus', {capture: true}).pipe(map(() => true)),
        fromEvent(doc, 'blur', {capture: true}).pipe(map(() => false))
      ).pipe(
        // switching focus fires blur-event in between -> debounceTime filters this unintended event-fire
        debounceTime(1),
        startWith(doc.activeElement),
        map(() => doc.activeElement),
        shareReplay({refCount: true, bufferSize: 1})
      );
    },
  }
);
