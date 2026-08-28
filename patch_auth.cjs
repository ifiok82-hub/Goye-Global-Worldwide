const fs = require('fs');
let code = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const regexSync = /localStorage\.setItem\('goye_users', JSON\.stringify\(users\)\);[\s\S]*?\/\/ Sync to Firestore Users collection/g;
const replacementSync = `localStorage.setItem('goye_users', JSON.stringify(users));

        // Add to CRM customers_list
        let customers = JSON.parse(localStorage.getItem('customers_list') || '[]');
        let registeredCount = parseInt(localStorage.getItem('registered_customers') || '0');
        customers.unshift({
            id: uid,
            pupilName: firstName + ' ' + surname,
            parentName: '',
            country: selectedCountry || {flag: '🌍', name: 'Unknown', currency: 'USD'},
            age: '',
            email: emailToUse,
            whatsapp: contactValue,
            slot: '',
            date: new Date().toISOString(),
            status: 'Registered',
            is_verified: false
        });
        localStorage.setItem('customers_list', JSON.stringify(customers));
        localStorage.setItem('registered_customers', (registeredCount + 1).toString());

        // Sync to Firestore Users collection`;

code = code.replace(regexSync, replacementSync);
fs.writeFileSync('src/components/AuthScreen.tsx', code);
