'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import CurrencyConverter from '@/components/CurrencyConverter';

export default function TripDetailPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  const [regeneratingDay, setRegeneratingDay] = useState(null);
  const [regenerateRequest, setRegenerateRequest] = useState('');
  const [addingToDay, setAddingToDay] = useState(null);
  const [newActivity, setNewActivity] = useState({ time: '09:00', activity: '', location: '', cost: 0 });

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await axios.get('/api/trips/' + id);
      const tripData = res.data.trip;
      setTrip(tripData);
      
      if (tripData && (tripData.status === 'generated' || tripData.status === 'modified')) {
        fetchHotelsAndInsights();
      }
    } catch (err) {
      console.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelsAndInsights = async () => {
    setLoadingHotels(true);
    setLoadingInsights(true);
    
    try {
      const hotelsRes = await axios.get('/api/hotels/' + id);
      setTrip(prev => prev ? { ...prev, hotelSuggestions: hotelsRes.data.hotels } : prev);
    } catch (err) {
      console.error('Failed to load hotels');
    } finally {
      setLoadingHotels(false);
    }
    
    try {
      const insightsRes = await axios.get('/api/hotels/' + id + '/insights');
      setTrip(prev => prev ? { ...prev, travelInsights: insightsRes.data.insights } : prev);
    } catch (err) {
      console.error('Failed to load insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  const generateItinerary = async () => {
    setGenerating(true);
    try {
      const res = await axios.post('/api/itinerary/' + id + '/generate');
      setTrip(res.data.trip);
      setTimeout(() => fetchHotelsAndInsights(), 500);
    } catch (err) {
      alert('Failed to generate itinerary: ' + (err.response?.data?.error || err.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerateDay = async (dayNumber) => {
    if (!regenerateRequest.trim()) return alert('Describe changes you want');
    try {
      await axios.post('/api/itinerary/' + id + '/day/' + dayNumber + '/regenerate', {
        modificationRequest: regenerateRequest
      });
      fetchTrip();
      setRegeneratingDay(null);
      setRegenerateRequest('');
    } catch (err) {
      alert('Failed to regenerate');
    }
  };

  const handleAddActivity = async (dayNumber) => {
    if (!newActivity.activity.trim()) return alert('Enter activity description');
    try {
      const res = await axios.post('/api/itinerary/' + id + '/day/' + dayNumber + '/activity', newActivity);
      setTrip(res.data.trip);
      setAddingToDay(null);
      setNewActivity({ time: '09:00', activity: '', location: '', cost: 0 });
    } catch (err) {
      alert('Failed to add activity');
    }
  };

  const handleRemoveActivity = async (dayNumber, activityIndex) => {
    if (!confirm('Remove this activity?')) return;
    try {
      const res = await axios.delete('/api/itinerary/' + id + '/day/' + dayNumber + '/activity/' + activityIndex);
      setTrip(res.data.trip);
    } catch (err) {
      alert('Failed to remove');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading trip...</p>
      </div>
    );
  }
  
  if (!trip) {
    return <div className="text-center py-12"><p className="text-xl text-gray-500">Trip not found</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{trip.destination}</h1>
        <div className="flex flex-wrap gap-3 mb-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{trip.days} Days</span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{trip.budget} Budget</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium capitalize">{trip.status}</span>
        </div>
        <p className="text-gray-600">Interests: {trip.interests?.join(', ')}</p>
      </div>

      {/* GENERATE BUTTON */}
      {trip.status === 'draft' && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-4 text-lg">Ready to plan your trip!</p>
          <button onClick={generateItinerary} disabled={generating}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold">
            {generating ? 'Generating...' : 'Generate Itinerary'}
          </button>
        </div>
      )}

      {(trip.status === 'generated' || trip.status === 'modified') && (
        <div className="space-y-8">

          {/* BUDGET SECTION */}
          {trip.budgetEstimation && (
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Budget Estimation</h2>
                <div className="space-y-3">
                  <div className="flex justify-between p-2"><span>Flights</span><span className="font-semibold">{'$'}{(trip.budgetEstimation.flights || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between p-2"><span>Accommodation</span><span className="font-semibold">{'$'}{(trip.budgetEstimation.accommodation || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between p-2"><span>Food</span><span className="font-semibold">{'$'}{(trip.budgetEstimation.food || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between p-2"><span>Activities</span><span className="font-semibold">{'$'}{(trip.budgetEstimation.activities || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between p-3 bg-blue-50 rounded font-bold text-lg border-t-2 border-blue-200">
                    <span>Total</span><span className="text-blue-700">{'$'}{(trip.budgetEstimation.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Currency Converter - pass itinerary as well */}
              <CurrencyConverter 
                tripId={trip._id} 
                originalBudget={trip.budgetEstimation} 
                itinerary={trip.itinerary}
              />
            </div>
          )}

          {/* HOTELS */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-2">Recommended Hotels</h2>
            <p className="text-gray-500 text-sm mb-4">Based on {trip.destination} and {trip.budget.toLowerCase()} budget</p>
            
            {loadingHotels ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : trip.hotelSuggestions && trip.hotelSuggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trip.hotelSuggestions.map((hotel, i) => (
                  <div key={i} className="border rounded-lg p-4 hover:shadow-lg">
                    <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium mb-2"
                      style={{ backgroundColor: hotel.category === 'Luxury' ? '#fef3c7' : hotel.category === 'Mid-range' ? '#dbeafe' : '#d1fae5',
                               color: hotel.category === 'Luxury' ? '#92400e' : hotel.category === 'Mid-range' ? '#1e40af' : '#065f46' }}>
                      {hotel.category}
                    </span>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Price: {hotel.priceRange}</p>
                      <p>Rating: {hotel.rating}/5</p>
                      <p>Location: {hotel.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No hotels loaded yet</p>
            )}
          </div>

          {/* TRAVEL INSIGHTS */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Travel Insights</h2>
            {loadingInsights ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : trip.travelInsights && Object.keys(trip.travelInsights).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trip.travelInsights.bestTimeToVisit && (
                  <div className="p-3 bg-white rounded"><h3 className="font-semibold">Best Time</h3><p className="text-sm text-gray-700 mt-1">{trip.travelInsights.bestTimeToVisit}</p></div>
                )}
                {trip.travelInsights.customs && (
                  <div className="p-3 bg-white rounded"><h3 className="font-semibold">Customs</h3><p className="text-sm text-gray-700 mt-1">{trip.travelInsights.customs}</p></div>
                )}
                {trip.travelInsights.mustTryFoods && (
                  <div className="p-3 bg-white rounded"><h3 className="font-semibold">Must-Try Foods</h3><ul className="list-disc list-inside text-sm text-gray-700 mt-1">{trip.travelInsights.mustTryFoods.map((f,i)=><li key={i}>{f}</li>)}</ul></div>
                )}
                {trip.travelInsights.hiddenGems && (
                  <div className="p-3 bg-white rounded"><h3 className="font-semibold">Hidden Gems</h3><ul className="list-disc list-inside text-sm text-gray-700 mt-1">{trip.travelInsights.hiddenGems.map((g,i)=><li key={i}>{g}</li>)}</ul></div>
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No insights loaded yet</p>
            )}
          </div>

          {/* ITINERARY */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Itinerary</h2>
            <p className="text-gray-500 text-sm mb-6">Click Regenerate, Add Activity, or hover to remove</p>
            
            {trip.itinerary?.map((day) => (
              <div key={day.day} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-wrap justify-between items-center mb-4 pb-3 border-b gap-2">
                  <h3 className="text-xl font-bold text-blue-600">Day {day.day}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => { setRegeneratingDay(regeneratingDay === day.day ? null : day.day); setAddingToDay(null); }}
                      className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded hover:bg-purple-200">Regenerate</button>
                    <button onClick={() => { setAddingToDay(addingToDay === day.day ? null : day.day); setRegeneratingDay(null); }}
                      className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200">+ Add Activity</button>
                  </div>
                </div>

                {regeneratingDay === day.day && (
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                    <input type="text" value={regenerateRequest} onChange={(e) => setRegenerateRequest(e.target.value)}
                      placeholder='e.g., "More outdoor activities"'
                      className="w-full border rounded px-3 py-2 mb-2" />
                    <div className="flex gap-2">
                      <button onClick={() => handleRegenerateDay(day.day)} className="bg-purple-600 text-white px-4 py-2 rounded text-sm">Regenerate</button>
                      <button onClick={() => { setRegeneratingDay(null); setRegenerateRequest(''); }} className="bg-gray-300 px-4 py-2 rounded text-sm">Cancel</button>
                    </div>
                  </div>
                )}

                {addingToDay === day.day && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs">Time</label><input type="time" value={newActivity.time} onChange={(e) => setNewActivity({...newActivity, time: e.target.value})} className="w-full border rounded px-2 py-1 text-sm" /></div>
                      <div><label className="text-xs">Cost</label><input type="number" value={newActivity.cost} onChange={(e) => setNewActivity({...newActivity, cost: parseInt(e.target.value) || 0})} className="w-full border rounded px-2 py-1 text-sm" /></div>
                      <div className="col-span-2"><label className="text-xs">Activity</label><input type="text" value={newActivity.activity} onChange={(e) => setNewActivity({...newActivity, activity: e.target.value})} placeholder="What?" className="w-full border rounded px-2 py-1 text-sm" /></div>
                      <div className="col-span-2"><label className="text-xs">Location</label><input type="text" value={newActivity.location} onChange={(e) => setNewActivity({...newActivity, location: e.target.value})} placeholder="Where?" className="w-full border rounded px-2 py-1 text-sm" /></div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleAddActivity(day.day)} className="bg-green-600 text-white px-4 py-2 rounded text-sm">Add</button>
                      <button onClick={() => { setAddingToDay(null); setNewActivity({ time: '09:00', activity: '', location: '', cost: 0 }); }} className="bg-gray-300 px-4 py-2 rounded text-sm">Cancel</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {day.activities?.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100">
                      <span className="text-sm font-mono text-gray-500 w-14">{activity.time}</span>
                      <div className="flex-grow">
                        <p className="font-medium">{activity.activity}</p>
                        {activity.location && <p className="text-sm text-gray-500">{activity.location}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.cost > 0 && <span className="text-green-600 font-medium text-sm">{'$'}{activity.cost}</span>}
                        <button onClick={() => handleRemoveActivity(day.day, i)}
                          className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 text-sm">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
