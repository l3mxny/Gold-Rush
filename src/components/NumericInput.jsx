import React from 'react';

/**
 * Formats a number string with commas (e.g. 1234567.89 -> "1,234,567.89")
 */
function formatWithCommas(val) {
  if (val === '' || val === null || val === undefined) return '';
  const str = String(val).replace(/,/g, '');
  if (str === '' || str === '.') return str;
  const parts = str.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
}

/**
 * Strips commas from a formatted number string
 */
function stripCommas(str) {
  return String(str ?? '').replace(/,/g, '');
}

/**
 * Sanitizes input to only digits and optionally one decimal point
 */
function sanitizeNumericInput(str, allowDecimal = true) {
  const stripped = stripCommas(str);
  if (stripped === '') return '';
  let out = '';
  let foundDecimal = false;
  for (let i = 0; i < stripped.length; i++) {
    const c = stripped[i];
    if (c >= '0' && c <= '9') {
      out += c;
    } else if (allowDecimal && c === '.' && !foundDecimal) {
      out += c;
      foundDecimal = true;
    }
  }
  return out;
}

function isValidKey(key, allowDecimal, e) {
  if (/^[0-9]$/.test(key)) return true;
  if (allowDecimal && key === '.') return true;
  if (['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) return true;
  if ((key === 'a' || key === 'c' || key === 'v' || key === 'x') && (e?.ctrlKey || e?.metaKey)) return true;
  return false;
}

export default function NumericInput({
  value,
  onChange,
  allowDecimal = true,
  placeholder = '0',
  className = '',
  onKeyDown: onKeyDownProp,
  ...props
}) {
  const rawValue = typeof value === 'number' ? (isNaN(value) ? '' : String(value)) : stripCommas(String(value ?? ''));
  const displayValue = formatWithCommas(rawValue);

  const handleKeyDown = (e) => {
    if (!isValidKey(e.key, allowDecimal, e)) {
      e.preventDefault();
    }
    onKeyDownProp?.(e);
  };

  const handleChange = (e) => {
    const raw = sanitizeNumericInput(e.target.value, allowDecimal);
    onChange(raw);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData?.getData('text') || '').replace(/[^\d.]/g, '');
    onChange(sanitizeNumericInput(pasted, allowDecimal));
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={className}
      {...props}
    />
  );
}
