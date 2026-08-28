import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export const CURRENCIES = [
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
];

export default function CurrencyModal({ onClose, currentCurrency, onSelectCurrency, rates }: any) {
  const displayRates = rates || CURRENCIES;

  return (
    <div className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#FFD700] rounded-2xl w-full max-w-sm relative overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.1)]">
        <div className="bg-[#000] border-b border-[#333] p-4 flex items-center justify-between z-10">
          <h2 className="text-[#FFD700] font-bold text-lg">Select Currency</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-2 h-[400px] overflow-y-auto">
            {displayRates.map((curr: any) => (
              <button
                key={curr.code}
                onClick={() => {
                  onSelectCurrency(curr.code);
                  if (window.localStorage) {
                    localStorage.setItem('goye_preferred_currency', curr.code);
                  }
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${currentCurrency === curr.code ? 'border-[#FFD700] bg-[#FFD700]/10 text-white' : 'border-[#333] bg-black text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${currentCurrency === curr.code ? 'bg-[#FFD700] text-black' : 'bg-[#222] text-white'}`}>
                    {curr.symbol}
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{curr.code}</div>
                    <div className="text-[10px] opacity-70">{curr.name}</div>
                  </div>
                </div>
                {currentCurrency === curr.code && <Check className="text-[#FFD700]" size={20} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
