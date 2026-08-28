const fs = require('fs');

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', phone: '+1', currency: 'USD' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', phone: '+234', currency: 'NGN' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phone: '+44', currency: 'GBP' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', phone: '+1', currency: 'CAD' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', phone: '+61', currency: 'AUD' },
  { code: 'IN', name: 'India', flag: '🇮🇳', phone: '+91', currency: 'INR' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', phone: '+27', currency: 'ZAR' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', phone: '+233', currency: 'GHS' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', phone: '+254', currency: 'KES' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', phone: '+49', currency: 'EUR' },
  { code: 'FR', name: 'France', flag: '🇫🇷', phone: '+33', currency: 'EUR' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', phone: '+971', currency: 'AED' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', phone: '+966', currency: 'SAR' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', phone: '+63', currency: 'PHP' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', phone: '+55', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', phone: '+52', currency: 'MXN' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', phone: '+62', currency: 'IDR' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', phone: '+92', currency: 'PKR' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', phone: '+880', currency: 'BDT' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', phone: '+20', currency: 'EGP' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', phone: '+251', currency: 'ETB' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', phone: '+255', currency: 'TZS' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', phone: '+256', currency: 'UGX' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', phone: '+237', currency: 'XAF' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', phone: '+225', currency: 'XOF' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', phone: '+221', currency: 'XOF' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', phone: '+260', currency: 'ZMW' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', phone: '+263', currency: 'ZWL' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', phone: '+250', currency: 'RWF' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', phone: '+267', currency: 'BWP' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', phone: '+264', currency: 'NAD' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', phone: '+230', currency: 'MUR' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', phone: '+212', currency: 'MAD' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', phone: '+213', currency: 'DZD' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', phone: '+216', currency: 'TND' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', phone: '+218', currency: 'LYD' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', phone: '+249', currency: 'SDG' }
];

let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const regex = /const COUNTRIES = \[.*?\];/s;
if (code.match(regex)) {
    code = code.replace(regex, 'const COUNTRIES = ' + JSON.stringify(countries, null, 2) + ';');
    fs.writeFileSync('src/components/AuthScreen.tsx', code);
    console.log('Replaced existing COUNTRIES array.');
} else {
    // Inject it after imports
    const importMatch = code.match(/import .*?;/g);
    const lastImport = importMatch[importMatch.length - 1];
    code = code.replace(lastImport, lastImport + '\n\nexport const COUNTRIES = ' + JSON.stringify(countries, null, 2) + ';\n');
    fs.writeFileSync('src/components/AuthScreen.tsx', code);
    console.log('Injected COUNTRIES array.');
}
