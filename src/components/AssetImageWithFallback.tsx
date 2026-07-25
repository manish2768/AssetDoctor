import React, { useState } from 'react';
import { getCategoryFallbackEmoji } from '../utils/imageUtils';

interface AssetImageWithFallbackProps {
  src?: string;
  alt?: string;
  category?: string;
  name?: string;
  className?: string;
}

export const AssetImageWithFallback: React.FC<AssetImageWithFallbackProps> = ({
  src,
  alt = 'Asset Image',
  category,
  name,
  className = 'w-full h-48 object-cover rounded-2xl',
}) => {
  const [hasError, setHasError] = useState(false);

  const emoji = getCategoryFallbackEmoji(category, name);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl text-center select-none ${className}`}
      >
        <span className="text-4xl sm:text-5xl mb-2 drop-shadow-md animate-pulse">{emoji}</span>
        <span className="text-xs font-bold text-slate-300 line-clamp-1">{name || 'Asset Image'}</span>
        <span className="text-[10px] font-semibold text-teal-400/80 uppercase tracking-wider mt-0.5">
          {category || 'Vault Asset'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
