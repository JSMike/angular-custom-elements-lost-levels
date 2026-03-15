import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import hostStyles from './checkbox.scss?inline';

export const Checkbox = 'boxes-checkbox';

export type CheckboxState = 'checked' | 'unchecked';

@customElement(Checkbox)
export class CheckboxEl extends LitElement {
  static override styles = unsafeCSS(hostStyles);
  static formAssociated = true;

  @property({ type: Boolean, reflect: true }) public checked = false;
  @property({ type: Boolean, reflect: true }) public disabled = false;
  @property({ type: Boolean, reflect: true }) public required = false;
  @property({ reflect: true }) public value = 'on';

  private readonly _internals: ElementInternals;
  private _defaultChecked = false;
  private _formDisabled = false;
  private _hasCapturedDefaults = false;

  public constructor() {
    super();
    this._internals = this.attachInternals();
    this._internals.role = 'checkbox';
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

  public get willValidate() {
    return this._internals.willValidate;
  }

  public override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('keydown', this._handleKeyDown);

    if (!this._hasCapturedDefaults) {
      this._defaultChecked = this.checked;
      this._hasCapturedDefaults = true;
    }

    this._syncControlState();
  }

  public override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('keydown', this._handleKeyDown);
  }

  public checkValidity() {
    return this._internals.checkValidity();
  }

  public formDisabledCallback(disabled: boolean) {
    this._formDisabled = disabled;
    this._syncControlState();
  }

  public formResetCallback() {
    this.checked = this._defaultChecked;
  }

  public formStateRestoreCallback(state: string | File | FormData | null) {
    if (state === 'checked' || state === 'unchecked') {
      this.checked = state === 'checked';
    }
  }

  public reportValidity() {
    return this._internals.reportValidity();
  }

  protected override updated(changedProperties: Map<string, unknown>) {
    if (
      changedProperties.has('checked') ||
      changedProperties.has('disabled') ||
      changedProperties.has('required') ||
      changedProperties.has('value')
    ) {
      this._syncControlState();
    }
  }

  override render() {
    return html`<span class="checkbox-indicator" aria-hidden="true"></span>`;
  }

  private _handleClick = (event: Event) => {
    if (this._isDisabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this._toggleCheckedState(true);
  };

  private _handleKeyDown = (event: KeyboardEvent) => {
    if (this._isDisabled()) {
      return;
    }

    if (event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this._toggleCheckedState(true);
  };

  private _isDisabled() {
    return this.disabled || this._formDisabled;
  }

  private _syncControlState() {
    this.tabIndex = this._isDisabled() ? -1 : 0;
    this._internals.ariaChecked = String(this.checked);
    this._internals.ariaDisabled = String(this._isDisabled());
    this._internals.ariaRequired = this.required ? 'true' : 'false';

    const state: CheckboxState = this.checked ? 'checked' : 'unchecked';
    const submissionValue = this.checked ? this.value : null;
    this._internals.setFormValue(submissionValue, state);

    if (this.required && !this.checked && !this._isDisabled()) {
      this._internals.setValidity(
        { valueMissing: true },
        'Please check this box.',
      );
      return;
    }

    this._internals.setValidity({});
  }

  private _toggleCheckedState(emitEvents: boolean) {
    this.checked = !this.checked;

    if (!emitEvents) {
      return;
    }

    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
}
