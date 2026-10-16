import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Bookmark,
  FileText,
  Sparkles,
  ChevronRight,
  X,
  Check,
  Quote,
} from 'lucide-react';
import type { NewBookData, NewNoteData } from '~/components/common/AddModal';
import AddModal from '~/components/common/AddModal';

// ==========================================
// TYPES & INTERFACES
// ==========================================
type Category = 'All' | 'Productivity' | 'Focus' | 'Finance' | 'Philosophy';
type ActiveTab = 'books' | 'notes';

interface Book {
  id: number;
  title: string;
  author: string;
  progress: number;
  category: Exclude<Category, 'All'>;
  coverColor: string; // Tailwind background class for 3D cover
  summary: string;
  pages: number;
  currentPage: number;
}

interface Note {
  id: number;
  bookTitle: string;
  quote: string;
  reflection: string;
  date: string;
  tags: string[];
}

const Library: React.FC = () => {
  // State with explicit TypeScript types
  const [activeTab, setActiveTab] = useState<ActiveTab>('books');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // Mock Books Data
  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      progress: 85,
      category: 'Productivity',
      coverColor: 'bg-[#171A20]',
      summary:
        'Tiny changes deliver remarkable results through compounding habits and systems optimization.',
      pages: 320,
      currentPage: 272,
    },
    {
      id: 2,
      title: 'Deep Work',
      author: 'Cal Newport',
      progress: 40,
      category: 'Focus',
      coverColor: 'bg-[#393C41]',
      summary:
        'Rules for focused success in a distracted world by eliminating shallow distractions.',
      pages: 304,
      currentPage: 121,
    },
    {
      id: 3,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      progress: 100,
      category: 'Finance',
      coverColor: 'bg-[#5C5E62]',
      summary:
        'Timeless lessons on wealth, greed, and happiness emphasizing behavior over raw intelligence.',
      pages: 256,
      currentPage: 256,
    },
    {
      id: 4,
      title: 'Meditations',
      author: 'Marcus Aurelius',
      progress: 60,
      category: 'Philosophy',
      coverColor: 'bg-[#2D58CC]',
      summary:
        'Personal writings by the Roman Emperor on Stoic philosophy, duty, and inner resilience.',
      pages: 300,
      currentPage: 180,
    },
  ]);

  // Mock Notes & Highlights Data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      bookTitle: 'Atomic Habits',
      quote:
        'You do not rise to the level of your goals. You fall to the level of your systems.',
      reflection:
        'Need to focus more on building automated daily triggers rather than outcome goals.',
      date: 'Oct 12, 2026',
      tags: ['Systems', 'Goals'],
    },
    {
      id: 2,
      bookTitle: 'Deep Work',
      quote:
        "If you don't produce, you won't thrive — no matter how skilled or talented you are.",
      reflection:
        'Schedule 2 uninterrupted hours of deep work every single morning before checking email.',
      date: 'Oct 10, 2026',
      tags: ['Focus', 'Productivity'],
    },
    {
      id: 3,
      bookTitle: 'The Psychology of Money',
      quote:
        'Doing well with money has a little to do with how smart you are and a lot to do with how you behave.',
      reflection:
        'Emotional control is vastly more important than complex financial spreadsheets.',
      date: 'Oct 05, 2026',
      tags: ['Finance', 'Behavior'],
    },
  ]);

  // Categories list
  const categories: Category[] = [
    'All',
    'Productivity',
    'Focus',
    'Finance',
    'Philosophy',
  ];

  // Filter logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredNotes = notes.filter((note) => {
    return (
      note.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.reflection.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSaveBook = (data: NewBookData) => {
    console.log("New book submitted:", data);
    // Add logic to update your books state or backend here
  };

  const handleSaveNote = (data: NewNoteData) => {
    console.log("New note submitted:", data);
    // Add logic to update your notes state or backend here
  };

  return (
    <div className='min-h-screen rounded-xl bg-[#F4F4F4] text-[#171A20] p-4 sm:p-8 space-y-8 max-w-6xl mx-auto font-sans'>
      {/* HEADER SECTION */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-[#EEEEEE] shadow-sm'>
        <div>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'>
            <Sparkles className='w-4 h-4 text-[#3E6AE1]' />
            <span>Knowledge Base</span>
          </div>
          <h1 className='text-2xl font-bold tracking-tight text-[#171A20] mt-1'>
            Library & Notes
          </h1>
          <p className='text-xs text-[#5C5E62]'>
            Manage your active reads, summaries, and personal reflections.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className='flex items-center gap-2 bg-[#171A20] hover:bg-[#393C41] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm'
        >
          <Plus className='w-4 h-4' /> Add New Item
        </button>
      </div>

      {/* SEARCH & TAB SWITCHER BAR */}
      <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4'>
        {/* Tab Switcher */}
        <div className='flex bg-[#EEEEEE]/70 p-1 rounded-lg border border-[#D0D1D2]/40 w-fit'>
          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'books'
                ? 'bg-white text-[#171A20] shadow-sm'
                : 'text-[#5C5E62] hover:text-[#171A20]'
            }`}
          >
            <BookOpen className='w-4 h-4' /> Books Library ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'notes'
                ? 'bg-white text-[#171A20] shadow-sm'
                : 'text-[#5C5E62] hover:text-[#171A20]'
            }`}
          >
            <FileText className='w-4 h-4' /> Notes & Quotes ({notes.length})
          </button>
        </div>

        {/* Search Box */}
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C5E62]' />
          <input
            type='text'
            placeholder={
              activeTab === 'books'
                ? 'Search books or authors...'
                : 'Search notes, quotes, or keywords...'
            }
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className='w-full bg-white border border-[#D0D1D2] rounded-lg pl-10 pr-4 py-2 text-sm text-[#171A20] placeholder-[#5C5E62] focus:outline-none focus:border-[#3E6AE1] transition-all shadow-sm'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5C5E62] hover:text-[#171A20]'
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY FILTER CHIPS (Only shown in books tab) */}
      {activeTab === 'books' && (
        <div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#171A20] text-white shadow-sm'
                  : 'bg-white border border-[#EEEEEE] text-[#393C41] hover:border-[#D0D1D2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ================= MAIN CONTENT AREA ================= */}

      {activeTab === 'books' ? (
        /* BOOKS GRID WITH 3D HOVER ANIMATIONS */
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className='group relative bg-white border border-[#EEEEEE] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#D0D1D2] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4'
            >
              {/* Top Meta */}
              <div className='flex justify-between items-start'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-[#3E6AE1] bg-[#3E6AE1]/10 px-2 py-0.5 rounded'>
                  {book.category}
                </span>
                <Bookmark className='w-4 h-4 text-[#5C5E62] group-hover:text-[#171A20] transition-colors' />
              </div>

              {/* 3D Interactive Book Graphic Simulation */}
              <div className='flex items-center gap-4 py-2'>
                <div
                  className={`w-16 h-22 ${book.coverColor} rounded-r-md rounded-l-sm shadow-md flex items-center justify-center p-2 text-white text-center transform group-hover:-rotate-y-12 group-hover:scale-105 transition-transform duration-500 perspective-1000 relative border-l-2 border-white/20`}
                >
                  <span className='text-[9px] font-bold leading-tight line-clamp-3'>
                    {book.title}
                  </span>
                </div>
                <div className='space-y-1 flex-1'>
                  <h3 className='font-semibold text-base text-[#171A20] group-hover:text-[#3E6AE1] transition-colors'>
                    {book.title}
                  </h3>
                  <p className='text-xs text-[#5C5E62]'>{book.author}</p>
                  <p className='text-[11px] text-[#393C41] line-clamp-2 mt-1'>
                    {book.summary}
                  </p>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className='space-y-1.5 pt-2 border-t border-[#EEEEEE]'>
                <div className='flex justify-between text-xs text-[#5C5E62]'>
                  <span>Reading Progress</span>
                  <span className='font-medium text-[#171A20]'>
                    {book.progress}%
                  </span>
                </div>
                <div className='w-full bg-[#EEEEEE] h-1.5 rounded-full overflow-hidden'>
                  <div
                    className='bg-[#171A20] h-full rounded-full transition-all duration-500'
                    style={{ width: `${book.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {filteredBooks.length === 0 && (
            <div className='col-span-full py-16 text-center space-y-2 bg-white rounded-xl border border-[#EEEEEE]'>
              <BookOpen className='w-8 h-8 text-[#5C5E62] mx-auto opacity-50' />
              <p className='text-sm font-medium text-[#171A20]'>
                No books found
              </p>
              <p className='text-xs text-[#5C5E62]'>
                Try adjusting your search query or category filter.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* NOTES & QUOTES TAB */
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className='bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-sm hover:border-[#D0D1D2] transition-all space-y-4 flex flex-col justify-between'
            >
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-xs font-semibold text-[#3E6AE1] bg-[#3E6AE1]/10 px-2 py-0.5 rounded'>
                    {note.bookTitle}
                  </span>
                  <span className='text-[11px] text-[#5C5E62]'>
                    {note.date}
                  </span>
                </div>

                <div className='flex gap-3 bg-[#F4F4F4] p-3.5 rounded-lg border-l-2 border-[#3E6AE1]'>
                  <Quote className='w-5 h-5 text-[#5C5E62] shrink-0 mt-0.5' />
                  <p className='text-sm font-medium text-[#171A20] italic'>
                    "{note.quote}"
                  </p>
                </div>

                <div className='space-y-1'>
                  <p className='text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'>
                    Personal Reflection
                  </p>
                  <p className='text-xs text-[#393C41] leading-relaxed'>
                    {note.reflection}
                  </p>
                </div>
              </div>

              <div className='flex items-center justify-between pt-3 border-t border-[#EEEEEE]'>
                <div className='flex items-center gap-1.5'>
                  {note.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className='text-[10px] bg-[#EEEEEE] text-[#5C5E62] px-2 py-0.5 rounded font-mono'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <button className='text-xs font-medium text-[#3E6AE1] hover:underline'>
                  Edit Note
                </button>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className='col-span-full py-16 text-center space-y-2 bg-white rounded-xl border border-[#EEEEEE]'>
              <FileText className='w-8 h-8 text-[#5C5E62] mx-auto opacity-50' />
              <p className='text-sm font-medium text-[#171A20]'>
                No notes or quotes found
              </p>
              <p className='text-xs text-[#5C5E62]'>
                Try a different search term.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= BOOK DETAIL MODAL ================= */}
      {selectedBook && (
        <div className='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-[#EEEEEE] animate-fadeIn'>
            <div className='flex justify-between items-start'>
              <div>
                <span className='text-[10px] font-bold uppercase tracking-wider text-[#3E6AE1] bg-[#3E6AE1]/10 px-2 py-0.5 rounded'>
                  {selectedBook.category}
                </span>
                <h2 className='text-xl font-bold text-[#171A20] mt-1'>
                  {selectedBook.title}
                </h2>
                <p className='text-xs text-[#5C5E62]'>
                  By {selectedBook.author}
                </p>
              </div>
              <button
                onClick={() => setSelectedBook(null)}
                className='p-1.5 bg-[#F4F4F4] hover:bg-[#EEEEEE] rounded-full transition-all text-[#171A20]'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            <div className='space-y-3 bg-[#F4F4F4] p-4 rounded-xl'>
              <h4 className='text-xs font-bold text-[#5C5E62] uppercase tracking-wider'>
                Book Summary
              </h4>
              <p className='text-sm text-[#393C41] leading-relaxed'>
                {selectedBook.summary}
              </p>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between text-xs text-[#5C5E62]'>
                <span>
                  Pages read ({selectedBook.currentPage} / {selectedBook.pages})
                </span>
                <span className='font-semibold text-[#171A20]'>
                  {selectedBook.progress}%
                </span>
              </div>
              <div className='w-full bg-[#EEEEEE] h-2 rounded-full overflow-hidden'>
                <div
                  className='bg-[#171A20] h-full rounded-full'
                  style={{ width: `${selectedBook.progress}%` }}
                />
              </div>
            </div>

            <div className='flex justify-end gap-3 pt-2'>
              <button
                onClick={() => setSelectedBook(null)}
                className='px-4 py-2 bg-[#F4F4F4] hover:bg-[#EEEEEE] text-[#171A20] rounded-lg text-sm font-medium transition-all'
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Opening reading view for ${selectedBook.title}`);
                  setSelectedBook(null);
                }}
                className='px-4 py-2 bg-[#171A20] hover:bg-[#393C41] text-white rounded-lg text-sm font-medium transition-all'
              >
                Continue Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD NEW MODAL PLACEHOLDER ================= */}
      {isAddModalOpen && (
        <AddModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveBook={handleSaveBook}
        onSaveNote={handleSaveNote}
        defaultTab="book" // or "note" depending on what you want open by default
      />
      )}
    </div>
  );
};

export default Library;
