import { useState } from "react";
import {
  Clock, CheckCheck, BookOpen, FileText, GitCommitVertical,
  BarChart3, Search, Plus, ChevronDown, ChevronLeft, ChevronRight,
} from "lucide-react";

const NAV = [
  { id: "today", label: "Today", icon: Clock },
  { id: "habits", label: "Habits", icon: CheckCheck },
  { id: "library", label: "Library", icon: BookOpen },
  { id: "journal", label: "Journal", icon: FileText },
  { id: "timeline", label: "Timeline", icon: GitCommitVertical },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

const PINNED = ["Atomic Habits", "Weekly Reflection"];

export default function Sidebar({
  active = "library",
  onNavigate = () => {},
  onQuickCapture = () => {},
  onSearch = () => {},
  user = { name: "Alex Morgan", workspace: "Alex", initial: "A" },
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex h-screen flex-col border-r border-neutral-300 bg-[#ececec] font-mono text-[12px] uppercase tracking-wide text-neutral-600 transition-[width] duration-200 ${
        collapsed ? "w-[72px]" : "w-[315px]"
      }`}
    >
      {/* Brand */}
      <div className="mx-5 flex h-[75px] items-center justify-between border-b border-neutral-300">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center border border-neutral-500 bg-white">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff3d00]" />
          </div>
          {!collapsed && (
            <span className="font-sans text-[16px] font-semibold normal-case tracking-tight text-neutral-900">
              GROWTH <span className="text-[#ff3d00]">OS</span>
            </span>
          )}
        </div>
        {!collapsed && (
          <button
            aria-label="Collapse sidebar"
            onClick={() => setCollapsed(true)}
            className="text-neutral-500 hover:text-neutral-900"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {collapsed && (
          <button
            aria-label="Expand sidebar"
            onClick={() => setCollapsed(false)}
            className="absolute left-[56px] text-neutral-500"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Workspace switcher */}
      {!collapsed && (
        <button className="mx-5 mt-5 flex items-center gap-3 rounded-lg border border-neutral-400 bg-transparent p-3 text-left hover:bg-white/50">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-800 font-sans text-sm font-semibold text-white">
            {user.initial}
          </span>
          <span className="flex-1 leading-tight">
            <span className="block font-sans text-[14px] font-semibold text-neutral-900">{user.workspace}</span>
            <span className="block font-sans text-[12px] normal-case tracking-normal text-neutral-500">
              Personal workspace
            </span>
          </span>
          <ChevronDown size={16} />
        </button>
      )}

      {/* Navigation */}
      <nav className="mt-4 flex-1 overflow-y-auto">
        <ul className="mx-5 flex flex-col">
          {NAV.map(({ id, label, icon: Icon }, i) => {
            const isActive = id === active;
            return (
              <li key={id} className="relative border-b border-neutral-300">
                {isActive && <span className="absolute -left-5 top-0 h-full w-[3px] bg-[#ff3d00]" />}
                <button
                  onClick={() => onNavigate()}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-[54px] w-full items-center gap-4 px-2 ${
                    isActive ? "font-semibold text-[#ff3d00]" : "hover:text-neutral-900"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.6} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left text-[13px]">{label}</span>
                      <span className="text-[9px] opacity-70">{String(i + 1).padStart(2, "0")}</span>
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Search + quick capture */}
        {!collapsed && (
          <div className="mx-5 mt-5 border-t border-neutral-300 pt-4">
            <button onClick={onSearch} className="flex h-10 w-full items-center gap-4 px-2 hover:text-neutral-900">
              <Search size={18} strokeWidth={1.6} />
              <span className="flex-1 text-left text-[13px]">Search</span>
              <kbd className="rounded border border-neutral-400 bg-white px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>

            <button
              onClick={onQuickCapture}
              className="mt-4 flex h-[53px] w-full items-center justify-center gap-3 rounded-lg bg-[#ff3d00] text-[12px] font-medium text-white hover:bg-[#e63700]"
            >
              <Plus size={18} /> Quick capture
            </button>

            {/* Pinned */}
            <p className="mt-8 px-2 text-[11px] font-bold text-neutral-500">Pinned</p>
            <ul className="mt-3">
              {PINNED.map((p) => (
                <li key={p}>
                  <button className="flex w-full items-center gap-2 px-2 py-3 text-[12px] hover:text-neutral-900">
                    <span className="flex items-center text-neutral-400">
                      <span className="h-px w-3 bg-neutral-400" />
                      <span className="h-1.5 w-1.5 rounded-full border border-neutral-400" />
                    </span>
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Footer user */}
      <button className="flex items-center gap-3 border-t border-neutral-300 px-5 py-4 text-left">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-800 font-sans text-sm font-semibold text-white">
          {user.initial}
        </span>
        {!collapsed && (
          <span className="leading-tight">
            <span className="block text-[12px] font-bold text-neutral-900">{user.name}</span>
            <span className="block font-sans text-[12px] normal-case tracking-normal text-neutral-500">
              Settings &amp; system
            </span>
          </span>
        )}
      </button>
    </aside>
  );
}