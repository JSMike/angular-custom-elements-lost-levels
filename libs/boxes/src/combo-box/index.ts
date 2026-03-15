export * from './combo-box';

declare global {
  interface HTMLElementTagNameMap {
    'boxes-combo-box': import('./combo-box').ComboBoxEl;
  }
}
