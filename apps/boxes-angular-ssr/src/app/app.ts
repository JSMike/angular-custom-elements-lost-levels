import '@/boxes/combobox';
import '@/boxes/checkbox';
import '@/boxes/multi-select';
import '@/boxes/calendar-picker';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  NgZone,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type FormDataEntryJson = string | string[];

export type FormDataJson = Record<string, FormDataEntryJson>;

export type ComboDemoFormModel = {
  produce: FormControl<string>;
};

export type CheckboxDemoFormModel = {
  confirmedProduce: FormControl<string>;
};

export type MultiSelectDemoFormModel = {
  produceTags: FormControl<string>;
};

export type CalendarDemoFormModel = {
  deliveryDate: FormControl<string>;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  @ViewChild('comboDemoForm')
  private _comboDemoFormRef?: ElementRef<HTMLFormElement>;

  @ViewChild('checkboxDemoForm')
  private _checkboxDemoFormRef?: ElementRef<HTMLFormElement>;

  @ViewChild('multiSelectDemoForm')
  private _multiSelectDemoFormRef?: ElementRef<HTMLFormElement>;

  @ViewChild('calendarDemoForm')
  private _calendarDemoFormRef?: ElementRef<HTMLFormElement>;

  protected readonly comboForm = new FormGroup<ComboDemoFormModel>({
    produce: new FormControl('', { nonNullable: true }),
  });
  protected readonly checkboxForm = new FormGroup<CheckboxDemoFormModel>({
    confirmedProduce: new FormControl('', { nonNullable: true }),
  });
  protected readonly multiSelectForm = new FormGroup<MultiSelectDemoFormModel>({
    produceTags: new FormControl('', { nonNullable: true }),
  });
  protected readonly calendarForm = new FormGroup<CalendarDemoFormModel>({
    deliveryDate: new FormControl('', { nonNullable: true }),
  });
  protected readonly comboAngularFormValueJson = signal('{}');
  protected readonly comboNativeFormDataJson = signal('{}');
  protected readonly checkboxAngularFormValueJson = signal('{}');
  protected readonly checkboxNativeFormDataJson = signal('{}');
  protected readonly multiSelectAngularFormValueJson = signal('{}');
  protected readonly multiSelectNativeFormDataJson = signal('{}');
  protected readonly calendarAngularFormValueJson = signal('{}');
  protected readonly calendarNativeFormDataJson = signal('{}');

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _ngZone = inject(NgZone);
  private readonly _handleComboNativeFormChange = () => {
    this._renderAngularFormValue(this.comboForm, this.comboAngularFormValueJson);
    this._scheduleComboNativeFormDataRender();
  };
  private readonly _handleCheckboxNativeFormChange = () => {
    this._renderAngularFormValue(
      this.checkboxForm,
      this.checkboxAngularFormValueJson,
    );
    this._scheduleCheckboxNativeFormDataRender();
  };
  private readonly _handleMultiSelectNativeFormChange = () => {
    this._renderAngularFormValue(
      this.multiSelectForm,
      this.multiSelectAngularFormValueJson,
    );
    this._scheduleMultiSelectNativeFormDataRender();
  };
  private readonly _handleCalendarNativeFormChange = () => {
    this._renderAngularFormValue(
      this.calendarForm,
      this.calendarAngularFormValueJson,
    );
    this._scheduleCalendarNativeFormDataRender();
  };

  public ngAfterViewInit() {
    this._attachNativeFormChangeListener(
      this._comboDemoFormRef?.nativeElement,
      this._handleComboNativeFormChange,
    );
    this._attachNativeFormChangeListener(
      this._checkboxDemoFormRef?.nativeElement,
      this._handleCheckboxNativeFormChange,
    );
    this._attachNativeFormChangeListener(
      this._multiSelectDemoFormRef?.nativeElement,
      this._handleMultiSelectNativeFormChange,
    );
    this._attachNativeFormChangeListener(
      this._calendarDemoFormRef?.nativeElement,
      this._handleCalendarNativeFormChange,
    );

    this._renderAngularFormValue(this.comboForm, this.comboAngularFormValueJson);
    this._renderAngularFormValue(
      this.checkboxForm,
      this.checkboxAngularFormValueJson,
    );
    this._renderAngularFormValue(
      this.multiSelectForm,
      this.multiSelectAngularFormValueJson,
    );
    this._renderAngularFormValue(
      this.calendarForm,
      this.calendarAngularFormValueJson,
    );
    this._scheduleComboNativeFormDataRender();
    this._scheduleCheckboxNativeFormDataRender();
    this._scheduleMultiSelectNativeFormDataRender();
    this._scheduleCalendarNativeFormDataRender();
  }

  protected onCalendarReset(event: Event) {
    event.preventDefault();

    this.calendarForm.reset(
      {
        deliveryDate: '',
      },
      { emitEvent: false },
    );
    this._resetValueFieldElement(
      this._calendarDemoFormRef,
      '#delivery-date-field',
    );
    this._renderAngularFormValue(
      this.calendarForm,
      this.calendarAngularFormValueJson,
    );
    this._scheduleCalendarNativeFormDataRender();
  }

  protected onCalendarSubmit(event: Event) {
    event.preventDefault();
    this._renderAngularFormValue(
      this.calendarForm,
      this.calendarAngularFormValueJson,
    );
    this._scheduleCalendarNativeFormDataRender();
    this._calendarDemoFormRef?.nativeElement.reportValidity();
  }

  protected onCheckboxReset(event: Event) {
    event.preventDefault();

    this.checkboxForm.reset(
      {
        confirmedProduce: '',
      },
      { emitEvent: false },
    );
    this._resetCheckboxFieldElement();
    this._renderAngularFormValue(
      this.checkboxForm,
      this.checkboxAngularFormValueJson,
    );
    this._scheduleCheckboxNativeFormDataRender();
  }

  protected onCheckboxSubmit(event: Event) {
    event.preventDefault();
    this._renderAngularFormValue(
      this.checkboxForm,
      this.checkboxAngularFormValueJson,
    );
    this._scheduleCheckboxNativeFormDataRender();
    this._checkboxDemoFormRef?.nativeElement.reportValidity();
  }

  protected onComboReset(event: Event) {
    event.preventDefault();

    this.comboForm.reset(
      {
        produce: '',
      },
      { emitEvent: false },
    );
    this._resetValueFieldElement(this._comboDemoFormRef, '#produce-field');
    this._renderAngularFormValue(this.comboForm, this.comboAngularFormValueJson);
    this._scheduleComboNativeFormDataRender();
  }

  protected onComboSubmit(event: Event) {
    event.preventDefault();
    this._renderAngularFormValue(this.comboForm, this.comboAngularFormValueJson);
    this._scheduleComboNativeFormDataRender();
    this._comboDemoFormRef?.nativeElement.reportValidity();
  }

  protected onMultiSelectReset(event: Event) {
    event.preventDefault();

    this.multiSelectForm.reset(
      {
        produceTags: '',
      },
      { emitEvent: false },
    );
    this._resetValueFieldElement(
      this._multiSelectDemoFormRef,
      '#produce-tags-field',
    );
    this._renderAngularFormValue(
      this.multiSelectForm,
      this.multiSelectAngularFormValueJson,
    );
    this._scheduleMultiSelectNativeFormDataRender();
  }

  protected onMultiSelectSubmit(event: Event) {
    event.preventDefault();
    this._renderAngularFormValue(
      this.multiSelectForm,
      this.multiSelectAngularFormValueJson,
    );
    this._scheduleMultiSelectNativeFormDataRender();
    this._multiSelectDemoFormRef?.nativeElement.reportValidity();
  }

  private _attachNativeFormChangeListener(
    form: HTMLFormElement | undefined,
    listener: () => void,
  ) {
    if (!form) {
      return;
    }

    form.addEventListener('change', listener);
    this._destroyRef.onDestroy(() => {
      form.removeEventListener('change', listener);
    });
  }

  private _renderAngularFormValue(
    form: FormGroup,
    output: WritableSignal<string>,
  ) {
    const nextValue = JSON.stringify(form.value, null, 2);

    this._ngZone.run(() => {
      output.set(nextValue);
    });
  }

  private _renderNativeFormData(
    formRef: ElementRef<HTMLFormElement> | undefined,
    output: WritableSignal<string>,
  ) {
    const nativeForm = formRef?.nativeElement;

    if (!nativeForm) {
      return;
    }

    const nextValue = JSON.stringify(
      this._serializeFormData(new FormData(nativeForm)),
      null,
      2,
    );

    this._ngZone.run(() => {
      output.set(nextValue);
    });
  }

  private _resetCheckboxFieldElement() {
    const checkboxField = this._checkboxDemoFormRef?.nativeElement.querySelector<
      HTMLElement & { checked: boolean; value: string }
    >('#confirmation-field');

    if (!checkboxField) {
      return;
    }

    checkboxField.checked = false;
    checkboxField.value = 'confirmed';
  }

  private _resetValueFieldElement(
    formRef: ElementRef<HTMLFormElement> | undefined,
    selector: string,
  ) {
    const field = formRef?.nativeElement.querySelector<
      HTMLElement & { value: string }
    >(selector);

    if (!field) {
      return;
    }

    field.value = '';
  }

  private _restoreCheckboxFieldValue() {
    const checkboxField = this._checkboxDemoFormRef?.nativeElement.querySelector<
      HTMLElement & { value: string }
    >('#confirmation-field');

    if (!checkboxField) {
      return;
    }

    checkboxField.value = 'confirmed';
  }

  private _scheduleCalendarNativeFormDataRender() {
    requestAnimationFrame(() => {
      this._renderNativeFormData(
        this._calendarDemoFormRef,
        this.calendarNativeFormDataJson,
      );
    });
  }

  private _scheduleCheckboxNativeFormDataRender() {
    requestAnimationFrame(() => {
      this._restoreCheckboxFieldValue();
      this._renderNativeFormData(
        this._checkboxDemoFormRef,
        this.checkboxNativeFormDataJson,
      );
    });
  }

  private _scheduleComboNativeFormDataRender() {
    requestAnimationFrame(() => {
      this._renderNativeFormData(
        this._comboDemoFormRef,
        this.comboNativeFormDataJson,
      );
    });
  }

  private _scheduleMultiSelectNativeFormDataRender() {
    requestAnimationFrame(() => {
      this._renderNativeFormData(
        this._multiSelectDemoFormRef,
        this.multiSelectNativeFormDataJson,
      );
    });
  }

  private _serializeFormData(formData: FormData): FormDataJson {
    const entries: FormDataJson = {};

    formData.forEach((value, name) => {
      const normalizedValue = String(value);
      const currentEntry = entries[name];

      if (currentEntry === undefined) {
        entries[name] = normalizedValue;
        return;
      }

      if (Array.isArray(currentEntry)) {
        currentEntry.push(normalizedValue);
        return;
      }

      entries[name] = [currentEntry, normalizedValue];
    });

    return entries;
  }
}
