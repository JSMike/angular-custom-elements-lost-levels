import { html, LitElement, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import hostStyles from './calendar-picker.scss?inline';

export const CalendarPicker = 'boxes-calendar-picker';

export type CalendarPickerOption = {
  disabled: boolean;
  label: string;
  value: string;
};

@customElement(CalendarPicker)
export class CalendarPickerEl extends LitElement {
  static override styles = unsafeCSS(hostStyles);
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static formAssociated = true;
  private static _calendarPickerId = 0;

  @property({ type: Boolean, reflect: true }) public disabled = false;
  @property({ type: Boolean, reflect: true }) public fullwidth = false;
  @property({ reflect: true }) public name = '';
  @property({ reflect: true }) public placeholder = 'Choose a date';
  @property({ type: Boolean, reflect: true }) public required = false;

  @state() private _activeIndex = -1;
  @state() private _open = false;
  @state() private _options: CalendarPickerOption[] = [];
  @state() private _selectedIndex = -1;

  @query('.calendar-trigger') private _triggerEl!: HTMLButtonElement;

  private readonly _baseId = `${CalendarPicker}-${(CalendarPickerEl._calendarPickerId += 1)}`;
  private readonly _internals: ElementInternals;
  private _defaultSelectedIndex = -1;
  private _formDisabled = false;

  public constructor() {
    super();
    this._internals = this.attachInternals();
  }

  public get form() {
    return this._internals.form;
  }

  public get labels() {
    return this._internals.labels;
  }

  public get type() {
    return this.localName;
  }

  public get validationMessage() {
    return this._internals.validationMessage;
  }

  public get validity() {
    return this._internals.validity;
  }

  public get value() {
    return this._options[this._selectedIndex]?.value ?? '';
  }

  public set value(nextValue: string) {
    this._selectByValue(nextValue, false);
  }

  public get willValidate() {
    return this._internals.willValidate;
  }

  public override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focus', this._handleHostFocus);
    this._syncHostFocusability();
    this._syncOptionsFromLightDom();
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focus', this._handleHostFocus);
  }

  public override focus(options?: FocusOptions) {
    this._triggerEl?.focus(options);
  }

  public checkValidity() {
    return this._internals.checkValidity();
  }

  public formDisabledCallback(disabled: boolean) {
    this._formDisabled = disabled;
    this._syncHostFocusability();
    this._updateFormState();

    if (disabled) {
      this._updateOpenState(false);
    }
  }

  public formResetCallback() {
    this._commitSelection(this._defaultSelectedIndex, false);
    this._updateOpenState(false);
  }

  public formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') {
      this._selectByValue(state, false);
    }
  }

  public reportValidity() {
    return this._internals.reportValidity();
  }

  protected override updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('disabled') ||
      changedProperties.has('required')
    ) {
      this._syncHostFocusability();
      this._updateFormState();
    }
  }

  override render() {
    const selectedOption = this._options[this._selectedIndex];
    const controlLabelIds =
      this.getAttribute('aria-labelledby') ?? this._getAssociatedLabelIds();
    const ariaLabel = controlLabelIds
      ? undefined
      : (this.getAttribute('aria-label') ?? undefined);

    return html`
      <div class="calendar-picker ${this._open ? 'open' : ''}">
        <button
          id="${this._getTriggerId()}"
          class="calendar-trigger"
          type="button"
          aria-controls="${this._getPanelId()}"
          aria-expanded="${String(this._open)}"
          aria-haspopup="dialog"
          aria-invalid="${String(!this.validity.valid)}"
          aria-label="${ifDefined(ariaLabel)}"
          aria-labelledby="${ifDefined(controlLabelIds || undefined)}"
          aria-required="${ifDefined(this.required ? 'true' : undefined)}"
          ?disabled="${this._isDisabled()}"
          @blur="${this._handleFocusOut}"
          @click="${this._handleTriggerClick}"
          @keydown="${this._handleTriggerKeyDown}"
        >
          <span class="${selectedOption ? 'calendar-value' : 'calendar-placeholder'}">
            ${selectedOption?.label ?? this.placeholder}
          </span>
        </button>

        <div
          id="${this._getPanelId()}"
          class="calendar-panel"
          role="dialog"
          aria-labelledby="${ifDefined(controlLabelIds || undefined)}"
          @focusout="${this._handleFocusOut}"
        >
          <div class="calendar-grid">
            ${this._options.map((option, index) => {
              const isActive = index === this._activeIndex;
              const isSelected = index === this._selectedIndex;

              return html`
                <button
                  class="calendar-date ${isActive ? 'date-current' : ''}"
                  type="button"
                  tabindex="-1"
                  data-index="${index}"
                  aria-disabled="${String(option.disabled)}"
                  aria-pressed="${String(isSelected)}"
                  ?disabled="${option.disabled}"
                  @click="${this._handleDateClick}"
                  @mousedown="${this._handleDateMouseDown}"
                >
                  ${option.label}
                </button>
              `;
            })}
          </div>
        </div>

        <slot hidden @slotchange="${this._handleOptionsSlotChange}"></slot>
      </div>
    `;
  }

  private _commitSelection(index: number, emitChange: boolean) {
    const normalizedIndex = this._normalizeSelectionIndex(index);
    const previousValue = this.value;
    const nextValue =
      normalizedIndex >= 0 ? (this._options[normalizedIndex]?.value ?? '') : '';
    const changed =
      previousValue !== nextValue || this._selectedIndex !== normalizedIndex;

    this._selectedIndex = normalizedIndex;
    this._activeIndex = normalizedIndex;
    this._syncLightDomSelection();
    this._updateFormState();
    this._updateOpenState(false);

    if (emitChange && changed) {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  private _findNextEnabledIndex(startIndex: number, direction: 1 | -1) {
    if (this._options.length === 0) {
      return -1;
    }

    let index = startIndex;

    for (let step = 0; step < this._options.length; step += 1) {
      index = (index + direction + this._options.length) % this._options.length;

      if (!this._options[index]?.disabled) {
        return index;
      }
    }

    return -1;
  }

  private _getAssociatedLabelIds() {
    const labels = this.labels
      ? Array.from(this.labels as NodeListOf<HTMLLabelElement>)
      : [];

    if (labels.length === 0) {
      return '';
    }

    return labels
      .map((label, index) => {
        if (label.id !== '') {
          return label.id;
        }

        const nextId = `${this._baseId}-label-${index}`;
        label.id = nextId;
        return nextId;
      })
      .join(' ');
  }

  private _getDefaultActiveIndex() {
    if (this._selectedIndex >= 0 && !this._options[this._selectedIndex]?.disabled) {
      return this._selectedIndex;
    }

    return this._options.findIndex((option) => !option.disabled);
  }

  private _getPanelId() {
    return `${this._baseId}-panel`;
  }

  private _getLastEnabledIndex() {
    for (let index = this._options.length - 1; index >= 0; index -= 1) {
      if (!this._options[index]?.disabled) {
        return index;
      }
    }

    return -1;
  }

  private _getTriggerId() {
    return `${this._baseId}-trigger`;
  }

  private _handleDateClick = (event: MouseEvent) => {
    if (this._isDisabled()) {
      return;
    }

    const button = event.currentTarget as HTMLButtonElement | null;

    if (!button) {
      return;
    }

    const index = Number(button.dataset['index']);

    if (this._options[index]?.disabled) {
      return;
    }

    this._commitSelection(index, true);
    this._triggerEl?.focus();
  };

  private _handleDateMouseDown = (event: MouseEvent) => {
    event.preventDefault();
  };

  private _handleFocusOut = () => {
    requestAnimationFrame(() => {
      if (!this.matches(':focus-within')) {
        this._updateOpenState(false);
      }
    });
  };

  private _handleHostFocus = () => {
    this._triggerEl?.focus();
  };

  private _handleOptionsSlotChange = () => {
    this._syncOptionsFromLightDom();
  };

  private _handleTriggerClick = () => {
    if (this._isDisabled()) {
      return;
    }

    this._updateOpenState(!this._open);
  };

  private _handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (this._isDisabled()) {
      return;
    }

    if (!this._open) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        this._updateOpenState(true);
      }

      return;
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this._moveActiveIndex(1);
        return;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this._moveActiveIndex(-1);
        return;
      case 'Home':
        event.preventDefault();
        this._activeIndex = this._options.findIndex((option) => !option.disabled);
        return;
      case 'End':
        event.preventDefault();
        this._activeIndex = this._getLastEnabledIndex();
        return;
      case 'Escape':
        event.preventDefault();
        this._updateOpenState(false);
        return;
      case ' ':
      case 'Enter':
        event.preventDefault();

        if (this._activeIndex >= 0) {
          this._commitSelection(this._activeIndex, true);
        }

        return;
      default:
        return;
    }
  };

  private _isDisabled() {
    return this.disabled || this._formDisabled;
  }

  private _moveActiveIndex(direction: 1 | -1) {
    const nextIndex = this._findNextEnabledIndex(this._activeIndex, direction);

    if (nextIndex >= 0) {
      this._activeIndex = nextIndex;
    }
  }

  private _normalizeSelectionIndex(index: number) {
    if (index < 0) {
      return -1;
    }

    const option = this._options[index];

    if (!option || option.disabled) {
      return -1;
    }

    return index;
  }

  private _selectByValue(nextValue: string, emitChange: boolean) {
    const nextIndex =
      nextValue === ''
        ? -1
        : this._options.findIndex((option) => option.value === nextValue);

    this._commitSelection(nextIndex, emitChange);
  }

  private _syncHostFocusability() {
    this.tabIndex = this._isDisabled() ? -1 : 0;
    this._internals.ariaDisabled = String(this._isDisabled());
    this._internals.ariaRequired = this.required ? 'true' : 'false';
  }

  private _syncLightDomSelection() {
    const lightDomOptions = Array.from(this.querySelectorAll('option'));

    lightDomOptions.forEach((option, index) => {
      option.selected = index === this._selectedIndex;
    });
  }

  private _syncOptionsFromLightDom() {
    const lightDomOptions = Array.from(this.querySelectorAll('option'));

    this._options = lightDomOptions.map((option) => ({
      disabled: option.disabled,
      label: option.label,
      value: option.value,
    }));
    this._defaultSelectedIndex = lightDomOptions.findIndex(
      (option) => option.defaultSelected,
    );
    this._selectedIndex = this._normalizeSelectionIndex(
      lightDomOptions.findIndex((option) => option.selected),
    );
    this._activeIndex = this._getDefaultActiveIndex();
    this._syncLightDomSelection();
    this._updateFormState();
  }

  private _updateFormState() {
    const submissionValue = this.name === '' || this.value === '' ? null : this.value;

    this._internals.setFormValue(submissionValue, this.value);

    if (this.required && !this._isDisabled() && this.value === '') {
      this._internals.setValidity(
        { valueMissing: true },
        'Please choose a date.',
      );
      return;
    }

    this._internals.setValidity({});
  }

  private _updateOpenState(nextOpen: boolean) {
    if (nextOpen && this._isDisabled()) {
      return;
    }

    this._open = nextOpen;

    if (nextOpen) {
      this._activeIndex = this._getDefaultActiveIndex();
      return;
    }

    this._activeIndex = this._selectedIndex;
  }
}
