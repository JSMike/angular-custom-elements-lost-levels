export * from './checkbox';

declare global {
  interface HTMLElementTagNameMap {
    'boxes-checkbox': import('./checkbox').CheckboxEl;
  }
}
