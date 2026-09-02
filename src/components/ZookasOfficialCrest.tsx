import React from 'react';

interface ZookasOfficialCrestProps {
  className?: string;
  size?: number | string;
  variant?: 'gold' | 'monochrome' | 'watermark';
  showText?: boolean;
}

export const ZookasOfficialCrest: React.FC<ZookasOfficialCrestProps> = ({
  className = '',
  size = 72,
  variant = 'gold',
  showText = true
}) => {
  const isWatermark = variant === 'watermark';
  const isMonochrome = variant === 'monochrome';

  return (
    <div
      className={`inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: typeof size === 'number' ? `${size}px` : size }}
    >
      <svg
        viewBox="0 0 240 220"
        className="w-full h-auto drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rich Metallic Gold Gradients matching official letterhead */}
          <linearGradient id="crestGoldPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A5A14" />
            <stop offset="25%" stopColor="#DFAC41" />
            <stop offset="50%" stopColor="#FFF1B0" />
            <stop offset="75%" stopColor="#C89228" />
            <stop offset="100%" stopColor="#6C4108" />
          </linearGradient>

          <linearGradient id="crestGoldShield" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A2600" />
            <stop offset="50%" stopColor="#1E0E00" />
            <stop offset="100%" stopColor="#0B0500" />
          </linearGradient>

          <linearGradient id="crestRibbonGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B37D22" />
            <stop offset="30%" stopColor="#F9DF88" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F9DF88" />
            <stop offset="100%" stopColor="#B37D22" />
          </linearGradient>

          <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* --- CROWN ON TOP --- */}
        <g id="Crown" filter={!isWatermark ? "url(#goldGlow)" : undefined}>
          <path
            d="M95 48 L104 22 L112 36 L120 18 L128 36 L136 22 L145 48 Z"
            fill={isWatermark ? "currentColor" : (isMonochrome ? "#333" : "url(#crestGoldPrimary)")}
            stroke={isWatermark ? "none" : "#5A3805"}
            strokeWidth="1.5"
          />
          {/* Jewels on Crown peaks */}
          <circle cx="104" cy="20" r="3" fill={isWatermark ? "currentColor" : "#FFF"} />
          <circle cx="120" cy="16" r="3.5" fill={isWatermark ? "currentColor" : "#FFF"} />
          <circle cx="136" cy="20" r="3" fill={isWatermark ? "currentColor" : "#FFF"} />
          {/* Crown Base Rim */}
          <rect
            x="94"
            y="46"
            width="52"
            height="7"
            rx="2"
            fill={isWatermark ? "currentColor" : (isMonochrome ? "#444" : "url(#crestGoldPrimary)")}
            stroke={isWatermark ? "none" : "#3D2400"}
            strokeWidth="1"
          />
          <circle cx="100" cy="49.5" r="1.5" fill="#FFF" />
          <circle cx="110" cy="49.5" r="1.5" fill="#AA0000" />
          <circle cx="120" cy="49.5" r="2" fill="#FFF" />
          <circle cx="130" cy="49.5" r="1.5" fill="#006600" />
          <circle cx="140" cy="49.5" r="1.5" fill="#FFF" />
        </g>

        {/* --- HERALDIC FLOURISHES / WINGS (LEFT & RIGHT) --- */}
        <g id="HeraldicWings" opacity={isWatermark ? 0.9 : 1}>
          {/* Left Wing / Flourish */}
          <path
            d="M90 60 C70 45 45 50 30 70 C20 85 22 105 32 120 C42 135 60 145 80 148 C75 138 72 125 74 112 C76 98 82 86 90 76 Z"
            fill={isWatermark ? "currentColor" : (isMonochrome ? "#666" : "url(#crestGoldPrimary)")}
            stroke={isWatermark ? "none" : "#4A2B00"}
            strokeWidth="1.2"
          />
          <path
            d="M38 75 C48 65 65 60 82 66"
            stroke={isWatermark ? "none" : "#FFF8D6"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M28 95 C40 88 58 88 74 95"
            stroke={isWatermark ? "none" : "#FFF8D6"}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M36 115 C48 110 62 110 74 118"
            stroke={isWatermark ? "none" : "#5A3805"}
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Right Wing / Flourish */}
          <path
            d="M150 60 C170 45 195 50 210 70 C220 85 218 105 208 120 C198 135 180 145 160 148 C165 138 168 125 166 112 C164 98 158 86 150 76 Z"
            fill={isWatermark ? "currentColor" : (isMonochrome ? "#666" : "url(#crestGoldPrimary)")}
            stroke={isWatermark ? "none" : "#4A2B00"}
            strokeWidth="1.2"
          />
          <path
            d="M202 75 C192 65 175 60 158 66"
            stroke={isWatermark ? "none" : "#FFF8D6"}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M212 95 C200 88 182 88 166 95"
            stroke={isWatermark ? "none" : "#FFF8D6"}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M204 115 C192 110 178 110 166 118"
            stroke={isWatermark ? "none" : "#5A3805"}
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        {/* --- CENTRAL HERALDIC SHIELD / OVAL --- */}
        <g id="CenterShield" filter={!isWatermark ? "url(#goldGlow)" : undefined}>
          {/* Outer Gold Shield Frame */}
          <path
            d="M120 50 C155 50 165 72 165 106 C165 140 142 165 120 176 C98 165 75 140 75 106 C75 72 85 50 120 50 Z"
            fill={isWatermark ? "currentColor" : (isMonochrome ? "#555" : "url(#crestGoldPrimary)")}
            stroke={isWatermark ? "none" : "#3F2200"}
            strokeWidth="2"
          />

          {/* Inner Dark Vignette Oval */}
          <path
            d="M120 56 C148 56 156 75 156 106 C156 136 136 157 120 166 C104 157 84 136 84 106 C84 75 92 56 120 56 Z"
            fill={isWatermark ? "transparent" : (isMonochrome ? "#111" : "url(#crestGoldShield)")}
            stroke={isWatermark ? "currentColor" : "url(#crestRibbonGold)"}
            strokeWidth={isWatermark ? 2 : 1.5}
          />

          {/* Sunburst Rays inside Oval */}
          {!isWatermark && (
            <g opacity="0.35" stroke="#DFAC41" strokeWidth="0.75">
              <line x1="120" y1="106" x2="90" y2="80" />
              <line x1="120" y1="106" x2="95" y2="68" />
              <line x1="120" y1="106" x2="110" y2="60" />
              <line x1="120" y1="106" x2="130" y2="60" />
              <line x1="120" y1="106" x2="145" y2="68" />
              <line x1="120" y1="106" x2="150" y2="80" />
              <line x1="120" y1="106" x2="152" y2="106" />
              <line x1="120" y1="106" x2="148" y2="130" />
              <line x1="120" y1="106" x2="132" y2="150" />
              <line x1="120" y1="106" x2="120" y2="156" />
              <line x1="120" y1="106" x2="108" y2="150" />
              <line x1="120" y1="106" x2="92" y2="130" />
              <line x1="120" y1="106" x2="88" y2="106" />
            </g>
          )}

          {/* Central Monogram 'Z' in Serif Typography */}
          <text
            x="120"
            y="126"
            textAnchor="middle"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="54"
            fontWeight="900"
            fontStyle="italic"
            fill={isWatermark ? "currentColor" : (isMonochrome ? "#FFF" : "url(#crestRibbonGold)")}
            stroke={isWatermark ? "none" : "#381E00"}
            strokeWidth={isWatermark ? "0" : "1"}
            style={{ letterSpacing: '1px' }}
          >
            Z
          </text>
        </g>

        {/* --- RIBBON BANNER AT BOTTOM WITH 'ZOOKAS' --- */}
        {showText && (
          <g id="BannerRibbon" filter={!isWatermark ? "url(#goldGlow)" : undefined}>
            {/* Ribbon Tail Left */}
            <path
              d="M36 172 L58 162 L58 184 L36 194 L46 183 Z"
              fill={isWatermark ? "currentColor" : (isMonochrome ? "#444" : "url(#crestGoldPrimary)")}
              stroke={isWatermark ? "none" : "#3F2200"}
              strokeWidth="1"
            />
            {/* Ribbon Tail Right */}
            <path
              d="M204 172 L182 162 L182 184 L204 194 L194 183 Z"
              fill={isWatermark ? "currentColor" : (isMonochrome ? "#444" : "url(#crestGoldPrimary)")}
              stroke={isWatermark ? "none" : "#3F2200"}
              strokeWidth="1"
            />

            {/* Main Arching Ribbon Body */}
            <path
              d="M48 178 C80 166 160 166 192 178 L188 198 C158 186 82 186 52 198 Z"
              fill={isWatermark ? "currentColor" : (isMonochrome ? "#EEE" : "url(#crestRibbonGold)")}
              stroke={isWatermark ? "none" : "#3F2200"}
              strokeWidth="1.5"
            />

            {/* Ribbon Fold Shadows */}
            {!isWatermark && (
              <>
                <path d="M52 178 L58 162 L58 184 Z" fill="#2E1800" opacity="0.7" />
                <path d="M188 178 L182 162 L182 184 Z" fill="#2E1800" opacity="0.7" />
              </>
            )}

            {/* 'ZOOKAS' Text on Ribbon */}
            <text
              x="120"
              y="189"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="16"
              fontWeight="900"
              letterSpacing="3.5px"
              fill={isWatermark ? "#000" : (isMonochrome ? "#000" : "#2E1700")}
            >
              ZOOKAS
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
