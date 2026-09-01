/**
 * Currency and Price Formatting Utilities for Zookas Unity Spirits
 * Supports Indian Rupee (INR - ₹) as the primary currency standard with customizable symbols.
 */

export const formatPrice = (
  amount: number | undefined | null,
  currencySymbol: string = '₹',
  includeDecimals: boolean = false
): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currencySymbol}0`;
  }

  // Format using Indian Numbering System if INR (or fallback clean localized formatting)
  try {
    const formattedNumber = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : (amount % 1 !== 0 ? 2 : 0),
    }).format(amount);

    return `${currencySymbol}${formattedNumber}`;
  } catch {
    const formatted = includeDecimals || amount % 1 !== 0 ? amount.toFixed(2) : amount.toString();
    return `${currencySymbol}${formatted}`;
  }
};

export const formatCurrencyAmount = (amount: number, currencySymbol: string = '₹'): string => {
  return formatPrice(amount, currencySymbol, false);
};
