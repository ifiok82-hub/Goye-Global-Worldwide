const fs = require('fs');
let code = fs.readFileSync('src/components/CurrencyModal.tsx', 'utf8');

const newCurrencies = `export const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'NGN', symbol: '₦', rate: 1500, name: 'Nigerian Naira' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'CAD', symbol: 'C$', rate: 1.35, name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', rate: 83.0, name: 'Indian Rupee' },
  { code: 'ZAR', symbol: 'R', rate: 18.9, name: 'South African Rand' },
  { code: 'GHS', symbol: '₵', rate: 12.5, name: 'Ghanaian Cedi' },
  { code: 'KES', symbol: 'KSh', rate: 155.0, name: 'Kenyan Shilling' },
  { code: 'USDC', symbol: 'USDC', rate: 1, name: 'USD Coin' },
  { code: 'PI', symbol: 'π', rate: 1/314159, name: 'Pi Network GCV' }
];`;

const oldCurrencies = /export const CURRENCIES = \[.*?\];/s;
code = code.replace(oldCurrencies, newCurrencies);
fs.writeFileSync('src/components/CurrencyModal.tsx', code);
