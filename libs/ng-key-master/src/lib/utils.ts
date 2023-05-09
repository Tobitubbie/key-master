import { Observable, OperatorFunction, pipe, UnaryFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IgnoreTarget } from './models';

export function filterNullish<T>(): UnaryFunction<
  Observable<T | null | undefined>,
  Observable<T>
> {
  return pipe(
    filter((x) => x !== null && x !== undefined) as OperatorFunction<
      T | null | undefined,
      T
    >
  );
}

export const DEFAULT_IGNORE_TARGETS: IgnoreTarget[] = [HTMLInputElement];
