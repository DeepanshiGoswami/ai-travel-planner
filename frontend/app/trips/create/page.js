'use client'
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from '@/lib/axios';

const INTERESTS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Relaxation'];

const FEATURED = [
  { name: 'Delhi, India', emoji: '🏛️' },
  { name: 'Jaipur, India', emoji: '🏰' },
  { name: 'Mumbai, India', emoji: '🌊' },
  { name: 'Goa, India', emoji: '🏖️' },
  { name: 'Kerala, India', emoji: '🚤' },
  { name: 'Meghalaya, India', emoji: '🏔️' },
  { name: 'Uttarakhand, India', emoji: '🛕' },
  { name: 'Himachal, India', emoji: '⛰️' },
  { name: 'Thailand', emoji: '🛕' },
  { name: 'London, UK', emoji: '💂' },
  { name: 'Paris, France', emoji: '🗼' },
  { name: 'Dubai, UAE', emoji: '🏙️' },
  { name: 'Singapore', emoji: '🦁' },
  { name: 'Bali, Indonesia', emoji: '🌴' },
];

export default function CreateTripPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefill = searchParams.get('destination') || '';
  
  const [formData, setFormData] = useState({
    destination: prefill,
    origin: '',
    homeCurrency: 'USD',
    days: 3,
    budget: 'Medium',
    interests: []
  });
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination.trim()) return alert('Enter a destination');
    if (!formData.interests.length) return alert('Select at least one interest');
    setLoading(true);
    try {
      const res = await axios.post('/api/trips', formData);
      router.push('/trips/' + res.data.trip._id);
    } catch (err) {
      alert('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Plan Your Trip</h1>
      <p className="text-gray-500 mb-6">Choose a featured destination or enter your own</p>

      {/* QUICK SELECT */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <p className="text-sm font-semibold text-gray-700 mb-3">Premium Destinations (with real activities & hotels):</p>
        <div className="flex flex-wrap gap-2">
          {FEATURED.map(d => (
            <button
              key={d.name}
              type="button"
              onClick={() => setFormData({...formData, destination: d.name})}
              className={'px-3 py-2 rounded-lg text-sm border-2 transition-all ' + 
                (formData.destination === d.name 
                  ? 'bg-blue-500 text-white border-blue-500 shadow-md scale-105' 
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow')}
            >
              {d.emoji} {d.name}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Origin */}
        <div>
          <label className="block text-sm font-medium mb-1">Flying From</label>
          <input type="text" value={formData.origin} 
            onChange={(e) => setFormData({...formData, origin: e.target.value})}
            className="w-full border rounded-lg px-3 py-2.5" placeholder="e.g., Delhi, India" />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium mb-1">Destination *</label>
          <input type="text" value={formData.destination} 
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            className="w-full border rounded-lg px-3 py-2.5 text-lg font-medium" 
            placeholder="e.g., Tokyo, Japan" required />
        </div>

        {/* Days */}
        <div>
          <label className="block text-sm font-medium mb-1">Days: <span className="font-bold text-blue-600">{formData.days}</span></label>
          <input type="range" min="1" max="14" value={formData.days}
            onChange={(e) => setFormData({...formData, days: parseInt(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
          <div className="flex justify-between text-xs text-gray-400"><span>1</span><span>14</span></div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-1">Budget Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['Low', 'Medium', 'High'].map(b => (
              <button key={b} type="button" onClick={() => setFormData({...formData, budget: b})}
                className={'py-3 rounded-lg border-2 font-medium transition-all ' + 
                  (formData.budget === b ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300')}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium mb-1">Interests (select at least one)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INTERESTS.map(i => (
              <button key={i} type="button" onClick={() => toggleInterest(i)}
                className={'py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ' + 
                  (formData.interests.includes(i) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300')}>
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading || !formData.interests.length}
          className="w-full bg-blue-600 text-white py-3.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold transition-colors">
          {loading ? 'Creating...' : 'Generate Itinerary'}
        </button>
      </form>
    </div>
  );
}
