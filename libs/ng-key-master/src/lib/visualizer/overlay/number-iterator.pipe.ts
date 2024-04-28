import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberIterator',
  standalone: true,
})

/**
 * Pipe to create an array of numbers from 0 to the given value.
 *
 * @example ```
 *
 * @for (i of 5 | numberIterator; track i) {
 *  <p> {{ i }} </p>
 * }
 *
 * <!-- Output i: 0 1 2 3 4 -->
 * ```
 *
 */

export class NumberIteratorPipe implements PipeTransform {
  transform(value: number): Array<number> {
    const array = <number[]>[];
    for (let i = 0; i < value; i++) {
      array.push(i);
    }
    return array;
  }
}
