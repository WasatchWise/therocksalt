'use client';

import { useState, useEffect } from 'react';
import { saveBand, unsaveBand, isBandSaved } from '@/lib/savedBands';

interface SaveBandButtonProps {
  bandId: string;
  bandName: string;
  bandSlug: string;
  genres?: string[];
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function SaveBandButton({
  bandId,
  bandName,
  bandSlug,
  genres = [],
  size = 'md',
  showLabel = false,
  className = '',
}: SaveBandButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if band is saved on mount and when bandId changes
  useEffect(() => {
    setIsSaved(isBandSaved(bandId));
  }, [bandId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    e.stopPropagation(); // Prevent card click if button is inside clickable card

    if (isSaved) {
      // Unsave
      const success = unsaveBand(bandId);
      if (success) {
        setIsSaved(false);
      }
    } else {
      // Save
      const success = saveBand({
        id: bandId,
        name: bandName,
        slug: bandSlug,
        genres,
      });
      if (success) {
        setIsSaved(true);
        // Trigger animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        // Dispatch custom event so other components can react
        window.dispatchEvent(new CustomEvent('bandSaved', { detail: { bandId, bandName } }));
      }
    }
  };

  // Icon size mapping
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const iconSize = sizeClasses[size];

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 transition-all ${
        isSaved ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
      } ${className}`}
      aria-label={
        isSaved
          ? `Remove ${bandName} from favorites`
          : `Save ${bandName} to favorites`
      }
      title={isSaved ? 'Remove from My Bands' : 'Save to My Bands'}
    >
      {/* Heart Icon */}
      <svg
        className={`${iconSize} ${isAnimating ? 'animate-pulse-once' : ''}`}
        fill={isSaved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>

      {/* Label (optional) */}
      {showLabel && (
        <span className="text-sm font-medium">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
