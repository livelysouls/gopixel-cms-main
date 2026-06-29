import React from 'react';

interface GoPixelLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function GoPixelLogo({ className = '', size = 'md' }: GoPixelLogoProps) {
  const sizeClasses = {
    sm: 'scale-75 origin-center',
    md: 'scale-100',
    lg: 'scale-125 my-4',
    xl: 'scale-150 my-6'
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]} ${className}`} id="gopixel-logo-root">
      {/* GP Monogram and Exploding Pixels */}
      <div className="relative w-36 h-28 flex items-center justify-center" id="gopixel-logo-symbol">
        {/* SVG Monogram GP */}
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(239,68,68,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="silverG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="gradientP" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" /> {/* Orange */}
              <stop offset="50%" stopColor="#EC4899" /> {/* Pink */}
              <stop offset="100%" stopColor="#A855F7" /> {/* Purple */}
            </linearGradient>
          </defs>

          {/* Letter G - Stylized Silver/White Crescent Curve */}
          <path
            d="M90 20 C50 20, 25 45, 25 70 C25 95, 50 110, 90 110 C105 110, 115 105, 120 98 C120 85, 120 80, 120 80 L80 80 L80 65 L140 65 C141 75, 140 100, 125 110 C112 118, 98 120, 90 120 C40 120, 10 95, 10 65 C10 35, 40 10, 90 10"
            fill="url(#silverG)"
          />

          {/* Letter P - Orange to Pink/Purple Gradient with Loop and stem */}
          <path
            d="M85 30 L135 30 C165 30, 175 48, 160 62 C145 74, 125 72, 105 72 L85 72 Z"
            stroke="url(#gradientP)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M95 30 L95 110"
            stroke="url(#gradientP)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Connected Bridge/Sleek Overlay */}
          <path
            d="M85 30 L130 30"
            stroke="url(#silverG)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Pixel Particles exploding on the upper right */}
          {/* Pixel 1 - Red/Orange */}
          <rect x="155" y="10" width="8" height="8" fill="#F97316" className="animate-pulse" />
          {/* Pixel 2 - Pink */}
          <rect x="165" y="18" width="8" height="8" fill="#EC4899" />
          {/* Pixel 3 - Purple */}
          <rect x="175" y="12" width="6" height="6" fill="#A855F7" />
          {/* Pixel 4 - Deep Orange */}
          <rect x="145" y="24" width="7" height="7" fill="#EA580C" />
          {/* Pixel 5 - Pink-Red */}
          <rect x="158" y="28" width="9" height="9" fill="#E11D48" />
          {/* Pixel 6 - Magenta */}
          <rect x="170" y="32" width="8" height="8" fill="#D946EF" />
          {/* Pixel 7 - Grey/Silver */}
          <rect x="148" y="14" width="5" height="5" fill="#94A3B8" />
          {/* Pixel 8 - Orange-Yellow */}
          <rect x="180" y="24" width="6" height="6" fill="#F59E0B" />
          {/* Pixel 9 - Purple */}
          <rect x="163" y="6" width="5" height="5" fill="#8B5CF6" />
        </svg>
      </div>

      {/* GOPIXEL Text Brand */}
      <div className="mt-1" id="gopixel-text-brand">
        <h1 className="text-2xl font-black tracking-[0.18em] uppercase flex items-center justify-center font-sans">
          <span className="text-white">GO</span>
          <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            PIXEL
          </span>
        </h1>
      </div>

      {/* Tagline: DESIGN • DEVELOP • GROW */}
      <div className="flex items-center space-x-2 mt-2 w-full px-2" id="gopixel-tagline">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-orange-500/80"></div>
        <p className="text-[9px] font-bold tracking-[0.25em] text-slate-400 uppercase select-none">
          DESIGN <span className="text-orange-500">•</span> DEVELOP <span className="text-pink-500">•</span> GROW
        </p>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-purple-500/80"></div>
      </div>

      {/* Subtitle / Focus: DIGITAL SOLUTIONS */}
      <p className="text-[7.5px] font-medium tracking-[0.35em] text-slate-500 uppercase mt-1 select-none">
        DIGITAL SOLUTIONS FOR MODERN BRANDS
      </p>

      {/* CMS Badge */}
      <div className="mt-2" id="gopixel-cms-badge">
        <span className="text-xs font-black tracking-[0.4em] text-white border-y border-white/20 px-4 py-0.5 uppercase block select-none bg-white/5 rounded-sm">
          CMS
        </span>
      </div>
    </div>
  );
}
