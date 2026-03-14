export * from './combo-box';

declare global {
  interface HTMLElementTagNameMap {
    'combo-box': import('./combo-box').ComboBoxEl;
  }
}
