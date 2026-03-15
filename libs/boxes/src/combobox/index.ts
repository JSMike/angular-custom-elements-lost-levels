export * from './combobox';

declare global {
  interface HTMLElementTagNameMap {
    'boxes-combobox': import('./combobox').ComboboxEl;
  }
}
