export * from './multi-select';

declare global {
  interface HTMLElementTagNameMap {
    'boxes-multi-select': import('./multi-select').MultiSelectEl;
  }
}
