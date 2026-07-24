'use client'
import { useState } from 'react';
import axios from '@/lib/axios';

export default function CurrencyConverter({ tripId, originalBudget, itinerary }) {
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [convertedBudget, setConvertedBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showItineraryConversion, setShowItineraryConversion] = useState(false);

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  ];

  const rates = {
    USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 150, AUD: 1.53, AED: 3.67
  };

  const handleConvert = () => {
    setLoading(true);
    setError('');
    
    try {
      const rate = rates[targetCurrency] || 1;
      const symbol = currencies.find(c => c.code === targetCurrency)?.symbol || '$';
      
      setConvertedBudget({
        flights: Math.round((originalBudget?.flights || 0) * rate),
        accommodation: Math.round((originalBudget?.accommodation || 0) * rate),
        food: Math.round((originalBudget?.food || 0) * rate),
        activities: Math.round((originalBudget?.activities || 0) * rate),
        total: Math.round((originalBudget?.total || 0) * rate),
        rate,
        symbol,
        currency: targetCurrency
      });
    } catch (err) {
      setError('Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const convertActivityCost = (costInUSD) => {
    if (!convertedBudget) return null;
    return Math.round(costInUSD * convertedBudget.rate);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-xl font-bold mb-3">Currency Converter</h2>
      <p className="text-sm text-gray-500 mb-4">
        Convert all trip costs to your home currency
      </p>
      
      <div className="flex gap-3 mb-4">
        <select 
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
          className="border rounded px-3 py-2 flex-grow"
        >
          {currencies.map(c => (
            <option key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</option>
          ))}
        </select>
        
        <button onClick={handleConvert} disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? '...' : 'Convert'}
        </button>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      {convertedBudget && (
        <div>
          <div className="text-sm text-gray-500 mb-3 p-2 bg-gray-50 rounded">
            💱 Exchange Rate: 1 USD = {convertedBudget.rate} {convertedBudget.currency}
          </div>
          
          {/* Budget Summary Conversion */}
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold text-sm text-gray-700">Budget Breakdown</h3>
            <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
              <span>Flights</span>
              <span>
                <strong>{convertedBudget.symbol}{convertedBudget.flights.toLocaleString()}</strong>
                <span className="text-gray-400 ml-1">()</span>
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
              <span>Accommodation</span>
              <span>
                <strong>{convertedBudget.symbol}{convertedBudget.accommodation.toLocaleString()}</strong>
                <span className="text-gray-400 ml-1">()</span>
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
              <span>Food</span>
              <span>
                <strong>{convertedBudget.symbol}{convertedBudget.food.toLocaleString()}</strong>
                <span className="text-gray-400 ml-1">()</span>
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
              <span>Activities</span>
              <span>
                <strong>{convertedBudget.symbol}{convertedBudget.activities.toLocaleString()}</strong>
                <span className="text-gray-400 ml-1">()</span>
              </span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded font-bold">
              <span>Total</span>
              <span className="text-blue-700">{convertedBudget.symbol}{convertedBudget.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Activity Cost Reference */}
          <div className="border-t pt-3">
            <button 
              onClick={() => setShowItineraryConversion(!showItineraryConversion)}
              className="text-blue-600 hover:underline text-sm"
            >
              {showItineraryConversion ? 'Hide' : 'Show'} activity cost conversions
            </button>
            
            {showItineraryConversion && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                <p className="text-gray-600 mb-2">
                  Approximate activity costs in {convertedBudget.currency}:
                </p>
                <div className="space-y-1">
                  <p>Budget activity: {convertedBudget.symbol}{convertActivityCost(10)} - {convertedBudget.symbol}{convertActivityCost(20)}</p>
                  <p>Mid-range activity: {convertedBudget.symbol}{convertActivityCost(25)} - {convertedBudget.symbol}{convertActivityCost(50)}</p>
                  <p>Premium activity: {convertedBudget.symbol}{convertActivityCost(50)} - {convertedBudget.symbol}{convertActivityCost(200)}+</p>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Multiply individual activity USD costs by {convertedBudget.rate} for {convertedBudget.currency} equivalent
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
