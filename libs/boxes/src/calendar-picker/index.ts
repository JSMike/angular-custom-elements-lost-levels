export * from './calendar-picker';

declare global {
  interface HTMLElementTagNameMap {
    'boxes-calendar-picker': import('./calendar-picker').CalendarPickerEl;
  }
}
