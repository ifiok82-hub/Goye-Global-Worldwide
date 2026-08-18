import React from 'react';

export const GoyeLogo = ({ size = 48, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size} className={className}>
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF275" />
        <stop offset="25%" stopColor="#FFD700" />
        <stop offset="75%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#FF8C00" />
      </linearGradient>
      <path id="textPath" d="M 28,100 A 72,72 0 0,1 172,100" fill="transparent" />
    </defs>
    <circle cx="100" cy="100" r="96" fill="#000000" stroke="url(#goldGradient)" strokeWidth="6"/>
    <circle cx="100" cy="100" r="84" fill="transparent" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.6"/>
    <text fill="url(#goldGradient)" fontFamily="sans-serif" fontWeight="bold" fontSize="13" letterSpacing="3">
      <textPath href="#textPath" startOffset="50%" textAnchor="middle">SIRWISE AI • WEB3 • ACADEMY</textPath>
    </text>
    <text x="100" y="115" fill="url(#goldGradient)" fontFamily="sans-serif" fontWeight="900" fontSize="48" textAnchor="middle" letterSpacing="1">GOYE</text>
    <text x="100" y="140" fill="url(#goldGradient)" fontFamily="sans-serif" fontWeight="bold" fontSize="12" textAnchor="middle" letterSpacing="1">STORE GLOBAL</text>
  </svg>
);
