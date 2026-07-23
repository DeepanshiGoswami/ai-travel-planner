const axios = require('axios');

class CurrencyService {
  constructor() {
    this.cache = {};
    this.cacheTimeout = 3600000; // 1 hour cache
  }

  async getExchangeRate(fromCurrency, toCurrency) {
    const cacheKey = fromCurrency + '_' + toCurrency;
    
    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.cacheTimeout) {
      return this.cache[cacheKey].rate;
    }

    try {
      const response = await axios.get(
        'https://api.exchangerate-api.com/v4/latest/' + fromCurrency
      );
      
      const rate = response.data.rates[toCurrency];
      
      this.cache[cacheKey] = {
        rate,
        timestamp: Date.now()
      };
      
      return rate;
    } catch (error) {
      console.error('Exchange rate API error:', error.message);
      return this.getStaticRate(fromCurrency, toCurrency);
    }
  }

  getStaticRate(from, to) {
    const staticRates = {
      USD_EUR: 0.85, USD_GBP: 0.73, USD_JPY: 110.5, USD_INR: 74.5,
      USD_AUD: 1.35, USD_CAD: 1.25, USD_CNY: 6.45, USD_KRW: 1150,
      EUR_USD: 1.18, EUR_GBP: 0.86, EUR_JPY: 130, EUR_INR: 88,
      GBP_USD: 1.38, GBP_EUR: 1.16, GBP_JPY: 151, GBP_INR: 102,
      INR_USD: 0.013, INR_EUR: 0.011, INR_GBP: 0.0098, INR_JPY: 1.48,
      JPY_USD: 0.009, JPY_EUR: 0.0077, JPY_GBP: 0.0066, JPY_INR: 0.67
    };
    
    const key = from + '_' + to;
    return staticRates[key] || 1;
  }

  getCurrencyForCountry(country) {
    const countryCurrencyMap = {
      'USA': 'USD', 'United States': 'USD', 'America': 'USD',
      'UK': 'GBP', 'United Kingdom': 'GBP', 'England': 'GBP', 'London': 'GBP',
      'Japan': 'JPY', 'Tokyo': 'JPY', 'India': 'INR',
      'France': 'EUR', 'Paris': 'EUR', 'Germany': 'EUR', 'Berlin': 'EUR',
      'Italy': 'EUR', 'Rome': 'EUR', 'Spain': 'EUR', 'Barcelona': 'EUR',
      'Australia': 'AUD', 'Sydney': 'AUD', 'Canada': 'CAD', 'Toronto': 'CAD',
      'China': 'CNY', 'Beijing': 'CNY', 'South Korea': 'KRW', 'Seoul': 'KRW',
      'Singapore': 'SGD', 'Thailand': 'THB', 'Bangkok': 'THB',
      'UAE': 'AED', 'Dubai': 'AED', 'Brazil': 'BRL', 'Mexico': 'MXN'
    };

    for (const [key, currency] of Object.entries(countryCurrencyMap)) {
      if (country.toLowerCase().includes(key.toLowerCase())) {
        return currency;
      }
    }
    
    return 'USD'; // Default to USD
  }

  async convertTripBudget(trip, targetCurrency) {
    const countryCurrency = this.getCurrencyForCountry(trip.destination);
    
    if (countryCurrency === targetCurrency) {
      return {
        ...trip.budgetEstimation,
        convertedCurrency: targetCurrency,
        exchangeRate: 1,
        conversionNote: 'Amounts shown in local currency'
      };
    }

    const rate = await this.getExchangeRate(countryCurrency, targetCurrency);
    
    return {
      flights: Math.round(trip.budgetEstimation.flights * rate),
      accommodation: Math.round(trip.budgetEstimation.accommodation * rate),
      food: Math.round(trip.budgetEstimation.food * rate),
      activities: Math.round(trip.budgetEstimation.activities * rate),
      total: Math.round((trip.budgetEstimation.total || 0) * rate),
      originalCurrency: countryCurrency,
      convertedCurrency: targetCurrency,
      exchangeRate: rate.toFixed(4),
      conversionNote: 'Converted at approximate rate. Actual rates may vary.'
    };
  }

  getCurrencySymbol(currency) {
    const symbols = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹',
      AUD: 'A$', CAD: 'C$', CNY: '¥', KRW: '₩', SGD: 'S$',
      THB: '฿', AED: 'د.إ', BRL: 'R$', MXN: 'Mex$'
    };
    return symbols[currency] || currency + ' ';
  }
}

module.exports = new CurrencyService();
