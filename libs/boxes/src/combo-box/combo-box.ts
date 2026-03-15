import { html, LitElement, unsafeCSS } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import hostStyles from './combo-box.scss?inline';

export const ComboBox = 'boxes-combo-box';

export type ComboBoxOption = {
  label: string;
  value: string;
  disabled: boolean;
};

@customElement(ComboBox)
export class ComboBoxEl extends LitElement {
  static override styles = unsafeCSS(hostStyles);
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static formAssociated = true;
  static readonly selectActions = {
    Close: 0,
    CloseSelect: 1,
    First: 2,
    Last: 3,
    Next: 4,
    Open: 5,
    PageDown: 6,
    PageUp: 7,
    Previous: 8,
    Type: 9,
  } as const;
  private static _comboBoxId = 0;

  @property({ type: Boolean, reflect: true }) public disabled = false;
  @property({ type: Boolean, reflect: true }) public fullwidth = false;
  @property({ type: Boolean, reflect: true }) public required = false;

  @state() private accessor _activeIndex = -1;
  @state() private accessor _open = false;
  @state() private accessor _options: ComboBoxOption[] = [];
  @state() private accessor _selectedIndex = -1;

  @query('.combo-input') private _comboEl!: HTMLDivElement;
  @query('.combo-menu') private _listboxEl!: HTMLDivElement;

  private readonly _baseId = `${ComboBox}-${(ComboBoxEl._comboBoxId += 1)}`;
  private readonly _internals: ElementInternals;
  private _defaultSelectedIndex = -1;
  private _formDisabled = false;
  private _ignoreBlur = false;
  private _searchString = '';
  private _searchTimeout?: number;

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

  public get name() {
    return this.getAttribute('name') ?? '';
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

    if (this._searchTimeout !== undefined) {
      window.clearTimeout(this._searchTimeout);
    }
  }

  public override focus(options?: FocusOptions) {
    this._comboEl?.focus(options);
  }

  public checkValidity() {
    return this._internals.checkValidity();
  }

  public formDisabledCallback(disabled: boolean) {
    this._formDisabled = disabled;
    this._syncHostFocusability();
    this._updateFormState();

    if (disabled) {
      this._updateMenuState(false, false);
    }
  }

  public formResetCallback() {
    this._commitSelection(this._defaultSelectedIndex, false);
    this._updateMenuState(false, false);
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

    if (
      changedProperties.has('_open') ||
      changedProperties.has('_activeIndex')
    ) {
      this._syncScrollPosition();
    }
  }

  override render() {
    const selectedOption = this._options[this._selectedIndex];
    const controlLabelIds =
      this.getAttribute('aria-labelledby') ?? this._getAssociatedLabelIds();
    const ariaLabel = controlLabelIds
      ? undefined
      : (this.getAttribute('aria-label') ?? undefined);
    const activeDescendant =
      this._open && this._activeIndex >= 0
        ? this._getOptionId(this._activeIndex)
        : undefined;

    return html`
      <div class="combo js-select ${this._open ? 'open' : ''}">
        <div
          id="${this._getComboId()}"
          class="combo-input"
          role="combobox"
          tabindex="-1"
          aria-activedescendant="${ifDefined(activeDescendant)}"
          aria-controls="${this._getListboxId()}"
          aria-autocomplete="none"
          aria-disabled="${String(this._isDisabled())}"
          aria-expanded="${String(this._open)}"
          aria-haspopup="listbox"
          aria-invalid="${String(!this.validity.valid)}"
          aria-label="${ifDefined(ariaLabel)}"
          aria-labelledby="${ifDefined(controlLabelIds || undefined)}"
          aria-required="${ifDefined(this.required ? 'true' : undefined)}"
          @blur="${this._handleComboBlur}"
          @click="${this._handleComboClick}"
          @keydown="${this._handleComboKeyDown}"
        >
          ${selectedOption?.label ?? ''}
        </div>
        <div
          id="${this._getListboxId()}"
          class="combo-menu"
          role="listbox"
          aria-labelledby="${ifDefined(controlLabelIds || undefined)}"
        >
          ${this._options.map((option, index) => {
            const isActive = index === this._activeIndex;
            const isSelected = index === this._selectedIndex;

            return html`
              <div
                id="${this._getOptionId(index)}"
                class="combo-option ${isActive ? 'option-current' : ''}"
                data-index="${index}"
                role="option"
                aria-disabled="${String(option.disabled)}"
                aria-selected="${String(isSelected)}"
                @click="${this._handleOptionClick}"
                @mousedown="${this._handleOptionMouseDown}"
              >
                ${option.label}
              </div>
            `;
          })}
        </div>
        <slot hidden @slotchange="${this._handleOptionsSlotChange}"></slot>
      </div>
    `;
  }

