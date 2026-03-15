export * from './select-multiple';

declare global {
  interface HTMLElementTagNameMap {
    'boxes-select-multiple': import('./select-multiple').SelectMultipleEl;
  }
}
