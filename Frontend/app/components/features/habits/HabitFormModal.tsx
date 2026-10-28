
import { useState, type FormEvent } from 'react';
import { LoaderCircle, X } from 'lucide-react';

import type {
  CreateHabitInput,
  Habit,
  HabitScheduleType,
} from '~/lib/habits';

interface HabitFormModalProps {
  habit: Habit | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: CreateHabitInput) => Promise<boolean>;
}

const inputClass =
  'mt-1 w-full rounded-lg border border-[#d8d8d3] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#fa3600] focus:ring-2 focus:ring-[#fa3600]/10';

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#fa3600] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92f00] disabled:cursor-not-allowed disabled:opacity-50';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8d8d3] bg-white px-4 py-2.5 text-sm font-medium text-[#333] transition hover:bg-[#f6f6f3] disabled:opacity-50';

const DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function HabitFormModal({
  habit,
  isSaving,
  onClose,
  onSave,
}: HabitFormModalProps) {
  const [title, setTitle] = useState(habit?.title ?? '');
  const [description, setDescription] = useState(
    habit?.description ?? '',
  );
  const [tagsInput, setTagsInput] = useState(
    habit?.tags.join(', ') ?? '',
  );

  const [scheduleType, setScheduleType] =
    useState<HabitScheduleType>(
      habit?.schedule.type ?? 'daily',
    );

  const [selectedDays, setSelectedDays] = useState<number[]>(
    habit?.schedule.daysOfWeek ?? [1, 2, 3, 4, 5],
  );

  const [targetCount, setTargetCount] = useState(
    String(habit?.target.count ?? 1),
  );
  const [targetUnit, setTargetUnit] = useState(
    habit?.target.unit ?? 'times',
  );
  const [startDate, setStartDate] = useState(
    habit?.startDate ?? localDateString(new Date()),
  );
  const [color, setColor] = useState(
    habit?.color ?? '#fa3600',
  );
  const [formError, setFormError] = useState('');

  function toggleDay(day: number) {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day].sort(),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setFormError('Enter a habit name.');
      return;
    }

    if (scheduleType === 'custom' && selectedDays.length === 0) {
      setFormError('Choose at least one day for a custom schedule.');
      return;
    }

    const count = Number(targetCount);

    if (!Number.isInteger(count) || count < 1) {
      setFormError('The target must be a whole number of at least 1.');
      return;
    }

    const tags = [
      ...new Set(
        tagsInput
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];

    if (tags.length > 10) {
      setFormError('You can add a maximum of 10 tags.');
      return;
    }

    const data: CreateHabitInput = {
      title: cleanTitle,
      description: description.trim() || undefined,
      tags,
      schedule:
        scheduleType === 'custom'
          ? { type: scheduleType, daysOfWeek: selectedDays }
          : { type: scheduleType },
      target: {
        count,
        unit: targetUnit.trim() || 'times',
      },
      timezone:
        habit?.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        'Asia/Kolkata',
      startDate,
      color,
    };

    const succeeded = await onSave(data);

    if (succeeded) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-form-title"
        className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-[#e7e7e2] bg-white p-5 shadow-xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#72726f]">
              {habit ? 'Edit practice' : 'New practice'}
            </p>

            <h2
              id="habit-form-title"
              className="mt-2 text-2xl font-normal"
            >
              {habit ? 'Edit habit' : 'Create a habit'}
            </h2>

            <p className="mt-2 text-sm text-[#72726f]">
              Define a routine you can realistically repeat.
            </p>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            aria-label="Close habit dialog"
            className="rounded-lg p-2 text-[#72726f] hover:bg-[#f4f4f1] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {formError && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="habit-title" className="text-sm font-medium">
              Habit name *
            </label>
            <input
              id="habit-title"
              required
              maxLength={80}
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Read for 20 minutes"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="habit-description"
              className="text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="habit-description"
              maxLength={300}
              rows={2}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Why is this habit important to you?"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="habit-tags" className="text-sm font-medium">
              Tags
            </label>
            <input
              id="habit-tags"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="health, learning, focus"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-[#858580]">
              Separate tags with commas, up to 10 tags.
            </p>
          </div>

          <div>
            <label
              htmlFor="habit-schedule"
              className="text-sm font-medium"
            >
              Schedule
            </label>
            <select
              id="habit-schedule"
              value={scheduleType}
              onChange={(event) =>
                setScheduleType(
                  event.target.value as HabitScheduleType,
                )
              }
              className={inputClass}
            >
              <option value="daily">Every day</option>
              <option value="weekdays">Monday to Friday</option>
              <option value="custom">Choose specific days</option>
            </select>
          </div>

          {scheduleType === 'custom' && (
            <fieldset>
              <legend className="text-sm font-medium">
                Repeat on *
              </legend>

              <div className="mt-2 flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const selected = selectedDays.includes(day.value);

                  return (
                    <button
                      key={day.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleDay(day.value)}
                      className={`rounded-lg border px-3 py-2 text-xs transition ${
                        selected
                          ? 'border-[#fa3600] bg-[#fff0eb] text-[#c32c00]'
                          : 'border-[#d8d8d3] bg-white text-[#626260] hover:bg-[#f6f6f3]'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="habit-target-count"
                className="text-sm font-medium"
              >
                Daily target *
              </label>
              <input
                id="habit-target-count"
                type="number"
                min={1}
                max={100000}
                step={1}
                required
                value={targetCount}
                onChange={(event) => setTargetCount(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="habit-target-unit"
                className="text-sm font-medium"
              >
                Target unit
              </label>
              <input
                id="habit-target-unit"
                maxLength={20}
                value={targetUnit}
                onChange={(event) => setTargetUnit(event.target.value)}
                placeholder="pages, glasses, times..."
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="habit-start-date"
                className="text-sm font-medium"
              >
                Start date *
              </label>
              <input
                id="habit-start-date"
                type="date"
                required
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="habit-color"
                className="text-sm font-medium"
              >
                Accent color
              </label>
              <input
                id="habit-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="mt-1 h-[42px] w-full cursor-pointer rounded-lg border border-[#d8d8d3] bg-white p-1"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[#ededE8] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className={secondaryButtonClass}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={primaryButtonClass}
            >
              {isSaving && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              {isSaving
                ? 'Saving...'
                : habit
                  ? 'Save changes'
                  : 'Create habit'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
