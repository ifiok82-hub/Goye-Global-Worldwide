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
  if (t.includes('pi ') || t.includes('crypto') || t.includes('defi') || t.includes('blockchain') || t.includes('token') || t.includes('web3')) return '🪙';
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
  const [imgError, setImgError] = useState(false);
  const emoji = getProductEmoji(title || alt, category);
  const validLocalSrc = src && src.trim().length > 0 && !imgError;

  if (validLocalSrc) {
    return (
      <div
        style={{
          height,
          width: '100%',
          backgroundColor: '#111111',
          overflow: 'hidden'
        }}
        className={`relative ${className}`}
      >
        <img
          src={src}
          alt={alt}
          decoding="async"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

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
};

export default ProductGradientImage;
