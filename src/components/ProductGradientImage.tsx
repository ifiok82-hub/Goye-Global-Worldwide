import React, { useState } from 'react';

interface ProductGradientImageProps {
  src?: string;
  alt: string;
  category?: string;
  title?: string;
  className?: string;
  height?: string;
}

export function getProductEmoji(title: string = '', category: string = ''): string {
  const t = (title + ' ' + category).toLowerCase();
  if (t.includes('academy') || t.includes('prompt') || t.includes('ai ') || t.includes('artificial')) return '🤖';
  if (t.includes('travel') || t.includes('lmia') || t.includes('relocation') || t.includes('dubai') || t.includes('passport')) return '✈️';
  if (t.includes('esim') || t.includes('roaming') || t.includes('phone') || t.includes('data')) return '📱';
  if (t.includes('care') || t.includes('worker') || t.includes('job') || t.includes('employment') || t.includes('resume')) return '💼';
  if (t.includes('pi ') || t.includes('crypto') || t.includes('defi') || t.includes('blockchain') || t.includes('gcv') || t.includes('token')) return '🪙';
  if (t.includes('course') || t.includes('book') || t.includes('doc') || t.includes('archiving') || t.includes('design')) return '📚';
  return '🤖';
}

export const ProductGradientImage: React.FC<ProductGradientImageProps> = ({
  src,
  alt,
  category = '',
  title = '',
  className = '',
  height = '220px'
}) => {
  const [imageError, setImageError] = useState(false);
  const emoji = getProductEmoji(title || alt, category);

  if (!src || imageError) {
    return (
      <div
        style={{
          height,
          background: 'linear-gradient(135deg, #FFD700, #000000)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px',
          borderRadius: '16px 16px 0 0',
          width: '100%',
          userSelect: 'none'
        }}
        className={className}
        role="img"
        aria-label={alt}
      >
        <span className="transform hover:scale-110 transition-transform duration-300">
          {emoji}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden bg-black ${className}`} style={{ height }}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default ProductGradientImage;
