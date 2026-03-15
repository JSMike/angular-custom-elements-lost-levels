import { html, LitElement, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import hostStyles from './multi-select.scss?inline';

export const MultiSelect = 'boxes-multi-select';

export type MultiSelectOption = {
  disabled: boolean;
  label: string;
  selected: boolean;
  value: string;
};

export type MultiSelectValue = string[];

export type MultiSelectSerializedState = string;

@customElement(MultiSelect)
export class MultiSelectEl extends LitElement {
  static override styles = unsafeCSS(hostStyles);
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static formAssociated = true;
  private static _multiSelectId = 0;

  @property({ type: Boolean, reflect: true }) public disabled = false;
  @property({ type: Boolean, reflect: true }) public fullwidth = false;
  @property({ reflect: true }) public name = '';
  @property({ type: Boolean, reflect: true }) public required = false;

  @state() private _activeIndex = -1;
  @state() private _options: MultiSelectOption[] = [];

  @query('.multi-select-list') private _listboxEl!: HTMLDivElement;

  private readonly _baseId = `${MultiSelect}-${(MultiSelectEl._multiSelectId += 1)}`;
  private readonly _internals: ElementInternals;
  private _defaultSelectedValues: MultiSelectValue = [];
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

  public get selectedValues(): MultiSelectValue {
    return this._options
      .filter((option) => option.selected)
      .map((option) => option.value);
  }

  public set selectedValues(nextValues: MultiSelectValue) {
    this._selectValues(nextValues, false);
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
    return this.selectedValues[0] ?? '';
  }

  public set value(nextValue: string) {
    this.selectedValues = nextValue === '' ? [] : [nextValue];
  }

  public get willValidate() {
    return this._internals.willValidate;
  }

  public override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focus', this._handleHostFocus);
    this._syncHostFocusability();
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focus', this._handleHostFocus);
  }

  public override focus(options?: FocusOptions) {
    this._listboxEl?.focus(options);
  }

  public checkValidity() {
    return this._internals.checkValidity();
  }

  public formDisabledCallback(disabled: boolean) {
    this._formDisabled = disabled;
    this._syncHostFocusability();
    this._updateFormState();
  }

  public formResetCallback() {
    this._selectValues(this._defaultSelectedValues, false);
  }

  public formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state !== 'string') {
      return;
    }

    this._selectValues(this._deserializeState(state), false);
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

  protected override firstUpdated() {
    this._syncOptionsFromLightDom();
  }

  override render() {
    const controlLabelIds =
      this.getAttribute('aria-labelledby') ?? this._getAssociatedLabelIds();
    const ariaLabel = controlLabelIds
      ? undefined
      : (this.getAttribute('aria-label') ?? undefined);
    const activeDescendant =
      this._activeIndex >= 0 ? this._getOptionId(this._activeIndex) : undefined;

    return html`
      <div class="multi-select">
        <div
          id="${this._getListboxId()}"
          class="multi-select-list"
          role="listbox"
          tabindex="-1"
          aria-activedescendant="${ifDefined(activeDescendant)}"
          aria-disabled="${String(this._isDisabled())}"
          aria-invalid="${String(!this.validity.valid)}"
          aria-label="${ifDefined(ariaLabel)}"
          aria-labelledby="${ifDefined(controlLabelIds || undefined)}"
          aria-multiselectable="true"
          aria-required="${ifDefined(this.required ? 'true' : undefined)}"
          @click="${this._handleListboxClick}"
          @keydown="${this._handleListboxKeyDown}"
        >
          ${this._options.map((option, index) => {
            const isActive = index === this._activeIndex;

            return html`
              <div
                id="${this._getOptionId(index)}"
                class="multi-select-option ${isActive
                  ? 'option-current'
                  : ''}"
                data-index="${index}"
                role="option"
                aria-disabled="${String(option.disabled)}"
                aria-selected="${String(option.selected)}"
              >
                <span>${option.label}</span>
                <span
                  class="multi-select-check"
                  aria-hidden="true"
                ></span>
              </div>
            `;
          })}
        </div>
        <slot hidden @slotchange="${this._handleOptionsSlotChange}"></slot>
      </div>
    `;
  }

  private _buildSubmissionValue(selectedValues: MultiSelectValue) {
    if (this.name === '' || selectedValues.length === 0) {
      return null;
    }

    const formData = new FormData();

    selectedValues.forEach((value) => {
      formData.append(this.name, value);
    });

    return formData;
  }

  private _deserializeState(
    state: MultiSelectSerializedState,
  ): MultiSelectValue {
    if (state === '') {
      return [];
    }

    try {
      const parsedState: unknown = JSON.parse(state);

      if (!Array.isArray(parsedState)) {
        return [state];
      }

      return parsedState
        .filter((value): value is string => typeof value === 'string')
        .slice();
    } catch {
      return [state];
    }
  }

  private _dispatchSelectionEvents() {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
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

  private _getListboxId() {
    return `${this._baseId}-listbox`;
  }

  private _getOptionId(index: number) {
    return `${this._baseId}-option-${index}`;
  }

  private _handleHostFocus = () => {
    this._listboxEl?.focus();
  };

  private _handleListboxClick = (event: MouseEvent) => {
    if (this._isDisabled()) {
      return;
    }

    const optionEl = event
      .composedPath()
      .find(
        (node): node is HTMLElement =>
          node instanceof HTMLElement && node.dataset['index'] !== undefined,
      );

    if (!optionEl) {
      return;
    }

    const index = Number(optionEl.dataset['index']);
    this._toggleIndex(index, true);
  };

  private _handleListboxKeyDown = (event: KeyboardEvent) => {
    if (this._isDisabled()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this._moveActiveIndex(1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        this._moveActiveIndex(-1);
        return;
      case 'Home':
        event.preventDefault();
        this._moveActiveToBoundary(1);
        return;
      case 'End':
        event.preventDefault();
        this._moveActiveToBoundary(-1);
        return;
      case ' ':
      case 'Enter':
        event.preventDefault();

        if (this._activeIndex >= 0) {
          this._toggleIndex(this._activeIndex, true);
        }

        return;
      default:
        return;
    }
  };

  private _handleOptionsSlotChange = () => {
    this._syncOptionsFromLightDom();
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

  private _moveActiveToBoundary(direction: 1 | -1) {
    const options = direction === 1 ? this._options : [...this._options].reverse();
    const boundaryIndex = options.findIndex((option) => !option.disabled);

    if (boundaryIndex < 0) {
      return;
    }

    this._activeIndex =
      direction === 1 ? boundaryIndex : this._options.length - 1 - boundaryIndex;
  }

  private _selectionEquals(nextValues: readonly string[]) {
    const currentValues = this.selectedValues;

    if (currentValues.length !== nextValues.length) {
      return false;
    }

    return currentValues.every((value, index) => value === nextValues[index]);
  }

  private _selectValues(
    nextValues: MultiSelectValue,
    emitEvents: boolean,
  ) {
    const normalizedValues = this._normalizeSelectedValues(nextValues);
    const changed = !this._selectionEquals(normalizedValues);

    this._options = this._options.map((option) => ({
      ...option,
      selected: normalizedValues.includes(option.value),
    }));
    this._activeIndex = this._getDefaultActiveIndex();
    this._syncLightDomSelection();
    this._updateFormState();

    if (emitEvents && changed) {
      this._dispatchSelectionEvents();
    }
  }

  private _getDefaultActiveIndex() {
    const selectedIndex = this._options.findIndex((option) => option.selected);

    if (selectedIndex >= 0) {
      return selectedIndex;
    }

    return this._options.findIndex((option) => !option.disabled);
  }

  private _normalizeSelectedValues(
    nextValues: readonly string[],
  ): MultiSelectValue {
    const uniqueValues = new Set(nextValues);

    return this._options
      .filter((option) => uniqueValues.has(option.value))
      .map((option) => option.value);
  }

  private _serializeState() {
    return JSON.stringify(this.selectedValues);
  }

  private _syncHostFocusability() {
    this.tabIndex = this._isDisabled() ? -1 : 0;
    this._internals.ariaDisabled = String(this._isDisabled());
    this._internals.ariaRequired = this.required ? 'true' : 'false';
  }

  private _syncLightDomSelection() {
    const lightDomOptions = Array.from(this.querySelectorAll('option'));
    const selectedValues = new Set(this.selectedValues);

    lightDomOptions.forEach((option) => {
      option.selected = selectedValues.has(option.value);
    });
  }

  private _syncOptionsFromLightDom() {
    const lightDomOptions = Array.from(this.querySelectorAll('option'));

    this._options = lightDomOptions.map((option) => ({
      disabled: option.disabled,
      label: option.label,
      selected: option.selected,
      value: option.value,
    }));
    this._defaultSelectedValues = lightDomOptions
      .filter((option) => option.defaultSelected)
      .map((option) => option.value);
    this._activeIndex = this._getDefaultActiveIndex();
    this._syncLightDomSelection();
    this._updateFormState();
  }

  private _toggleIndex(index: number, emitEvents: boolean) {
    const option = this._options[index];

    if (!option || option.disabled) {
      return;
    }

    const nextValues = this.selectedValues.slice();
    const nextValueIndex = nextValues.indexOf(option.value);

    if (nextValueIndex >= 0) {
      nextValues.splice(nextValueIndex, 1);
    } else {
      nextValues.push(option.value);
    }

    this._activeIndex = index;
    this._selectValues(nextValues, emitEvents);
  }

  private _updateFormState() {
    const selectedValues = this.selectedValues;

    this._internals.setFormValue(
      this._buildSubmissionValue(selectedValues),
      this._serializeState(),
    );

    if (this.required && !this._isDisabled() && selectedValues.length === 0) {
      this._internals.setValidity(
        { valueMissing: true },
        'Please choose at least one option.',
      );
      return;
    }

    this._internals.setValidity({});
  }
}
