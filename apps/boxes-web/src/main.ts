import '@/boxes/combobox';
import '@/boxes/checkbox';
import '@/boxes/multi-select';
import '@/boxes/calendar-picker';

function generateQuestDates(count = 7) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const pad = (n: number) => String(n).padStart(2, '0');
    return {
      value: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
      label: `${days[date.getDay()]} ${date.getDate()}`,
    };
  });
}

const calendarPicker = document.querySelector('#quest-date-field');
for (const { value, label } of generateQuestDates()) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  calendarPicker?.appendChild(option);
}

type FormDataEntryJson = string | string[];

type FormDataJson = Record<string, FormDataEntryJson>;

const comboForm = document.querySelector<HTMLFormElement>('#combo-demo-form');
const comboResult = document.querySelector<HTMLElement>('#combo-result');
const checkboxForm =
  document.querySelector<HTMLFormElement>('#checkbox-demo-form');
const checkboxResult = document.querySelector<HTMLElement>('#checkbox-result');
const multiSelectForm = document.querySelector<HTMLFormElement>(
  '#multi-select-demo-form',
);
const multiSelectResult =
  document.querySelector<HTMLElement>('#multi-select-result');
const calendarForm =
  document.querySelector<HTMLFormElement>('#calendar-demo-form');
const calendarResult = document.querySelector<HTMLElement>('#calendar-result');

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

function renderFormData(
  currentForm: HTMLFormElement,
  currentResult: HTMLElement | null,
) {
  if (!currentResult) {
    return;
  }

  currentResult.textContent = JSON.stringify(
    serializeFormData(currentForm),
    null,
    2,
  );
}

function initializeStaticForm(
  currentForm: HTMLFormElement | null,
  currentResult: HTMLElement | null,
) {
  if (!currentForm) {
    return;
  }

  renderFormData(currentForm, currentResult);

  currentForm.addEventListener('change', () => {
    requestAnimationFrame(() => {
      renderFormData(currentForm, currentResult);
    });
  });

  currentForm.addEventListener('reset', () => {
    requestAnimationFrame(() => {
      renderFormData(currentForm, currentResult);
    });
  });

  currentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    renderFormData(currentForm, currentResult);
    currentForm.reportValidity();
  });
}

initializeStaticForm(comboForm, comboResult);
initializeStaticForm(checkboxForm, checkboxResult);
initializeStaticForm(multiSelectForm, multiSelectResult);
initializeStaticForm(calendarForm, calendarResult);
