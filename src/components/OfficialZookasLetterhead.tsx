import React from 'react';
import { ZookasOfficialCrest } from './ZookasOfficialCrest';
import { LetterheadWatermarkDisplay } from './LetterheadWatermarkDisplay';
import { Globe, Phone, Mail } from 'lucide-react';
import { CompanyDetails } from '../types';

interface OfficialZookasLetterheadProps {
  companyDetails?: CompanyDetails | null;
  registrationNo?: string;
  documentDate?: string;
  children?: React.ReactNode;
  recipientName?: string;
  recipientCompany?: string;
  recipientAddress?: string;
  showWatermark?: boolean;
  className?: string;
}

export const OfficialZookasLetterhead: React.FC<OfficialZookasLetterheadProps> = ({
  companyDetails,
  registrationNo = '',
  documentDate = '',
  children,
  recipientName,
  recipientCompany,
  recipientAddress,
  showWatermark = true,
  className = ''
}) => {
  const gstin = companyDetails?.gstin || "19AACCZ7001P1ZU";
  const companyName = companyDetails?.companyName || "ZOOKAS UNITY BLENDERS & DISTILLERS PRIVATE LIMITED";
  const address = companyDetails?.registeredAddress || "Floor No.: 1ST FLOOR Building , S S TOWER, T N, MUKHERJEE ROAD LICHU BAGA, Dankuni, Hooghly, West Bengal";
  const pinCode = "712311";
  const cin = companyDetails?.cin || "U73100WB2025PTC281568 / U46305WB2025PTC281568";
  const phone = companyDetails?.phone || "9593712358";
  const email = companyDetails?.email || "zookasspirit123@gmail.com";
  const website = companyDetails?.website ? companyDetails.website.replace(/^https?:\/\//, '') : "www.zookasunityspirits.in";

  const formattedDate = documentDate
    ? (documentDate.includes('-') && !isNaN(Date.parse(documentDate))
        ? new Date(documentDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : documentDate)
    : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div
      className={`relative bg-white text-black min-h-[950px] flex flex-col justify-between overflow-hidden shadow-2xl rounded-sm print:shadow-none print:m-0 print:p-0 print:border-none ${className}`}
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      }}
    >
      {/* ======================================================== */}
      {/* TOP-RIGHT GEOMETRIC ORANGE / AMBER ACCENT BANNER         */}
      {/* ======================================================== */}
      <div className="absolute top-0 right-0 w-36 sm:w-44 md:w-52 h-20 sm:h-24 md:h-28 pointer-events-none z-10">
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Main bold orange diagonal geometric polygon */}
          <polygon
            points="70,0 200,0 200,80 130,80"
            fill="#E67E22"
          />
          {/* Gold / lighter amber inner facet */}
          <polygon
            points="120,0 200,0 200,45 155,45"
            fill="#F39C12"
            opacity="0.85"
          />
          {/* Deep amber border accent */}
          <polygon
            points="65,0 72,0 132,80 125,80"
            fill="#D35400"
          />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* CENTER WATERMARK                                         */}
      {/* ======================================================== */}
      {showWatermark && <LetterheadWatermarkDisplay companyDetails={companyDetails} />}

      {/* ======================================================== */}
      {/* HEADER SECTION (EXACT 1:1 REPLICA OF OFFICIAL LETTERHEAD) */}
      {/* ======================================================== */}
      <header className="relative z-20 pt-4 px-6 sm:px-10 pb-2">
        {/* Top-Left GSTIN (Bold crisp black) */}
        <div className="text-[11px] sm:text-xs font-black tracking-tight text-black mb-1">
          GSTIN: <span className="font-mono">{gstin}</span>
        </div>

        {/* Main Header Content: Crest + Company Details */}
        <div className="flex flex-row items-center gap-3 sm:gap-5 mt-1">
          {/* Official Zookas Crest / Logo on Left */}
          <div className="shrink-0 flex items-center justify-center">
            {companyDetails?.logoType === 'custom_image' && companyDetails.logoUrl ? (
              <img
                src={companyDetails.logoUrl}
                alt="Company Logo"
                referrerPolicy="no-referrer"
                className="object-contain max-h-20 sm:max-h-24"
                style={{ width: `${Math.min(companyDetails.logoWidth || 100, 120)}px` }}
              />
            ) : (
              <ZookasOfficialCrest size={95} variant="gold" showText={true} />
            )}
          </div>

          {/* Company Title, Registered Address, PIN, and CIN */}
          <div className="flex-1 text-center pr-12 sm:pr-20">
            {/* Legal Company Name */}
            <h1 className="text-base sm:text-lg md:text-[21px] font-black tracking-wide text-black uppercase leading-tight font-sans">
              {companyName}
            </h1>

            {/* Registered Address */}
            <p className="text-[10px] sm:text-[11.5px] text-stone-900 leading-snug mt-1 font-normal max-w-xl mx-auto">
              {address}
              {!address.includes(pinCode) && (
                <>
                  <br />
                  <span className="font-semibold">PIN Code:</span> {pinCode}
                </>
              )}
            </p>

            {/* CIN Line */}
            <p className="text-[10px] sm:text-[11.5px] font-bold text-black mt-1 font-mono tracking-tight">
              CIN NO:-{cin}
            </p>
          </div>
        </div>

        {/* Thin Gold / Amber Horizontal Divider Line */}
        <div className="w-full h-[3px] bg-gradient-to-r from-amber-600 via-[#E67E22] to-amber-700 mt-3 mb-2 rounded-sm" />

        {/* Registration No & Date Meta Bar */}
        <div className="flex flex-row items-center justify-between text-xs sm:text-sm font-bold text-black pt-1 pb-1">
          <div className="flex items-center gap-1.5">
            <span>Registration No :-</span>
            <span className="font-mono font-semibold text-stone-800">
              {registrationNo || ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Date:-</span>
            <span className="font-sans font-semibold text-stone-800">
              {formattedDate}
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* DOCUMENT BODY CONTENT (CLEAN FORMAL LETTERHEAD MARGINS)  */}
      {/* ======================================================== */}
      <main className="relative z-20 flex-1 px-6 sm:px-10 py-4 flex flex-col">
        {/* Recipient Details (if provided) */}
        {(recipientName || recipientCompany || recipientAddress) && (
          <div className="mb-4 text-xs sm:text-sm text-stone-900 space-y-0.5 leading-relaxed">
            <div className="font-bold text-black">To,</div>
            {recipientName && <div className="font-bold">{recipientName}</div>}
            {recipientCompany && <div>{recipientCompany}</div>}
            {recipientAddress && <div className="text-stone-700 text-xs">{recipientAddress}</div>}
          </div>
        )}

        {/* Dynamic / Editable Content */}
        <div className="flex-1 text-xs sm:text-sm leading-relaxed text-stone-900 space-y-3">
          {children}
        </div>
      </main>

      {/* ======================================================== */}
      {/* FOOTER SECTION (ORANGE GEOMETRIC RIBBON WITH CHANNELS)   */}
      {/* ======================================================== */}
      <footer className="relative z-20 mt-auto">
        {/* Vibrant Orange Geometric Footer Ribbon Bar */}
        <div className="relative bg-[#E67E22] text-white py-2.5 sm:py-3 px-6 sm:px-10 overflow-hidden shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Left & Center: Contact Channels (Web, Phone, Email) */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-1.5 text-[11px] sm:text-[12px] font-medium tracking-wide">
            {/* Website with Globe Icon */}
            <div className="flex items-center gap-1.5 hover:underline">
              <Globe className="w-4 h-4 text-white shrink-0" />
              <span>{website}</span>
            </div>

            {/* Phone Number with Phone Icon */}
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-white shrink-0" />
              <span>{phone}</span>
            </div>

            {/* Email Address with Mail Icon */}
            <div className="flex items-center gap-1.5 hover:underline">
              <Mail className="w-4 h-4 text-white shrink-0" />
              <span>{email}</span>
            </div>
          </div>

          {/* Right Side Geometric Polygon Facets (Faceted White & Amber Slices) */}
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-32 pointer-events-none">
            <svg
              viewBox="0 0 100 50"
              className="w-full h-full"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* White sharp diagonal slice */}
              <polygon
                points="45,50 65,0 78,0 58,50"
                fill="#FFFFFF"
              />
              {/* Amber / Gold accent slice */}
              <polygon
                points="75,50 90,0 100,0 100,50"
                fill="#F39C12"
              />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
};
