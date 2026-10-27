// Indian Rupee (INR) Formatting Utility
export const formatINR = (amount, includeSymbol = true) => {
  const val = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const formatted = val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return includeSymbol ? `₹${formatted}` : formatted;
};

export const formatINRShorthand = (amount) => {
  const val = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  if (Math.abs(val) >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(val) >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  if (Math.abs(val) >= 1000) {
    return `₹${(val / 1000).toFixed(1)}k`;
  }
  return `₹${val.toFixed(0)}`;
};
