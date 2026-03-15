import { CalendarPicker } from '@/boxes/calendar-picker';
import { Checkbox } from '@/boxes/checkbox';
import { Combobox } from '@/boxes/combobox';
import { MultiSelect } from '@/boxes/multi-select';
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';

export type FormDataEntryJson = string | string[];

export type FormDataJson = Record<string, FormDataEntryJson>;

type FormSubmitEvent = SyntheticEvent<HTMLFormElement, SubmitEvent>;

type FormPreview = {
  formDataJson: string;
  formRef: React.RefObject<HTMLFormElement | null>;
  handleSubmit: (event: FormSubmitEvent) => void;
};

function serializeFormData(currentForm: HTMLFormElement): FormDataJson {
  const entries: FormDataJson = {};
  const formData = new FormData(currentForm);

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

function useFormPreview(): FormPreview {
  const formRef = useRef<HTMLFormElement>(null);
  const [formDataJson, setFormDataJson] = useState('{}');
  const renderFormData = useCallback(() => {
    const currentForm = formRef.current;

    if (!currentForm) {
      return;
    }

    setFormDataJson(JSON.stringify(serializeFormData(currentForm), null, 2));
  }, []);

  useEffect(() => {
    const currentForm = formRef.current;

    if (!currentForm) {
      return;
    }

    const scheduleRender = () => {
      window.requestAnimationFrame(() => {
        renderFormData();
      });
    };

    renderFormData();
    currentForm.addEventListener('change', scheduleRender);
    currentForm.addEventListener('reset', scheduleRender);

    return () => {
      currentForm.removeEventListener('change', scheduleRender);
      currentForm.removeEventListener('reset', scheduleRender);
    };
  }, [renderFormData]);

  const handleSubmit = (event: FormSubmitEvent) => {
    event.preventDefault();
    renderFormData();
    formRef.current?.reportValidity();
  };

  return {
    formDataJson,
    formRef,
    handleSubmit,
  };
}

export function App() {
  const comboPreview = useFormPreview();
  const checkboxPreview = useFormPreview();
  const multiSelectPreview = useFormPreview();
  const calendarPreview = useFormPreview();

  return (
    <main className="demo-stack">
      <section className="demo-card">
        <h1>React FACE Baselines</h1>
        <p className="demo-copy">
          These examples mirror the plain web baseline, but they are authored
          in React with generated JSX typings for the custom elements. The JSON
          still shows the browser's current native <code>FormData</code> for the
          same controls.
        </p>
      </section>

      <section className="demo-card">
        <h2>Simple Combobox</h2>
        <p className="demo-copy">
          This is the control-group example. It is a select-only FACE control
          with a single scalar <code>value</code> and ordinary form
          participation.
        </p>
        <form
          ref={comboPreview.formRef}
          className="demo-form"
          onSubmit={comboPreview.handleSubmit}
        >
          <label>
            Produce choice
            <Combobox id="produce-field" name="produce" required>
              <option value="">
                Choose a produce item
              </option>
              <option value="blueberry">Blueberry</option>
              <option value="lemon">Lemon</option>
              <option value="mango">Mango</option>
            </Combobox>
          </label>

          <div className="button-row">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </form>
        <p>Current FormData JSON</p>
        <pre>{comboPreview.formDataJson}</pre>
      </section>

      <section className="demo-card">
        <h2>Checkbox Control</h2>
        <p className="demo-copy">
          This setup is valid because checkbox-like controls are driven by
          <code>checked</code>, not by a scalar text-like <code>value</code>.
          When the box is unchecked, the field disappears from native
          <code>FormData</code> entirely.
        </p>
        <form
          ref={checkboxPreview.formRef}
          className="demo-form"
          onSubmit={checkboxPreview.handleSubmit}
        >
          <label className="checkbox-row">
            <Checkbox
              id="confirmation-field"
              name="confirmedProduce"
              value="confirmed"
            ></Checkbox>
            <span>Confirm the produce selection</span>
          </label>

          <div className="button-row">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </form>
        <p>Current FormData JSON</p>
        <pre>{checkboxPreview.formDataJson}</pre>
      </section>

      <section className="demo-card">
        <h2>Multi-Select Control</h2>
        <p className="demo-copy">
          This setup is valid because a multi-select submits a collection. The
          native shape is repeated <code>produceTags</code> entries, not one
          scalar value. Because this control is still select-like, it keeps both
          <code>input</code> and <code>change</code> rather than forcing a
          change-only contract.
        </p>
        <form
          ref={multiSelectPreview.formRef}
          className="demo-form"
          onSubmit={multiSelectPreview.handleSubmit}
        >
          <label>
            Produce tags
            <MultiSelect name="produceTags" required>
              <option value="fresh">Fresh</option>
              <option value="imported">Imported</option>
              <option value="organic">Organic</option>
              <option value="seasonal">Seasonal</option>
            </MultiSelect>
          </label>

          <div className="button-row">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </form>
        <p>Current FormData JSON</p>
        <pre>{multiSelectPreview.formDataJson}</pre>
      </section>

      <section className="demo-card">
        <h2>Calendar Picker</h2>
        <p className="demo-copy">
          This setup is valid because choosing a date from a calendar grid is a
          commit action. There is no incremental text edit stream, so
          <code>change</code> is the meaningful event and omitting
          <code>input</code> is a reasonable implementation choice.
        </p>
        <form
          ref={calendarPreview.formRef}
          className="demo-form"
          onSubmit={calendarPreview.handleSubmit}
        >
          <label>
            Delivery date
            <CalendarPicker
              name="deliveryDate"
              placeholder="Choose a delivery date"
              required
            >
              <option value="2026-03-16">Mon 16</option>
              <option value="2026-03-17">Tue 17</option>
              <option value="2026-03-18">Wed 18</option>
              <option value="2026-03-19">Thu 19</option>
              <option value="2026-03-20">Fri 20</option>
              <option value="2026-03-21">Sat 21</option>
              <option value="2026-03-22">Sun 22</option>
            </CalendarPicker>
          </label>

          <div className="button-row">
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
          </div>
        </form>
        <p>Current FormData JSON</p>
        <pre>{calendarPreview.formDataJson}</pre>
      </section>
    </main>
  );
}

export default App;
