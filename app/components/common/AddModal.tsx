import React, { useState } from 'react';
import { X, BookOpen, FileText, Plus, Sparkles } from 'lucide-react';

// ==========================================
// TYPES & INTERFACES
// ==========================================
export type EntryType = 'book' | 'note';

export interface NewBookData {
  title: string;
  author: string;
  category: 'Productivity' | 'Focus' | 'Finance' | 'Philosophy';
  pages: number;
}

export interface NewNoteData {
  bookTitle: string;
  quote: string;
  reflection: string;
  tags: string;
}

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook?: (data: NewBookData) => void;
  onSaveNote?: (data: NewNoteData) => void;
  defaultTab?: EntryType;
}

const AddModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  onSaveBook,
  onSaveNote,
  defaultTab = 'book',
}) => {
  const [activeTab, setActiveTab] = useState<EntryType>(defaultTab);

  // Book Form State
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCategory, setBookCategory] = useState<'Productivity' | 'Focus' | 'Finance' | 'Philosophy'>('Productivity');
  const [bookPages, setBookPages] = useState<number>(300);

  // Note Form State
  const [noteBookTitle, setNoteBookTitle] = useState('');
  const [noteQuote, setNoteQuote] = useState('');
  const [noteReflection, setNoteReflection] = useState('');
  const [noteTags, setNoteTags] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'book') {
      if (!bookTitle || !bookAuthor) return;
      if (onSaveBook) {
        onSaveBook({
          title: bookTitle,
          author: bookAuthor,
          category: bookCategory,
          pages: Number(bookPages),
        });
      }
    } else {
      if (!noteQuote || !noteBookTitle) return;
      if (onSaveNote) {
        onSaveNote({
          bookTitle: noteBookTitle,
          quote: noteQuote,
          reflection: noteReflection,
          tags: noteTags,
        });
      }
    }
    // Reset and close
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-[#EEEEEE]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#171A20]">Add to Knowledge Vault</h3>
              <p className="text-xs text-[#5C5E62]">Log a new book or capture a key quote/note.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 bg-[#F4F4F4] hover:bg-[#EEEEEE] rounded-full transition-all text-[#171A20]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#EEEEEE]/70 p-1 rounded-lg border border-[#D0D1D2]/40">
          <button
            type="button"
            onClick={() => setActiveTab('book')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'book' 
                ? 'bg-white text-[#171A20] shadow-sm' 
                : 'text-[#5C5E62] hover:text-[#171A20]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> New Book
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('note')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'note' 
                ? 'bg-white text-[#171A20] shadow-sm' 
                : 'text-[#5C5E62] hover:text-[#171A20]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Quote / Note
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'book' ? (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5C5E62]">Book Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Atomic Habits" 
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-lg px-3 py-2 text-sm text-[#171A20] focus:outline-none focus:border-[#3E6AE1]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5C5E62]">Author</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. James Clear" 
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-lg px-3 py-2 text-sm text-[#171A20] focus:outline-none focus:border-[#3E6AE1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#5C5E62]">Category</label>
                  <select 
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value as any)}
                    className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-lg px-3 py-2 text-sm text-[#171A20] focus:outline-none focus:border-[#3E6AE1]"
                  >
                    <option value="Productivity">Productivity</option>
                    <option value="Focus">Focus</option>
                    <option value="Finance">Finance</option>
                    <option value="Philosophy">Philosophy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#5C5E62]">Total Pages</label>
                  <input 
                    type="number" 
                    value={bookPages}
                    onChange={(e) => setBookPages(Number(e.target.value))}
                    className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-lg px-3 py-2 text-sm text-[#171A20] focus:outline-none focus:border-[#3E6AE1]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5C5E62]">Book / Source Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Deep Work" 
                  value={noteBookTitle}
                  onChange={(e) => setNoteBookTitle(e.target.value)}
                  className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-lg px-3 py-2 text-sm text-[#171A20] focus:outline-none focus:border-[#3E6AE1]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5C5E62]">Favorite Quote / Excerpt</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Paste the exact quote here..." 
                  value={noteQuote}
                  onChange={(e) => setNoteQuote(e.target.value)}
                  className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-lg px-3 py-2 text-sm text-[#171A20] focus:outline-none focus:border-[#3E6AE1]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5C5E62]">Personal Reflection</label>
                <textarea 
                  rows={2}
                  placeholder="What does this mean for your daily routine?" 
                  value={noteReflection}
                  onChange={(e) => setNoteReflection(e.target.value)}
                  className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-lg px-3 py-2 text-sm text-[#171A20] focus:outline-none focus:border-[#3E6AE1]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#5C5E62]">Tags (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Systems, Focus" 
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-lg px-3 py-2 text-sm text-[#171A20] focus:outline-none focus:border-[#3E6AE1]"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-[#EEEEEE]">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F4F4F4] hover:bg-[#EEEEEE] text-[#171A20] rounded-lg text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#171A20] hover:bg-[#393C41] text-white rounded-lg text-sm font-medium transition-all shadow-sm"
            >
               Save {activeTab === 'book' ? 'Book' : 'Note'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddModal;