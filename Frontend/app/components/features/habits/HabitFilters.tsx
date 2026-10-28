
import { Search } from 'lucide-react';

interface HabitFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  availableTags: string[];
  selectedTag: string;
  onTagChange: (value: string) => void;
}

export default function HabitFilters({
  search,
  onSearchChange,
  availableTags,
  selectedTag,
  onTagChange,
}: HabitFiltersProps) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
      <label className="relative block w-full sm:max-w-xs">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#858580]"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search habits or tags..."
          aria-label="Search habits"
          className="w-full rounded-lg border border-[#d8d8d3] bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#fa3600]"
        />
      </label>

      <select
        value={selectedTag}
        onChange={(event) => onTagChange(event.target.value)}
        aria-label="Filter habits by tag"
        className="rounded-lg border border-[#d8d8d3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#fa3600]"
      >
        <option value="all">All tags</option>
        {availableTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}