  private _commitSelection(index: number, emitEvents: boolean) {
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

    if (emitEvents && changed) {
      this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      this.dispatchEvent(
        new Event('change', { bubbles: true, composed: true }),
      );
    }
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
        if (!label.id) {
          label.id = `${this._baseId}-label-${index + 1}`;
        }

        return label.id;
      })
      .join(' ');
  }

  private _getComboId() {
    return `${this._baseId}-combo`;
  }

  private _getEnabledIndex(index: number, step: 1 | -1) {
    for (
      let candidate = index;
      candidate >= 0 && candidate < this._options.length;
      candidate += step
    ) {
      if (!this._options[candidate]?.disabled) {
        return candidate;
      }
    }

    return -1;
  }

  private _getFirstEnabledIndex() {
    return this._getEnabledIndex(0, 1);
  }

  private _getLastEnabledIndex() {
    return this._getEnabledIndex(this._options.length - 1, -1);
  }

  private _getLightOptions() {
    return Array.from(this.querySelectorAll('option'));
  }

  private _getListboxId() {
    return `${this._baseId}-listbox`;
  }

  private _getNavigableIndex(action: SelectAction) {
    if (this._options.length === 0) {
      return -1;
    }

    if (action === ComboBoxEl.selectActions.First) {
      return this._getFirstEnabledIndex();
    }

    if (action === ComboBoxEl.selectActions.Last) {
      return this._getLastEnabledIndex();
    }

    const fallbackIndex =
      this._activeIndex >= 0 ? this._activeIndex : this._selectedIndex;
    const currentIndex =
      fallbackIndex >= 0 ? fallbackIndex : this._getFirstEnabledIndex();

    if (currentIndex < 0) {
      return -1;
    }

    const targetIndex = this._getUpdatedIndex(
      currentIndex,
      this._options.length - 1,
      action,
    );
    const direction: 1 | -1 =
      action === ComboBoxEl.selectActions.Previous ||
      action === ComboBoxEl.selectActions.PageUp
        ? -1
        : 1;

    return this._getEnabledIndex(targetIndex, direction);
  }

  private _getOptionId(index: number) {
    return `${this._baseId}-option-${index}`;
  }

  private _handleComboBlur = (event: FocusEvent) => {
    if (this._ignoreBlur) {
      this._ignoreBlur = false;
      this._comboEl?.focus();
      return;
    }

    const relatedTarget = event.relatedTarget as Node | null;

    if (relatedTarget && this.renderRoot.contains(relatedTarget)) {
      return;
    }

    if (this._open) {
      this._commitSelection(this._activeIndex, true);
      this._updateMenuState(false, false);
    }
  };

  private _handleComboClick = () => {
    if (this._isDisabled()) {
      return;
    }

    this._updateMenuState(!this._open, false);
  };

  private _handleComboKeyDown = (event: KeyboardEvent) => {
    if (this._isDisabled() || this._options.length === 0) {
      return;
    }

    const action = this._getActionFromKey(event, this._open);

    if (action === undefined) {
      return;
    }

    switch (action) {
      case ComboBoxEl.selectActions.First:
      case ComboBoxEl.selectActions.Last:
      case ComboBoxEl.selectActions.Next:
      case ComboBoxEl.selectActions.Previous:
      case ComboBoxEl.selectActions.PageUp:
      case ComboBoxEl.selectActions.PageDown: {
        event.preventDefault();
        this._updateMenuState(true, false);
        this._onOptionChange(this._getNavigableIndex(action));
        return;
      }
      case ComboBoxEl.selectActions.CloseSelect:
        event.preventDefault();
        this._commitSelection(this._activeIndex, true);
        this._updateMenuState(false);
        return;
      case ComboBoxEl.selectActions.Close:
        event.preventDefault();
        this._updateMenuState(false);
        return;
      case ComboBoxEl.selectActions.Type:
        this._onComboType(event.key);
        return;
      case ComboBoxEl.selectActions.Open:
        event.preventDefault();
        this._updateMenuState(true);
        return;
      default:
        return;
    }
  };

  private _handleHostFocus = (event: FocusEvent) => {
    if (event.target !== this || this._isDisabled()) {
      return;
    }

    this._comboEl?.focus();
  };

  private _handleOptionClick = (event: Event) => {
    const target = event.currentTarget as HTMLElement;
    const index = Number(target.dataset.index);

    if (!Number.isFinite(index) || this._options[index]?.disabled) {
      return;
    }

    this._onOptionChange(index);
    this._commitSelection(index, true);
    this._updateMenuState(false);
  };

  private _handleOptionMouseDown = () => {
    this._ignoreBlur = true;
  };

  private _handleOptionsSlotChange = () => {
    this._syncOptionsFromLightDom();
  };

  private _isDisabled() {
    return this.disabled || this._formDisabled;
  }

  private _normalizeSelectionIndex(index: number) {
    if (index < 0 || index >= this._options.length) {
      return -1;
    }

    if (!this._options[index]?.disabled) {
      return index;
    }

    const nextEnabled = this._getEnabledIndex(index + 1, 1);

    if (nextEnabled >= 0) {
      return nextEnabled;
    }

    return this._getEnabledIndex(index - 1, -1);
  }

  private _onComboType(letter: string) {
    this._updateMenuState(true, false);

    if (this._searchTimeout !== undefined) {
      window.clearTimeout(this._searchTimeout);
    }

    this._searchTimeout = window.setTimeout(() => {
      this._searchString = '';
    }, 500);

    this._searchString += letter;

    const searchIndex = this._getIndexByLetter(
      this._options,
      this._searchString,
      Math.max(0, this._activeIndex + 1),
    );

    if (searchIndex >= 0) {
      this._onOptionChange(searchIndex);
      return;
    }

    if (this._searchTimeout !== undefined) {
      window.clearTimeout(this._searchTimeout);
    }

    this._searchString = '';
  }

  private _onOptionChange(index: number) {
    if (
      index < 0 ||
      index >= this._options.length ||
      this._options[index]?.disabled
    ) {
      return;
    }

    this._activeIndex = index;
  }

  private _selectByValue(value: string, emitEvents: boolean) {
    const selectedIndex = this._options.findIndex(
      (option) => option.value === value,
    );
    this._commitSelection(selectedIndex, emitEvents);
  }

  private _syncHostFocusability() {
    this.tabIndex = this._isDisabled() ? -1 : 0;
  }

  private _syncLightDomSelection() {
    this._getLightOptions().forEach((option, index) => {
      option.selected = index === this._selectedIndex;
    });
  }

  private _syncOptionsFromLightDom() {
    const lightOptions = this._getLightOptions();
    const currentValue = this.value;

    this._options = lightOptions.map((option) => ({
      disabled: option.disabled,
      label: option.label || option.textContent?.trim() || '',
      value: option.hasAttribute('value')
        ? option.value
        : option.label || option.textContent?.trim() || '',
    }));

    this._defaultSelectedIndex = lightOptions.findIndex(
      (option) => option.defaultSelected,
    );

    if (this._defaultSelectedIndex < 0 && this._options.length > 0) {
      this._defaultSelectedIndex = 0;
    }

    let nextSelectedIndex =
      currentValue !== ''
        ? this._options.findIndex((option) => option.value === currentValue)
        : -1;

    if (nextSelectedIndex < 0) {
      nextSelectedIndex = lightOptions.findIndex((option) => option.selected);
    }

    if (nextSelectedIndex < 0) {
      nextSelectedIndex = this._defaultSelectedIndex;
    }

    this._commitSelection(nextSelectedIndex, false);
  }

  private _syncScrollPosition() {
    if (!this._open || this._activeIndex < 0) {
      return;
    }

    const activeElement = this.renderRoot.querySelector<HTMLElement>(
      `#${this._getOptionId(this._activeIndex)}`,
    );

    if (!activeElement) {
      return;
    }

    if (this._isScrollable(this._listboxEl)) {
      this._maintainScrollVisibility(activeElement, this._listboxEl);
    }

    if (!this._isElementInView(activeElement)) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  private _updateFormState() {
    const selectedOption = this._options[this._selectedIndex];
    const submissionValue = selectedOption ? selectedOption.value : null;
    const restoreState = selectedOption ? selectedOption.value : '';
    const controlAnchor = this._comboEl;

    this._internals.setFormValue(submissionValue, restoreState);

    if (this.required && !selectedOption?.value) {
      if (controlAnchor) {
        this._internals.setValidity(
          { valueMissing: true },
          'Please select an option.',
          controlAnchor,
        );
      } else {
        this._internals.setValidity(
          { valueMissing: true },
          'Please select an option.',
        );
      }
      return;
    }

    this._internals.setValidity({});
  }

  private _updateMenuState(open: boolean, callFocus = true) {
    if (this._isDisabled()) {
      this._open = false;
      return;
    }

    this._open = open;

    if (open && this._activeIndex < 0) {
      this._activeIndex =
        this._selectedIndex >= 0
          ? this._selectedIndex
          : this._getFirstEnabledIndex();
    }

    if (callFocus) {
      this._comboEl?.focus();
    }
  }

  // Adapted from the WAI-ARIA APG select-only combobox example:
  // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
  private _filterOptions(
    options: Array<{ label: string; index: number }>,
    filter: string,
    exclude: number[] = [],
  ) {
    return options.filter((option) => {
      const matches =
        option.label.toLowerCase().indexOf(filter.toLowerCase()) === 0;
      return matches && !exclude.includes(option.index);
    });
  }

  private _getActionFromKey(event: KeyboardEvent, menuOpen: boolean) {
    const { key, altKey, ctrlKey, metaKey } = event;
    const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];

    if (!menuOpen && openKeys.includes(key)) {
      return ComboBoxEl.selectActions.Open;
    }

    if (key === 'Home') {
      return ComboBoxEl.selectActions.First;
    }

    if (key === 'End') {
      return ComboBoxEl.selectActions.Last;
    }

    if (
      key === 'Backspace' ||
      key === 'Clear' ||
      (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
    ) {
      return ComboBoxEl.selectActions.Type;
    }

    if (!menuOpen) {
      return undefined;
    }

    if (key === 'ArrowUp' && altKey) {
      return ComboBoxEl.selectActions.CloseSelect;
    }

    if (key === 'ArrowDown' && !altKey) {
      return ComboBoxEl.selectActions.Next;
    }

    if (key === 'ArrowUp') {
      return ComboBoxEl.selectActions.Previous;
    }

    if (key === 'PageUp') {
      return ComboBoxEl.selectActions.PageUp;
    }

    if (key === 'PageDown') {
      return ComboBoxEl.selectActions.PageDown;
    }

    if (key === 'Escape') {
      return ComboBoxEl.selectActions.Close;
    }

    if (key === 'Enter' || key === ' ') {
      return ComboBoxEl.selectActions.CloseSelect;
    }

    return undefined;
  }

  private _getIndexByLetter(
    options: ComboBoxOption[],
    filter: string,
    startIndex = 0,
  ) {
    const searchable = options
      .map((option, index) => ({
        label: option.label,
        index,
        disabled: option.disabled,
      }))
      .filter((option) => !option.disabled);
    const orderedOptions = [
      ...searchable.filter((option) => option.index >= startIndex),
      ...searchable.filter((option) => option.index < startIndex),
    ];
    const firstMatch = this._filterOptions(orderedOptions, filter)[0];
    const allSameLetter = filter
      .split('')
      .every((letter) => letter === filter[0]);

    if (firstMatch) {
      return firstMatch.index;
    }

    if (allSameLetter) {
      const matches = this._filterOptions(orderedOptions, filter[0]);
      return matches[0]?.index ?? -1;
    }

    return -1;
  }

  private _getUpdatedIndex(
    currentIndex: number,
    maxIndex: number,
    action: SelectAction,
  ) {
    const pageSize = 10;

    switch (action) {
      case ComboBoxEl.selectActions.First:
        return 0;
      case ComboBoxEl.selectActions.Last:
        return maxIndex;
      case ComboBoxEl.selectActions.Previous:
        return Math.max(0, currentIndex - 1);
      case ComboBoxEl.selectActions.Next:
        return Math.min(maxIndex, currentIndex + 1);
      case ComboBoxEl.selectActions.PageUp:
        return Math.max(0, currentIndex - pageSize);
      case ComboBoxEl.selectActions.PageDown:
        return Math.min(maxIndex, currentIndex + pageSize);
      default:
        return currentIndex;
    }
  }

  private _isElementInView(element: Element) {
    const bounding = element.getBoundingClientRect();

    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  private _isScrollable(
    element: HTMLElement | null | undefined,
  ): element is HTMLElement {
    return Boolean(element && element.clientHeight < element.scrollHeight);
  }

  private _maintainScrollVisibility(
    activeElement: HTMLElement,
    scrollParent: HTMLElement,
  ) {
    const { offsetHeight, offsetTop } = activeElement;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

    if (isAbove) {
      scrollParent.scrollTo(0, offsetTop);
    } else if (isBelow) {
      scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  }
}

export type SelectAction =
  (typeof ComboBoxEl.selectActions)[keyof typeof ComboBoxEl.selectActions];
