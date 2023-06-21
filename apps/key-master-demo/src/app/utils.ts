export function getFirstFocusableIn(element: Element) {
  return Array.from(element.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'))
    .filter((el): el is HTMLElement => el instanceof HTMLElement
      && !el.hasAttribute('disabled')
      && !el.getAttribute('aria-hidden'))[0];
}
