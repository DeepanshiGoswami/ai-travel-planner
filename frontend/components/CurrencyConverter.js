'use client'
import { useState } from 'react';
import axios from '@/lib/axios';

export default function CurrencyConverter({ tripId, originalBudget }) {
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [convertedBudget, setConvertedBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ];

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/currency/trip/' + tripId + '/convert?to=' + targetCurrency);
      setConvertedBudget(res.data);
    } catch (err) {
      setError('Failed to convert currency');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4">💱 Currency Converter</h2>
      
      <div className="flex gap-4 mb-4">
        <select 
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
          className="border rounded px-3 py-2 flex-grow"
        >
          {currencies.map(c => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code} - {c.name}
            </option>
          ))}
        </select>
        
        <button 
          onClick={handleConvert}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {convertedBudget && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Exchange Rate</div>
              <div className="font-bold">
                1 USD = {convertedBudget.convertedBudget.exchangeRate} {targetCurrency}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Target Currency</div>
              <div className="font-bold">{targetCurrency} ({convertedBudget.targetCurrencySymbol})</div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <h3 className="font-semibold text-lg">Converted Budget</h3>
            {['flights', 'accommodation', 'food', 'activities'].map(category => (
              <div key={category} className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="capitalize">{category}</span>
                <div>
                  <span className="font-semibold">
                    {convertedBudget.targetCurrencySymbol}{convertedBudget.convertedBudget[category]}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    ()
                  </span>
                </div>
              </div>
            ))}
            <div className="flex justify-between p-3 bg-blue-50 rounded font-bold text-lg">
              <span>Total</span>
              <span>
                {convertedBudget.targetCurrencySymbol}{convertedBudget.convertedBudget.total}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
