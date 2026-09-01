// Real-time Checkout Validation & Formatting Utilities

export interface ValidationErrors {
  // Age & compliance
  legalAgeAccepted?: string;

  // Guest Contact
  guestEmail?: string;
  guestPhone?: string;

  // Shipping Address
  fullName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  savedAddress?: string;

  // Payment - Card
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolder?: string;

  // Payment - Gift Card
  giftCardCode?: string;

  // Payment - Wire
  wireAccepted?: string;

  // General submit error
  formSubmit?: string;
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export const detectCardBrand = (rawNumber: string): CardBrand => {
  const clean = rawNumber.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(clean)) return 'discover';
  return 'unknown';
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const brand = detectCardBrand(digits);

  if (brand === 'amex') {
    // Amex 4-6-5 format
    const part1 = digits.slice(0, 4);
    const part2 = digits.slice(4, 10);
    const part3 = digits.slice(10, 15);
    return [part1, part2, part3].filter(Boolean).join(' ');
  }

  // Standard 4-4-4-4 format
  const parts = digits.match(/.{1,4}/g) || [];
  return parts.join(' ');
};

export const formatExpiryDate = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) {
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  }
  return clean;
};

export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidZipCode = (zip: string): boolean => {
  const clean = zip.trim();
  // US 5-digit or standard international alphanumeric
  return /^[0-9]{5}(-[0-9]{4})?$/.test(clean) || /^[A-Za-z0-9\s-]{3,10}$/.test(clean);
};

export const validateExpiryDate = (expiry: string): { valid: boolean; error?: string } => {
  const clean = expiry.replace(/\s/g, '');
  if (!/^\d{2}\/\d{2}$/.test(clean)) {
    return { valid: false, error: 'Enter expiration as MM/YY' };
  }

  const [monthStr, yearStr] = clean.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  if (month < 1 || month > 12) {
    return { valid: false, error: 'Month must be 01 to 12' };
  }

  // Reference current year 2026
  const currentFullYear = new Date().getFullYear();
  const currentYear2Digit = currentFullYear % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (year < currentYear2Digit || (year === currentYear2Digit && month < currentMonth)) {
    return { valid: false, error: 'Card has expired' };
  }

  if (year > currentYear2Digit + 25) {
    return { valid: false, error: 'Invalid expiration year' };
  }

  return { valid: true };
};

export const validateCardNumber = (cardNumber: string): { valid: boolean; error?: string } => {
  const digits = cardNumber.replace(/\D/g, '');
  const brand = detectCardBrand(digits);

  if (digits.length === 0) {
    return { valid: false, error: 'Card number is required' };
  }

  if (brand === 'amex' && digits.length !== 15) {
    return { valid: false, error: 'American Express cards require 15 digits' };
  }

  if (brand !== 'amex' && (digits.length < 13 || digits.length > 19)) {
    return { valid: false, error: 'Enter a valid 15 or 16-digit card number' };
  }

  return { valid: true };
};

export const validateCvv = (cvv: string, brand: CardBrand): { valid: boolean; error?: string } => {
  const clean = cvv.replace(/\D/g, '');
  const requiredLength = brand === 'amex' ? 4 : 3;

  if (!clean) {
    return { valid: false, error: 'CVV security code is required' };
  }

  if (clean.length !== requiredLength) {
    return { valid: false, error: `${requiredLength}-digit security code required` };
  }

  return { valid: true };
};
