const fs = require('fs');
let code = fs.readFileSync('src/components/UnifiedCheckoutModal.tsx', 'utf8');

const regexSuccess = /const handleSuccess = async \(ref: string, method: string, isPending: boolean = false\) => \{[\s\S]*?if \(referredBy && !isPending\) \{/g;
const replacementSuccess = `const handleSuccess = async (ref: string, method: string, isPending: boolean = false) => {
    
    // Save to localStorage CRM
    try {
        let orders = JSON.parse(localStorage.getItem('orders_list') || '[]');
        const countryJSON = localStorage.getItem('goye_selected_country');
        const country = countryJSON ? JSON.parse(countryJSON) : { flag: '🌍', name: 'Unknown' };
        const currency = localStorage.getItem('goye_currency') || 'USD';
        const displaySymbol = currency === 'USD' ? '' : currency + ' ';
        
        orders.unshift({
            id: 'ORD-' + Date.now(),
            ref: ref,
            customerName: email.split('@')[0],
            customerEmail: email,
            country: country,
            productName: product.name,
            amount: displaySymbol + localPrice,
            amountUSD: priceUSD,
            currency: currency,
            method: method,
            status: isPending ? 'pending' : 'paid',
            date: new Date().toISOString()
        });
        localStorage.setItem('orders_list', JSON.stringify(orders.slice(0, 500)));
    } catch(e) {}
    
    const referredBy = localStorage.getItem('referred_by');
    if (referredBy && !isPending) {`;

code = code.replace(regexSuccess, replacementSuccess);
fs.writeFileSync('src/components/UnifiedCheckoutModal.tsx', code);
