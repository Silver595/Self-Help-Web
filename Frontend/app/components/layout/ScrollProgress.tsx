
import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollableElement = document.querySelector('main');

      if (!scrollableElement) return;

      const { scrollTop, scrollHeight, clientHeight } =
        scrollableElement;

      const maxScroll = scrollHeight - clientHeight;

      const percentage =
        maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

      setProgress(Math.min(100, Math.max(0, percentage)));
    };

    const scrollableElement = document.querySelector('main');

    updateProgress();

    scrollableElement?.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);

    return () => {
      scrollableElement?.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className="relative h-[3px] w-full bg-gray-200">
      {/* Animated progress line */}
      <div
        className="h-full bg-[#ff3d00] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

      {/* Percentage */}
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-500">
        {Math.round(progress)}%
      </span>
    </div>
  );
}
