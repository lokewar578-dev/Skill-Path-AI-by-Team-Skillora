import React from 'react';

/**
 * Official Ministry of Statistics and Programme Implementation (MoSPI) Seal Logo
 * Circular brown seal with Ashoka Lions & "सत्यमेव जयते" (Matching Screenshot 2)
 */
export default function MospiOfficialLogo({ size = 44, className = '' }) {
  return (
    <div className={`mospi-official-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 6px rgba(178, 102, 40, 0.3))' }}
      >
        {/* Outer Official MoSPI Brown Ring */}
        <circle cx="100" cy="100" r="96" fill="#b26628" stroke="#8d4a19" strokeWidth="3" />
        
        {/* Inner White Circle background */}
        <circle cx="100" cy="100" r="70" fill="#FFFFFF" />

        {/* Circular Curved Text Path for Ministry Name */}
        <path id="circleTextPath" d="M 22, 100 A 78,78 0 1,1 178,100" fill="none" />
        
        <text fill="#FFFFFF" fontSize="11.5" fontWeight="800" letterSpacing="0.8px" fontFamily="sans-serif">
          <textPath href="#circleTextPath" startOffset="50%" textAnchor="middle">
            Ministry of Statistics and Programme Implementation
          </textPath>
        </text>

        {/* Ashoka Lions Emblem Center Representation */}
        <g transform="translate(68, 48) scale(0.64)">
          {/* Lion 1 & 2 Left/Right Mane Silhouette */}
          <path d="M25 35 Q10 45 15 65 Q20 85 45 90 Q50 90 55 90 Q80 85 85 65 Q90 45 75 35 Q65 25 50 25 Q35 25 25 35 Z" fill="#b26628" opacity="0.15" />
          
          {/* Central Lion Head Details */}
          <path d="M 50 15 C 38 15 32 25 32 38 C 32 50 40 58 50 58 C 60 58 68 50 68 38 C 68 25 62 15 50 15 Z" fill="#b26628" />
          
          {/* Eyes & Nose */}
          <circle cx="44" cy="32" r="2.5" fill="#FFFFFF" />
          <circle cx="56" cy="32" r="2.5" fill="#FFFFFF" />
          <path d="M 47 40 L 53 40 L 50 44 Z" fill="#FFFFFF" />

          {/* Left & Right Accompanying Lions */}
          <circle cx="28" cy="42" r="10" fill="#b26628" />
          <circle cx="72" cy="42" r="10" fill="#b26628" />

          {/* Base Pedestal with Ashoka Chakra Wheel */}
          <rect x="20" y="72" width="60" height="12" rx="3" fill="#b26628" />
          
          {/* Ashoka Chakra 24-spoke wheel */}
          <circle cx="50" cy="78" r="5" fill="#FFFFFF" stroke="#b26628" strokeWidth="1.5" />
          <circle cx="50" cy="78" r="1.5" fill="#b26628" />

          {/* Satyameva Jayate Hindi Text Below Pedestal */}
          <text x="50" y="98" fill="#b26628" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
            सत्यमेव जयते
          </text>
        </g>

        {/* Sub-text Satyameva Jayate on Seal */}
        <text x="100" y="152" fill="#b26628" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
}
