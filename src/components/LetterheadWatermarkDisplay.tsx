import React from 'react';
import { CompanyDetails } from '../types';
import { ZookasOfficialCrest } from './ZookasOfficialCrest';

interface LetterheadWatermarkDisplayProps {
  companyDetails?: CompanyDetails | null;
  className?: string;
}

export const LetterheadWatermarkDisplay: React.FC<LetterheadWatermarkDisplayProps> = ({
  companyDetails,
  className = ''
}) => {
  // Check if watermark is disabled
  if (!companyDetails) {
    // Default fallback watermark
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 ${className}`}
        style={{ opacity: 0.045 }}
      >
        <ZookasOfficialCrest size={380} variant="watermark" showText={true} />
      </div>
    );
  }

  const isEnabled = companyDetails.showWatermarkOnLetterhead ?? true;
  const type = companyDetails.watermarkType ?? 'distillery_crest';

  if (!isEnabled || type === 'none') {
    return null;
  }

  const opacity = typeof companyDetails.watermarkOpacity === 'number' 
    ? Math.max(0.01, Math.min(0.35, companyDetails.watermarkOpacity))
    : 0.045;

  const size = companyDetails.watermarkSize || 380;
  const rotation = companyDetails.watermarkRotation ?? 0;
  const position = companyDetails.watermarkPosition || 'center';

  const positionClasses = 
    position === 'bottom_right' 
      ? 'items-end justify-end p-8' 
      : 'items-center justify-center';

  // Render the watermark graphic depending on type
  const renderGraphic = () => {
    switch (type) {
      case 'company_logo':
        if (companyDetails.logoUrl) {
          return (
            <img
              src={companyDetails.logoUrl}
              alt="Company Watermark"
              referrerPolicy="no-referrer"
              className="object-contain max-h-[500px] grayscale filter contrast-125"
              style={{
                width: `${size}px`,
                transform: rotation ? `rotate(${rotation}deg)` : undefined
              }}
            />
          );
        }
        return <ZookasOfficialCrest size={size} variant="watermark" showText={true} />;

      case 'custom_image':
        if (companyDetails.watermarkImageUrl) {
          return (
            <img
              src={companyDetails.watermarkImageUrl}
              alt="Custom Watermark"
              referrerPolicy="no-referrer"
              className="object-contain max-h-[500px] grayscale filter contrast-125"
              style={{
                width: `${size}px`,
                transform: rotation ? `rotate(${rotation}deg)` : undefined
              }}
            />
          );
        }
        return <ZookasOfficialCrest size={size} variant="watermark" showText={true} />;

      case 'custom_text': {
        const text = companyDetails.watermarkText || companyDetails.tradeName || companyDetails.companyName || 'ZOOKAS';
        return (
          <div
            className="flex flex-col items-center justify-center text-center font-serif font-black tracking-widest uppercase text-stone-900 border-y-2 border-stone-800 py-3 px-8"
            style={{
              fontSize: `${Math.max(18, Math.round(size / 7.5))}px`,
              letterSpacing: '0.18em',
              transform: `rotate(${rotation || -20}deg)`,
              maxWidth: '90%'
            }}
          >
            <span>{text}</span>
            <span className="text-[10px] tracking-[0.3em] font-sans font-semibold mt-1 opacity-80">
              OFFICIAL ARCHIVAL STATIONERY • VERIFIED
            </span>
          </div>
        );
      }

      case 'authenticated_seal':
        return (
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: rotation ? `rotate(${rotation}deg)` : undefined
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-stone-900" fill="currentColor">
              {/* Outer beaded ring */}
              <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth="1.5" />

              {/* Top and Bottom Circular Text */}
              <path id="sealTextTop" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
              <path id="sealTextBottom" d="M 170,100 A 70,70 0 0,1 30,100" fill="none" />

              <text fontSize="9.5" fontWeight="bold" letterSpacing="0.18em" fill="currentColor">
                <textPath href="#sealTextTop" startOffset="50%" textAnchor="middle">
                  ZOOKAS UNITY SPIRITS
                </textPath>
              </text>
              <text fontSize="8.5" fontWeight="600" letterSpacing="0.14em" fill="currentColor">
                <textPath href="#sealTextBottom" startOffset="50%" textAnchor="middle">
                  AUTHENTICATED ARCHIVE • 2025
                </textPath>
              </text>

              {/* Center Heraldic Symbols */}
              <g transform="translate(100, 100) scale(0.48) translate(-100, -100)">
                <ZookasOfficialCrest size={200} variant="watermark" showText={false} />
              </g>
            </svg>
          </div>
        );

      case 'cask_barrel_stamp':
        return (
          <div
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotate(${rotation || -12}deg)`
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-stone-900" fill="none" stroke="currentColor">
              {/* Octagonal or Heavy Border */}
              <rect x="25" y="25" width="150" height="150" rx="12" strokeWidth="3" strokeDasharray="6 4" />
              <rect x="33" y="33" width="134" height="134" rx="8" strokeWidth="1.5" />

              {/* Barrel icon */}
              <path
                d="M 75,60 C 65,80 65,120 75,140 L 125,140 C 135,120 135,80 125,60 Z"
                strokeWidth="2"
                fill="none"
              />
              <path d="M 68,90 L 132,90 M 68,110 L 132,110" strokeWidth="1.5" />
              <path d="M 73,75 L 127,75 M 73,125 L 127,125" strokeWidth="1.5" />

              {/* Text Top & Bottom */}
              <text x="100" y="50" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" letterSpacing="0.15em">
                BONDED CELLAR
              </text>
              <text x="100" y="160" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor" letterSpacing="0.12em">
                PERPETUAL CASK DEED
              </text>
              <text x="100" y="103" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">
                OAK CASK
              </text>
            </svg>
          </div>
        );

      case 'distillery_crest':
      default:
        return (
          <div style={{ transform: rotation ? `rotate(${rotation}deg)` : undefined }}>
            <ZookasOfficialCrest size={size} variant="watermark" showText={true} />
          </div>
        );
    }
  };

  return (
    <div
      className={`absolute inset-0 flex pointer-events-none select-none overflow-hidden z-0 ${positionClasses} ${className}`}
      style={{ opacity }}
    >
      {renderGraphic()}
    </div>
  );
};
