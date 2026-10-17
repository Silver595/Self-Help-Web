import React, { useState } from 'react';
import {
  BookOpen,
  Wallet,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Search,
  ChevronRight,
} from 'lucide-react';
import PrimaryButton from '~/components/common/PrimaryButton';
import SecoundaryButton from '~/components/common/SecoundaryButton';
import type { NewBookData, NewNoteData } from '~/components/common/AddModal';
import AddModal from '~/components/common/AddModal';

const Dashboard = () => {
  // Sample State Data for Notes / Books
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      progress: 85,
      category: 'Productivity',
    },
    {
      id: 2,
      title: 'Deep Work',
      author: 'Cal Newport',
      progress: 40,
      category: 'Focus',
    },
    {
      id: 3,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      progress: 100,
      category: 'Finance',
    },
  ]);

  // Sample State Data for Expenses
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Audible Subscription',
      amount: 14.99,
      date: 'Today',
      category: 'Learning',
    },
    {
      id: 2,
      title: 'Gym Membership',
      amount: 45.0,
      date: 'Yesterday',
      category: 'Health',
    },
    {
      id: 3,
      title: 'Coffee & Journaling',
      amount: 6.5,
      date: 'Oct 14',
      category: 'Lifestyle',
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddBookModalOpen,setIsAddBookModalOpen] =  useState<boolean>(false);

  //! This chuck of code is repeted
  const handleSaveBook = (data: NewBookData) => {
    console.log('New book submitted:', data);
    // Add logic to update your books state or backend here
  };

  const handleSaveNote = (data: NewNoteData) => {
    console.log('New note submitted:', data);
    // Add logic to update your notes state or backend here
  };

  const totalSpentThisMonth = expenses.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return (
    <div className='min-h-screen rounded-xl bg-[#F4F4F4] text-[#171A20] font-sans p-6 md:p-10 space-y-8 max-w-7xl mx-auto'>
      {/* 1. TOP BANNER: DAILY MOTIVATION / POEM */}
      <section className='bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'>
            <span>Daily Thought</span>
          </div>
          <p className='text-lg md:text-xl font-medium text-[#171A20]'>
            "We are what we repeatedly do. Excellence, then, is not an act, but
            a habit."
          </p>
          <p className='text-sm text-[#5C5E62]'>— Will Durant</p>
        </div>
        <PrimaryButton
          content='New Quote'
          onClick={() => setIsAddModalOpen(true)}
        />
      </section>

      {/* 2. MAIN ACTIVE GRID (LIBRARY & EXPENSES) */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* LEFT COLUMN: BOOKS & NOTES LIBRARY (2 COLUMNS WIDE) */}
        <section className='lg:col-span-2 bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm space-y-6'>
          <div className='flex items-center justify-between border-b border-[#EEEEEE] pb-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-[#F4F4F4] rounded-md'>
                <BookOpen className='w-5 h-5 text-[#171A20]' />
              </div>
              <div>
                <h2 className='text-lg font-bold text-[#171A20]'>
                  Library & Notes
                </h2>
                <p className='text-xs text-[#5C5E62]'>
                  Track active reads, quotes & book summaries
                </p>
              </div>
            </div>
            <SecoundaryButton
              content='Add Note'
              onClick={() => setIsAddBookModalOpen(true)}
              addPlus
            />
          </div>

          {/* Book Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {books.map((book) => (
              <div
                key={book.id}
                className='p-4 border border-[#EEEEEE] rounded-lg bg-[#FAFAFA] hover:border-[#D0D1D2] transition-all space-y-3'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <span className='text-[10px] font-bold uppercase tracking-wider text-[#3E6AE1] bg-[#3E6AE1]/10 px-2 py-0.5 rounded'>
                      {book.category}
                    </span>
                    <h3 className='font-semibold text-base mt-2 text-[#171A20]'>
                      {book.title}
                    </h3>
                    <p className='text-xs text-[#5C5E62]'>{book.author}</p>
                  </div>
                  <Bookmark className='w-4 h-4 text-[#5C5E62] hover:text-[#171A20] cursor-pointer' />
                </div>

                {/* Progress Bar */}
                <div className='space-y-1'>
                  <div className='flex justify-between text-xs text-[#5C5E62]'>
                    <span>Progress</span>
                    <span>{book.progress}%</span>
                  </div>
                  <div className='w-full bg-[#EEEEEE] h-1.5 rounded-full overflow-hidden'>
                    <div
                      className='bg-[#171A20] h-full rounded-full transition-all'
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className='w-full text-center text-xs font-semibold text-[#3E6AE1] hover:underline flex items-center justify-center gap-1 pt-2'>
            View All Books & Notes <ChevronRight className='w-3 h-3' />
          </button>
        </section>

        {/* RIGHT COLUMN: EXPENSE TRACKER (1 COLUMN WIDE) */}
        <section className='bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm space-y-6'>
          <div className='flex items-center justify-between border-b border-[#EEEEEE] pb-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-[#F4F4F4] rounded-md'>
                <Wallet className='w-5 h-5 text-[#171A20]' />
              </div>
              <div>
                <h2 className='text-lg font-bold text-[#171A20]'>Expenses</h2>
                <p className='text-xs text-[#5C5E62]'>Monthly overview</p>
              </div>
            </div>

            <button className='p-1.5 bg-[#F4F4F4] hover:bg-[#EEEEEE] rounded-md transition-all'>
              <Plus className='w-4 h-4 text-[#171A20]' />
            </button>
          </div>

          {/* Total Spend Banner */}
          <div className='p-4 bg-[#171A20] text-white rounded-lg space-y-1'>
            <p className='text-xs text-[#D0D1D2]'>Total Spent (Oct)</p>
            <p className='text-2xl font-bold'>
              ${totalSpentThisMonth.toFixed(2)}
            </p>
          </div>

          {/* Recent Expense List */}
          <div className='space-y-3'>
            <p className='text-xs font-bold text-[#5C5E62] uppercase tracking-wider'>
              Recent Transactions
            </p>
            {expenses.map((item) => (
              <div
                key={item.id}
                className='flex justify-between items-center text-sm py-2 border-b border-[#EEEEEE] last:border-0'
              >
                <div>
                  <p className='font-medium text-[#171A20]'>{item.title}</p>
                  <p className='text-xs text-[#5C5E62]'>
                    {item.date} • {item.category}
                  </p>
                </div>
                <span className='font-semibold text-[#171A20]'>
                  -${item.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <button className='w-full text-center text-xs font-semibold text-[#3E6AE1] hover:underline flex items-center justify-center gap-1 pt-2'>
            Full Expense Logs <ChevronRight className='w-3 h-3' />
          </button>
        </section>
      </div>

      {/* 3. BOTTOM SECTION: HABITS & SAVED REELS (PLACEHOLDERS) */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* HABIT TRACKER PREVIEW */}
        <div className='bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm space-y-4 opacity-75'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='w-5 h-5 text-[#5C5E62]' />
              <h3 className='font-bold text-[#171A20]'>Habit Tracker</h3>
            </div>
            <span className='text-[10px] bg-[#EEEEEE] text-[#5C5E62] px-2 py-0.5 rounded font-mono'>
              BUILDING NEXT
            </span>
          </div>
          <p className='text-xs text-[#5C5E62]'>
            Track daily routines, streaks, and personal consistency metrics.
          </p>
        </div>

        {/* SAVED REELS & CLIPS PREVIEW */}
        <div className='bg-white rounded-xl p-6 border border-[#EEEEEE] shadow-sm space-y-4 opacity-75'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <ArrowUpRight className='w-5 h-5 text-[#5C5E62]' />
              <h3 className='font-bold text-[#171A20]'>Clips & Reels Vault</h3>
            </div>
            <span className='text-[10px] bg-[#EEEEEE] text-[#5C5E62] px-2 py-0.5 rounded font-mono'>
              PLANNED
            </span>
          </div>
          <p className='text-xs text-[#5C5E62]'>
            Save inspiring video clips, reels, and media notes in one organized
            place.
          </p>
        </div>
      </div>

      {/* ================= ADD NEW MODAL PLACEHOLDER ================= */}
      {isAddModalOpen && (
        <AddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSaveBook={handleSaveBook}
          onSaveNote={handleSaveNote}
          defaultTab='note' // or "note" depending on what you want open by default
        />
      )}
      {isAddBookModalOpen && (
        <AddModal
          isOpen={isAddBookModalOpen}
          onClose={() => setIsAddBookModalOpen(false)}
          onSaveBook={handleSaveBook}
          onSaveNote={handleSaveNote}
          defaultTab='book' // or "note" depending on what you want open by default
        />
      )}
    </div>
  );
};

export default Dashboard;
