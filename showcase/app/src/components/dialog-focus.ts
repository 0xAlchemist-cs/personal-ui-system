import type { KeyboardEvent } from 'react';

/** Close the Tab boundary before browser chrome can receive focus. */
export function containDialogTab(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey ||
    event.defaultPrevented || !(event.target instanceof HTMLElement)) return;
  const dialog = event.target.closest('[role="dialog"]');
  if (!dialog) return;

  const controls = [...dialog.querySelectorAll<HTMLElement>(
    'a[href], button, input, select, textarea, [tabindex]',
  )].filter((element) =>
    element.tabIndex >= 0 && !element.matches(':disabled') &&
    element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden',
  );
  const first = controls[0];
  const last = controls.at(-1);
  const destination = event.shiftKey && event.target === first ? last
    : !event.shiftKey && event.target === last ? first : undefined;
  if (destination) {
    event.preventDefault();
    destination.focus();
  }
}
